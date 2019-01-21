module.exports = {
  __home: __dirname,
  server: {
    port: 3000,
    name: 'Mail Client'
  },
  log4js: {
    /* pm2: true,
        disableClustering: true, */
    appenders: {
      console: { type: 'console' },
      stdout: { type: 'stdout' },
      dateFile: {
        type: 'dateFile',
        filename: __dirname + '/logs/the-all.log',
        pattern: '.yyyy-MM-dd'
      }
    },
    categories: {
      default: { appenders: ['console', 'dateFile'], level: 'debug' }
    }
  },
  mysql: {
    host: '<host>',
    port: 3306,
    user: '<user>',
    password: '<passed>',
    connectionLimit: 2,
    queueLimit: 5,
    database: '<database>'
  }
}
