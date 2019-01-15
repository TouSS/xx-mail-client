const Koa = require('koa')
const app = new Koa()

const config = require('./config')
const logger = require('./lib/log')('MAIN')

app.use(ctx => {
  ctx.body = 'Hello Koa !!!'
})

app.listen(config.server.port)
logger.info(`Server start at ${config.server.port} ...`)
