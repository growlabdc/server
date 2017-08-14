const moment = require('moment')

const relays = require('./utils/relays')
const system = require('./system')
const grow = require('./grow')

const evaluate = function(sensor_item) {
  switch(sensor_item.data.key) {
    case 'tent.temperature':
      evaluate_temperature(sensor_item.data.value)
      break;

    case 'reservoir.ph':
      evaluate_ph(sensor_item.data.value)
      break;

    case 'reservoir.water_level':
      evaluate_water_level(sensor_item.data.value)
      break;

    default:
      // dont do anything
  }
}

const evaluate_temperarture = function(temperature) {
  if (temperature >= 25) {
    relays.ac.on()
    relays.exhaust.off()
  } else if (temperature >= 23.8) {
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
    //TODO: top it off if its gotten too low
    return

  if (system.getState() === 'DRAINING') {

    //INFO: water level is depicted by distance from lid to water

    if (water_level >= config.minimum_water_level) {
      system.setState('FILLING')
      relays.drain_valve.off()
      relays.drain_pump.off()
      relays.fill_valve.on()
    } else {
      relays.drain_valve.on()
      relays.drain_pump.on()
      relays.fill_valve.off()
    }

  } else if (system.getState() === 'FILLING'){

    if (system.getDrainCycle() < 2 && water_level <= config.drain_cycle_level) {
      system.setState('DRAINING')
      system.increaseDrainCycle()
      relays.drain_valve.on()
      relays.drain_pump.on()
      relays.fill_valve.off()
    } else if (water_level <= config.maxiumum_water_level) {
      system.getState('GROWING')
      system.resetDrainCycle()
      relays.fill_valve.off()
    } else {
      relays.fill_valve.on()
    }

  }
}

const light_program = function() {
  let now = new moment()

  let dark_start = new moment(config.lights[grow.state].start, 'H')
  let dark_end = new moment(config.lights[grow.state].end, 'H')

  if (now.isBetween(dark_start, dark_end, 'minute'))
    relays.light.off()
  else
    relays.light.on()
  }
}

module.exports = {
  evaluate: evaluate,
  light_program: light_program
}
