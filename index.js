'use strict'

let config
try {
  config = require('./config')
} catch(e) {
  throw new Error('missing config file')
}

const SERIAL_TIMEOUT = 60 * 1000

const fs = require('fs')
const SerialPort = require('serialport')
const proxy = require('express-http-proxy')
const path = require('path')
const express = require('express')
const Logger = require('logplease')
const moment = require('moment')

const app = express()

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
const sendNotification = require('./utils/notification').sendNotification

const PORT = process.env.PORT || config.port || 8080
const SSL_PORT = process.env.SSL_PORT || config.ssl_port || 3000

relays.setup()
system.load()

const serial = new SerialPort.parsers.Readline({ delimiter: '\r\n' })
const serialport = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })
const logger = Logger.create('server')

function ensureSecure(req, res, next){
  if (req.secure){
    return next()
  }
  logger.info('redirecting http connection to https')
  res.redirect('https://' + req.hostname + req.url)
}

app.all('*', ensureSecure)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

  if ('OPTIONS' === req.method || '/health_check' === req.path) {
    res.sendStatus(200)
  } else {
    next()
  }
})
app.use('/api', api)
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard/dist')))
app.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve('dashboard/dist/index.html'))
})
app.use('/', express.static(path.join(__dirname, 'home/dist')))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('home/dist/index.html'))
})

if (config.cameras.length) {
  config.cameras.forEach(function(camera) {
    app.use(camera.path, proxy(camera.host))
  })
}

http.listen(PORT)
https.listen(SSL_PORT, () => {
  logger.info(`listening on *:${SSL_PORT}`)
})

io.on('connection', (socket) => {
  logger.info('socket.io connection made')
})

relays.events.on('change', (type, status) => {
  io.sockets.emit(type, status)
})

system.events.on('state', function(value) {
  io.sockets.emit('system.state', value)

  if (config.notification)
    sendNotification({
      title: 'System State Changed',
      body: value
    })
})

system.events.on('override', function(value) {
  io.sockets.emit('system.override', value)

  if (config.notification)
    sendNotification({
      title: 'System Override',
      body: value ? 'On' : 'Off'
    })
})

const logging_interval = 1000 * 60 * 1 // every minute
setInterval(sensors.record, logging_interval)

if (config.lights.automate) {
  const light_interval = 1000 * 60 * 1 // every minute
  setInterval(control.light_program, light_interval)
}

const onSerialTimeout = function() {
  if (config.notification) {
    sendNotification({
      title: 'Serial Timeout',
      body: `Last data recevied ${serial_received_at.fromNow()}`
    })
  }
}

let serialTimeout
let serial_received_at

serialport.pipe(serial)
serialport.on('open', () => logger.info('serial port opened'))
serial.on('data', (message) => {
  const item = serialParser(message)

  serial_received_at = moment()

  if (serialTimeout)
    clearTimeout(serialTimeout)

  if (!item.type)
    return

  io.sockets.emit(item.data.key, item.data.value)

  if (!sensors.isValid(item))
    return

  sensors.evaluate(item)

  if (config.automate && !system.isOverrided())
    control.evaluate(item)

  serialTimeout = setTimeout(onSerialTimeout, SERIAL_TIMEOUT)
})
