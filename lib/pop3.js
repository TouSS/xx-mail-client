const net = require('net')
const tls = require('tls')

class POP3 {
  constructor() {
    this._sockt = null
    this.multiResp = false
    this.respEnd = false
  }

  connect(host, encrypt, port) {
    return new Promise((resolve, reject) => {
      if (!host) return reject('Invalid host.')
      if (!port) port = encrypt ? 995 : 110
      if (encrypt) {
        this._sockt = tls.connect(
          port,
          host
        )
      } else {
        this._sockt = net.connect(
          port,
          host
        )
      }
      this._sockt.on('connect', () => {})
      this._sockt.on('data', _data => {
        return this._checkResp(_data.toString('ascii'), resolve, reject)
      })
      this._sockt.on('error', error => {
        return reject(error.message)
      })
    })
  }

  _sendCommand(verb, param) {
    this._sockt.removeAllListeners()
    return new Promise((resolve, reject) => {
      if (!verb) return reject('Invalid command.')
      let command = `${verb}${param ? ` ${param}` : ''}\r\n`
      this._sockt.write(command)
      let resp = ''
      this._sockt.on('data', _data => {
        resp += _data.toString('ascii')
        if (!this.multiResp) {
          this.respEnd = true
        } else {
          if (_data.toString('ascii').endsWith('.\r\n')) {
            this.respEnd = true
          }
        }
        if (this.respEnd) {
          return this._checkResp(resp, resolve, reject)
        }
      })
      this._sockt.on('error', error => {
        return reject(error.message)
      })
    })
  }

  _checkResp(resp, resolve, reject) {
    if (resp.substr(0, 3).toUpperCase() === '+OK') {
      //命令执行成功
      return resolve(resp)
    } else if (resp.substr(0, 4).toUpperCase() === '-ERR') {
      //命令执行失败
      return reject(resp)
    } else {
      //未知结果返回
      return reject('Invalid response.')
    }
  }
}

module.exports = POP3
