'use strict'

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const PORT = process.env.PORT || 3000
const PERIOD_INTERVAL = 1000 * 60

let period_start = new Date()
let bucket_one_temperature = []
let bucket_two_temperature = []
let bucket_three_temperature = []
let bucket_four_temperature = []
let bucket_resevoir_temperature = []
let air_temperature = []
let humidity = []
let lux = []
let ph = []
let water_level = []

const parser = new parsers.Readline({ delimiter: '\r\n' })
const serialport = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
})

app.get('/', (req, res) => {
  res.send('OK')
})

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
})

serialport.pipe(parser)

serialport.on('open', () => console.log('Port open'))

parser.on('data', (message) => {
  io.sockets.emit('new message', message);
  console.log(message)

  //TODO: parse message and store in proper array

  const now = new Date()
  if (now.getTime() - period_start.getTime() > PERIOD_INTERVAL) {

    //TODO: store averages to disk
    //TODO: purge arrays
  }
})
