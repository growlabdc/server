'use strict'

const config = require('./config')

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const SerialPort = require('serialport')

const serialParser = require('./utils/serial_parser')
const api = require('./api')
const db = require('./db')

const PORT = process.env.PORT || config.port || 8080

const serial = new SerialPort.parsers.Readline({ delimiter: '\r\n' })
const serialport = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
})

app.use('/api', api)

app.get('/', (req, res) => {
  res.sendFile('client/dist/index.html')
})

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
})

serialport.pipe(serial)

serialport.on('open', () => console.log('Port open'))

serial.on('data', (message) => {
  const item = serialParser(message)
  console.log(item)

  if (!item.type)
    return

  io.sockets.emit(item.data.key, item.data.value)
  db.recorder(item.data.key)(item.data.value)
})
