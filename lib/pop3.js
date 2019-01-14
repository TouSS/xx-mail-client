const net = require('net')
const tls = require('tls')

const errCode = {
  '404': '网络链接错误',
  '301': '无效命令',
  '302': '命令发送失败',
  '303': '命令执行失败',
  '501': '用户名不存在',
  '502': '密码错误',
}

const VERB = {
  USER: 'USER',
  PASS: 'PASS',
  APOP: 'APOP',
  STAT: 'STAT',
  UIDL: 'UIDL',
  LIST: 'LIST',
  RETR: 'RETR',
  DELE: 'DELE',
  RSET: 'RSET',
  TOP: 'TOP',
  NOOP: 'NOOP',
  QUIT: 'QUIT'
}

class POP3 {
  constructor() {
    this.runningCommand = null
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

  disconnect() {
    this._sockt.end()
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

  user(username) {
    this.runningCommand = VERB.USER
    this.multiResp = false
    this.respEnd = false
    return this._sendCommand(this.runningCommand, username)
  }
  pass(password) {
    this.runningCommand = VERB.PASS
    this.multiResp = false
    this.respEnd = false
    return this._sendCommand(this.runningCommand, password)
  }
  apop(username, secret, apopTimeStamp) {
    this.runningCommand = VERB.APOP
    this.multiResp = false
    this.respEnd = false
    return this._sendCommand(this.runningCommand, `${username} ${crypto.createHash("md5").update(apopTimeStamp + secret).digest("hex")}`)
  }
  stat() {
    this.runningCommand = VERB.STAT
    this.multiResp = false
    this.respEnd = false
    return this._sendCommand(this.runningCommand)
  }
  uidl(msgNum) {
    this.runningCommand = VERB.UIDL
    this.respEnd = false
    this.multiResp = !msgNum
    return this._sendCommand(this.runningCommand, msgNum)
  }
  list(msgNum) {
    this.runningCommand = VERB.LIST
    this.respEnd = false
    this.multiResp = !msgNum
    return this._sendCommand(this.runningCommand, msgNum)
  }
  retr(msgNum) {
    this.runningCommand = VERB.RETR
    this.respEnd = false
    this.multiResp = true
    return this._sendCommand(this.runningCommand, msgNum)
  }
  dele(msgNum) {
    this.runningCommand = VERB.DELE
    this.respEnd = false
    this.multiResp = false
    return this._sendCommand(this.runningCommand, msgNum)
  }
  rset() {
    this.runningCommand = VERB.RSET
    this.respEnd = false
    this.multiResp = false
    return this._sendCommand(this.runningCommand)
  }
  top(num) {
    this.runningCommand = VERB.TOP
    this.respEnd = false
    this.multiResp = true
    return this._sendCommand(this.runningCommand, num)
  }
  noop() {
    this.runningCommand = VERB.NOOP
    this.respEnd = false
    this.multiResp = false
    return this._sendCommand(this.runningCommand)
  }
  quit() {
    this.runningCommand = VERB.QUIT
    this.respEnd = false
    this.multiResp = false
    return this._sendCommand(this.runningCommand)
  }
}

module.exports = {POP3, errCode, VERB}
