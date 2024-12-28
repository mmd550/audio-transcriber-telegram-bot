declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string
      NODE_ENV: "development" | "production"
      PWD: string
      ALLOWED_EXTENSIONS: string
      MAX_FILE_SIZE_MB: string
    }
  }
}

export {}
