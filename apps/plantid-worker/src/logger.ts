import { createLogger, format, transports } from "winston"
const { combine, colorize, timestamp, printf, metadata } = format

const customFormat = printf((info) => {
  const { requestId, ...metadata } = info["metadata"] as Record<string, string>
  const result = [info["timestamp"]]

  if (requestId) result.push(`[${requestId}]`)

  result.push(info.level, info.message)

  if (Object.keys(metadata).length) {
    result.push(JSON.stringify(metadata))
  }

  return result.join(" ")
})

const logger = createLogger({
  level: "debug",
  format: combine(metadata(), timestamp(), customFormat),
  transports: [
    // Write all logs with importance level of `error` or higher to `error.log`
    // (i.e., error, fatal, but not other levels)
    new transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    // Write all logs with importance level of `info` or higher to `combined.log`
    // (i.e., fatal, error, warn, and info, but not trace)
    new transports.File({ filename: "./logs/combined.log" }),
  ],
})

// Also log to console when not in production.
if (process.env["NODE_ENV"] !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), customFormat),
    })
  )
}

export default logger
