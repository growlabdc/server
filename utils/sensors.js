const config = require('../config')
const db = require('../db')
const alerts = require('./alerts')

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

const getAverage = function(key) {
  let total = 0
  let values = sensor_data[key]
  for(let i=0;i<values.length;i++) {
    total += values[i]
  }

  return (total / values.length).toFixed(1)
}

const record = function() {
  Object.keys(sensor_data).forEach(function(data_key,index) {
    const average = getAverage(data_key)
    db.recorder(data_key)(average)
    sensor_data[data_key] = [] // reset values
  })
}

const evaluate = function(sensor_item) {
  sensor_data[sensor_item.data.key].push(sensor_item.data.value)

  if (config.alerts) alerts.evaluate(sensor_item)
}

const isValid = function(sensor_item) {
  if (!sensor_data[sensor_item.data.key].length)
    return true

  const average = getAverage(sensor_item.data.key)

  const limits = config.sensors[sensor_item.type]

  if (limits) {
    if (sensor_item.data.value < limits.min)
      return true

    if (sensor_item.data.value > limits.max)
      return true
  }

  if (parseInt(average, 10) === 0)
    return true

  return Math.abs((sensor_item.data.value - average) / average * 100) < 15
}

module.exports = {
  evaluate: evaluate,
  isValid: isValid,
  record: record
}
