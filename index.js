'use strict'

let config
try {
  config = require('./config')
} catch(e) {
  throw new Error('missing config file')
}

const fs = require('fs')
const SerialPort = require('serialport')
const proxy = require('express-http-proxy')
const path = require('path')
const app = require('express')()
const Logger = require('logplease');

const http = require('http').createServer(app)
const https = require('https').createServer({
  key: fs.readFileSync(config.key_path),
  cert: fs.readFileSync(config.cert_path)
}, app)
const io = require('socket.io')(https)

const relays = require('./utils/relays')
const serialParser = require('./utils/serial_parser')
const system = require('./system')
const sensors = require('./utils/sensors')
const api = require('./api')
const control = require('./control')
const notification = require('./utils/notification').sendNotification
const db = require('./db')

const PORT = process.env.PORT || config.port || 8080
const SSL_PORT = process.env.SSL_PORT || config.ssl_port || 3000

relays.setup()
system.load()

const serial = new SerialPort.parsers.Readline({ delimiter: '\r\n' })
const serialport = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })
const logger = Logger.create('server')

function ensureSecure(req, res, next){
  if (req.secure){
    return next();
  }
  logger.info('redirecting http connection to https')
  res.redirect('https://' + req.hostname + req.url)
}

app.all('*', ensureSecure)
app.use('/api', api)
app.get('/', (req, res) => {
  res.sendFile(path.resolve('client/dist/index.html'))
})

if (config.cameras.length) {
  config.cameras.forEach(function(camera) {
    app.use(camera.path, proxy(camera.host))
  })
}

http.listen(PORT)
https.listen(SSL_PORT, () => {
  logger.info(`listening on *:${SSL_PORT}`);
})

io.on('connection', (socket) => {
  logger.info('socket.io connection made')
})

relays.ac.watch(function() {
  const status = relays.ac.status()
  io.sockets.emit('ac.status', status)
  db.recorder('ac.status', status)
})

relays.light.watch(function() {
  const status = relays.light.status()
  io.sockets.emit('light.status', status)
  db.recorder('light.status', status)
})

relays.exhaust.watch(function() {
  const status = relays.exhaust.status()
  io.sockets.emit('exhaust.status', status)
  db.recorder('exhaust.status', status)
})

relays.drain_valve.watch(function() {
  const status = relays.drain_valve.status()
  io.sockets.emit('drain_valve.status', status)
  db.recorder('drain_valve.status', status)
})

relays.fill_valve.watch(function() {
  const status = relays.fill_valve.status()
  io.sockets.emit('fill_valve.status', status)
  db.recorder('fill_valve.status', status)
})

relays.drain_pump.watch(function() {
  const status = relays.drain_pump.status()
  io.sockets.emit('drain_pump.status', status)
  db.recorder('drain_pump.status', status)
})

relays.grow_system_pumps.watch(function() {
  const status = relays.grow_system_pumps.status()
  io.sockets.emit('grow_system_pumps.status', status)
  db.recorder('grow_system_pumps.status', status)
})

system.events.on('change', function(value) {
  io.sockets.emit('system.state', value)
  db.recorder('system.state', value)

  if (config.notification)
    sendNotification({
      title: 'System State Changed',
      body: value
    })
})

const logging_interval = 1000 * 60 * 1 // every minute
setInterval(sensors.record, logging_interval)

if (config.light_program) {
  const light_interval = 1000 * 60 * 1 // every minute
  setInterval(control.light_program, light_interval)
}

serialport.pipe(serial)
serialport.on('open', () => logger.info('serial port opened'))
serial.on('data', (message) => {
  const item = serialParser(message)

  if (!item.type)
    return

  if (!sensors.isValid(item))
    return

  sensors.evaluate(item)

  if (config.automate)
    control.evaluate(item)

  io.sockets.emit(item.data.key, item.data.value)
})
