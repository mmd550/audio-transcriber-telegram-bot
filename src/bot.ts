import * as dotenv from "dotenv"
import path from "path"
import { Context, NarrowedContext, Telegraf } from "telegraf"
// import { message } from "telegraf/filters"
import { transcribe } from "./transcriber"
import { Message, Update } from "telegraf/typings/core/types/typegram"

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const allowedExtensions = process.env.ALLOWED_EXTENSIONS.split(",")

const maxFileSizeMB = Number(process.env.MAX_FILE_SIZE_MB)
const maxFileSize = maxFileSizeMB * 1024 * 1024

async function validateFileTypeByFileName(
  ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
  fileName: string,
  fileSize: number,
): Promise<boolean> {
  let exceededFileSizeLimit: boolean | undefined

  const fileExtension = path.extname(fileName).toLowerCase()

  if (allowedExtensions.includes(fileExtension)) {
    if (fileSize <= maxFileSize) return true
    else exceededFileSizeLimit = true
  }

  if (exceededFileSizeLimit)
    await ctx.reply(
      `The file is too large. Please send a file smaller than ${maxFileSizeMB} MB.`,
    )
  else
    await ctx.reply(
      `Sorry, I only accept audio files. Supported formats are: ${allowedExtensions.join(", ")}`,
    )

  return false
}

async function handleMessage(
  ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
) {
  try {
    const message = ctx.message
    let fileId: string | undefined,
      fileName: string | undefined,
      fileSize: number | undefined

    if ("document" in message) {
      fileId = message.document.file_id
      fileName = message.document.file_name
      fileSize = message.document.file_size
    }

    if ("audio" in message) {
      fileId = message.audio.file_id
      fileName = message.audio.file_name
      fileSize = message.audio.file_size
    }

    if ("voice" in message) {
      fileId = message.voice.file_id
      //  Voice message doesn't have name and is always of type ogg
      fileName = "voice.ogg"
      fileSize = message.voice.file_size
    }

    if (fileName && fileId && fileSize) {
      const isFileValid = await validateFileTypeByFileName(
        ctx,
        fileName,
        fileSize,
      )
      if (isFileValid) {
        const fileLink = await ctx.telegram.getFileLink(fileId)

        await ctx.reply(
          `We have received the audio and we are transcribing it. please be patient...`,
        )

        const text = await transcribe(fileLink)

        await ctx.reply(`Here is the transcription for your audio:\n ${text}`)
      } else return
    } else {
      await ctx.reply("Please send me a file, and I will respond to it.")
      return
    }
  } catch (e) {
    await ctx.reply("Something went wrong while processing your file.")
  }
}

bot.on("message", handleMessage)

// bot.on(message("text"), async () => {})

bot.start(async (ctx) => {
  await ctx.reply("Welcome to the AudioTranscriber bot! 🎉")
  await ctx.reply(
    `I am here to transcribe your voices. You can send me a voice or audio file message, and I will transcribe it for you.\n Currently I support these audio formats: [${process.env.ALLOWED_EXTENSIONS}]`,
  )
})

bot.launch()

console.log("Bot is running...")

// Graceful stop on SIGINT or SIGTERM
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))