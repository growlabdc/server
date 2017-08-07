var socket = io()

socket.on('bucket.5.temperature', (value) => {
  //TODO: evaluate range
  document.querySelector('#reservoir-temperature').innerHTML = value + '°C'
})

socket.on('reservoir.ph', (value) => {
  document.querySelector('#reservoir-ph').innerHTML = value
})

socket.on('tent.humidity', (value) => {
  document.querySelector('#tent-humidity').innerHTML = value + '%'
})

socket.on('tent.temperature', (value) => {
  document.querySelector('#tent-temperature').innerHTML = value + '°C'
})

socket.on('reservoir.water_level', (value) => {
  document.querySelector('#reservoir-water-level').innerHTML = value + 'cm'
})

socket.on('tent.infrared_spectrum', (value) => {
  document.querySelector('#tent-infrared-spectrum').innerHTML = value
})

socket.on('tent.full_spectrum', (value) => {
  document.querySelector('#tent-full-spectrum').innerHTML = value
})

socket.on('tent.visible_spectrum', (value) => {
  document.querySelector('#tent-visible-spectrum').innerHTML = value
})

socket.on('tent.illuminance', (value) => {
  document.querySelector('#tent-illuminance').innerHTML = value + ' Lux'
})

App.api('/status').get().success((value) => {
  document.querySelector('#ac-status').innerHTML = App.status(value)
  document.querySelector('#light-status').innerHTML = App.status(value)
  document.querySelector('#exhaust-status').innerHTML = App.status(value)
  document.querySelector('#drain-valve-status').innerHTML = App.status(value)
  document.querySelector('#fill-valve-status').innerHTML = App.status(value)
  document.querySelector('#drain-pump-status').innerHTML = App.status(value)
  document.querySelector('#grow-system-pumps-status').innerHTML = App.status(value)
}).error((err) => {
  console.log(err)
})
