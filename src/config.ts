import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

export const config = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE_MB),
  allowedExtensions: process.env.ALLOWED_EXTENSIONS,
  nodeEnv: process.env.NODE_ENV,
  botToken: process.env.BOT_TOKEN,
  tz: process.env.TZ,
}
