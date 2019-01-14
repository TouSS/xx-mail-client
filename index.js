const Koa = require('koa')
const app = new Koa()

const port = 3000

app.use(ctx => {
  ctx.body = 'Hello Koa !!!'
})

app.listen(port)
console.log(`Server start at ${port} ...`)
