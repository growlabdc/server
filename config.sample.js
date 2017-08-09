const path = require('path')

module.exports = {
  level_db_path: '/tmp/level_db_data',
  grow_info_path: path.resolve('./grow.sample.json'),
  state_path: path.resolve('./state.json'),
  alerts_log_path: path.resolve('./alerts.log'),
  token: 'password',
  port: 8080,
  ssl_port: 3000,
  maximum_water_level: 8,
  minimum_water_level: 25,
  vegatative_dark_start: '',
  vegatative_dark_end: '',
  flowering_dark_start: '',
  flowering_dark_end: '',
  light_program: false,
  automate: false,
  alerts: {
    ph: {
      minimum: 5.5,
      maximum: 7.5
    },
    water_temperature: {
      minimum: 20,
      maximum: 25.5
    },
    humidity: {
      minimum: 30,
      maximum: 90
    },
    air_temperature: {
      minimum: 21.1
      maximum: 26.1
    },
    water_level: {
      minimum: 8,
      maximum: 25
    },
    illuminance: {
      minimum: -1,
      maximum: 60000
    }
  }
}
