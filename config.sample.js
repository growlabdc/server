const path = require('path')

module.exports = {
  level_db_path: '/tmp/level_db_data',
  grow_info_path: path.resolve('./grow.sample.json'),
  state_path: path.resolve('./state.json'),
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
  automate: false
}
