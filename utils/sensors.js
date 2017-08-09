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

const record = function() {
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

const evaluate = function(sensor_item) {
  sensor_data[sensor_item].push(sensor_item.value)

  if (config.alerts) alerts.evaluate[sensor_item.type](sensor_item)
}

module.exports = {
  evaluate: evaluate,
  record: record
}
