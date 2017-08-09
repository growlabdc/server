'use strict'

let config
try {
  config = require('./config')
} catch(e) {
  throw new Error('missing config file')
}

const fs = require('fs')
const SerialPort = require('serialport')
const path = require('path')
const app = require('express')()

const http = require('http').createServer(app)
const https = require('https').createServer({
  key: fs.readFileSync(config.key_path),
  cert: fs.readFileSync(config.cert_path)
}, app)
const io = require('socket.io')(https)

const relays = require('./utils/relays')
const serialParser = require('./utils/serial_parser')
const system = require('./system')
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
const SSL_PORT = process.env.SSL_PORT || config.ssl_port || 3000

relays.setup()
system.load()

const serial = new SerialPort.parsers.Readline({ delimiter: '\r\n' })
const serialport = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })

function ensureSecure(req, res, next){
  if (req.secure){
    return next();
  }
  console.log('redirecting route to https')
  res.redirect('https://' + req.hostname + req.url)
}

app.all('*', ensureSecure)
app.use('/api', api)
app.get('/', (req, res) => {
  res.sendFile(path.resolve('client/dist/index.html'))
})

http.listen(PORT)
https.listen(SSL_PORT, () => {
  console.log(`listening on *:${SSL_PORT}`);
})

io.on('connection', (socket) => {
  console.log('a user connected')
})

serialport.pipe(serial)
serialport.on('open', () => console.log('Port open'))
serial.on('data', (message) => {
  const item = serialParser(message)

  if (!item.type)
    return

  if (config.automate)
    control.evaluate(item)

  sensor_data[item.data.key].push(item.data.value)
  io.sockets.emit(item.data.key, item.data.value)
})

relays.ac.watch(function() {
  io.sockets.emit('ac.status', relays.ac.status())
})

relays.light.watch(function() {
  io.sockets.emit('light.status', relays.light.status())
})

relays.exhaust.watch(function() {
  io.sockets.emit('exhaust.status', relays.exhaust.status())
})

relays.drain_valve.watch(function() {
  io.sockets.emit('drain_valve.status', relays.drain_valve.status())
})

relays.fill_valve.watch(function() {
  io.sockets.emit('fill_valve.status', relays.fill_valve.status())
})

relays.drain_pump.watch(function() {
  io.sockets.emit('drain_pump.status', relays.drain_pump.status())
})

relays.grow_system_pumps.watch(function() {
  io.sockets.emit('grow_system_pumps.status', relays.grow_system_pumps.status())
})

system.events.on('change', function(value) {
  io.sockets.emit('system.state', value)
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
setInterval(logData, logging_interval)

if (config.light_program) {
  const light_interval = 1000 * 60 * 1 // every minute
  setInterval(control.light_program, light_interval)
}
