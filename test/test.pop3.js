const POP3 = require('../lib/pop3')

const simpleParser = require("mailparser").simpleParser

let client = new POP3()

client.multiResp = false
client
  .connect('pop3.zltel.com.cn')
  .then(resp => {
    //console.log(resp)
    client
      ._sendCommand('USER', 'dengxx@zltel.com.cn')
      .then(resp => {
        console.log(resp)
        client
          ._sendCommand('PASS', '@toush00')
          .then(resp => {
            console.log(resp)
            client.multiResp = true
            client.respEnd = false
            client
              ._sendCommand('retr', '1')
              .then(resp => {
                simpleParser(resp)
                  .then(mail => {console.log(mail)})
                  .catch(err => {console.error(err)})
                client.multiResp = false
                client.respEnd = false
                client
                  ._sendCommand('QUIT')
                  .then(resp => {
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
