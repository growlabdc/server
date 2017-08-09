const moment = require('moment')

const relays = require('./utils/relays')
const system = require('./system')
const grow = require('./grow')

const evaluate = function(sensor_item) {
  switch(sensor_item.key) {
    case 'tent.temperature':
      evaluate_temperature(sensor_item.value)
      break;

    case 'reservoir.ph':
      evaluate_ph(sensor_item.value)
      break;

    case 'reservoir.water_level':
      evaluate_water_level(sensor_item.value)
      break;

    default:
      // dont do anything
  }
}

const evaluate_tempearture = function(temperature) {
  if (temperature >= 77) {
    relays.ac.on()
    relays.exhaust.off()
  } else if (temperature >= 76) {
    relays.exhaust.on()
  } else {
    relays.ac.off()
    relays.exhaust.off()
  }
}

const evaluate_ph = function(ph) {
  if (system.getState() !== 'GROWING')
    return

  // evalute ph
}

const evaluate_water_level = function(water_level) {
  if (system.getState() === 'GROWING')
    return

  if (system.getState() === 'DRAINING') {
    if (water_level <= config.minimum_water_level) {
      system.setState('FILLING')
      relays.drain_valve.off()
      relays.drain_pump.off()
      relays.fill_valve.on()
    } else {
      relays.drain_valve.on()
      relays.drain_pump.on()
      relays.fill_valve.off()
    }
  } else {
    if (water_level >= config.maxiumum_water_level) {
      system.getState('GROWING')
      relays.fill_valve.off()
    } else {
      relays.fill_valve.on()
    }
  }
}

const light_program = function() {
  let now = new moment()

  switch(grow.stage) {
    case 'VEGATATIVE':
      let dark_start = new moment(config.vegatative_dark_start)
      let dark_end = new moment(config.vegatative_dark_end)

      if (now.isBetween(dark_start, dark_end))
	relays.light.off()
      else
	relays.light.on()

      break;

    case 'FLOWERING':
      let dark_start = new moment(config.flowering_dark_start)
      let dark_end = new moment(config.flowering_dark_end)

      if (now.isBetween(dark_start, dark_end))
	relays.light.off()
      else
	relays.light.on()

      break;

    default:
      relays.light.off()
      break;
  }
}

module.exports = {
  evaluate: evaluate,
  light_program: light_program
}
