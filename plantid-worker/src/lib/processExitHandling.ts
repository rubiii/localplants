import logger from '../logger.js'

export default function setupProcessExitHandling() {
  process.on('beforeExit', (code) => {
    logger.info('Process beforeExit event with code: ', code)
  })

  // only works when the process normally exits
  // on windows, ctrl-c will not trigger this handler (it is unnormal)
  // unless you listen on 'SIGINT'
  process.on('exit', (code) => {
    logger.info('Process exit event with code: ', code)
  })

  // just in case some user like using "kill"
  process.on('SIGTERM', (signal) => {
    logger.info(`Process ${process.pid} received a SIGTERM signal`)
    process.exit(0)
  })

  // catch ctrl-c, so that event 'exit' always works
  process.on('SIGINT', (signal) => {
    logger.info(`Process ${process.pid} has been interrupted`)
    process.exit(0)
  })

  // what about errors
  // try remove/comment this handler, 'exit' event still works
  process.on('uncaughtException', (err) => {
    logger.info(`Uncaught Exception: ${err.message}\n${err.stack}`)
    process.exit(1)
  })
}
