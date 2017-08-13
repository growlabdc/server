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
const notification = require('./utils/notification').sendNotification

const PORT = process.env.PORT || config.port || 8080
const SSL_PORT = process.env.SSL_PORT || config.ssl_port || 3000

relays.setup()
system.load()

const serial = new SerialPort.parsers.Readline({ delimiter: '\r\n' })
const serialport = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })
const logger = Logger.create('app')

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
