const { POP3 } = require('../lib/pop3')

const simpleParser = require('mailparser').simpleParser

let client = new POP3()

client.multiResp = false
client
  .connect('host')
  .then(resp => {
    //console.log(resp)
    client
      .user('username')
      .then(resp => {
        console.log(resp)
        client
          .pass('password')
          .then(resp => {
            console.log(resp)
            client
              .retr('232')
              .then(resp => {
                simpleParser(resp)
                  .then(mail => {
                    console.log(mail)
                  })
                  .catch(err => {
                    console.error(err)
                  })
                client.quit().then(resp => {
                  console.log(resp)
                })
              })
              .catch(err => {
                console.error(err)
              })
          })
          .catch(err => {
            console.error(err)
          })
      })
      .catch(error => {
        console.error(error)
      })
  })
  .catch(error => {
    console.error(error)
  })
