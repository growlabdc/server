'use strict'

const config = require('./config')

const path = require('path')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const SerialPort = require('serialport')

const sensors = require('./utils/sensors')
const serialParser = require('./utils/serial_parser')
const api = require('./api')
const db = require('./db')

let sensor_data = {
  'reservoir.ph': [],
  'bucket.1.temperature': [],
  'bucket.2.temperature': [],
  'bucket.3.temperature': [],
  'bucket.4.temperature': [],
  'bucket.5.temperature': [],
  'tent.humidity': [],
  'tent.temperature': [],
  'reservoir.water_level': [],
  'tent.infrared_spectrum': [],
  'tent.full_spectrum': [],
  'tent.visible_spectrum': [],
  'tent.illuminance':[]
}

const PORT = process.env.PORT || config.port || 8080

sensors.setup()

const serial = new SerialPort.parsers.Readline({ delimiter: '\r\n' })
const serialport = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
})

app.use('/api', api)

app.get('/', (req, res) => {
  res.sendFile(path.resolve('client/dist/index.html'))
})

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
})

io.on('connection', (socket) => {
  console.log('a user connected')
})

serialport.pipe(serial)

serialport.on('open', () => console.log('Port open'))

serial.on('data', (message) => {
  const item = serialParser(message)
  console.log(item)

  if (!item.type)
    return

  sensor_data[item.data.key].push(item.data.value)
  io.sockets.emit(item.data.key, item.data.value)
})

const logData = function() {
  Object.keys(sensor_data).forEach(function(data_key,index) {
    let total = 0
    let values = sensor_data[data_key]
    for(let i=0;i<values.length;i++) {
      total += values[i]
    }

    let average = (total / values.length).toFixed(1)

    db.recorder(data_key)(average)
    sensor_data[data_key] = [] // reset values
  })
}
const logging_interval = 1000 * 60 * 1 // every minute
setTimeout(logData, logging_interval)
