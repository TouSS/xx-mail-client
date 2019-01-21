const mysql = require('mysql')

const options = require('../config').mysql

const pool = mysql.createPool(options)

function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err)
      return resolve(connection)
    })
  })
}

function end() {
  return new Promise((resolve, reject) => {
    pool.end(err => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

async function getTemplate() {
  let conn = await getConnection()
  return {
    beginTransaction: () => {
      return new Promise((resolve, reject) => {
        conn.beginTransaction(err => {
          if (err) return reject(err)
          return resolve()
        })
      })
    },
    commit: () => {
      return new Promise((resolve, reject) => {
        conn.commit(err => {
          if (err) {
            connection.rollback(err => {
              return reject(err)
            })
            return resolve()
          }
          return resolve()
        })
      })
    },
    execute: (sql, params) => {
      return new Promise((resolve, reject) => {
        conn.query(sql, params, (err, results, fields) => {
          if (err) return reject(err)
          resolve({
            results: results,
            fields: fields
          })
        })
      })
    }
  }
}

module.exports = {
  getConnection: getConnection,
  end: end,
  getTemplate: getTemplate
}
