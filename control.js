const moment = require('moment')

const config = require('./config')
const relays = require('./utils/relays')
const pumps = require('./utils/pumps')
const system = require('./system')
const grow = require('./grow')

const evaluate = function(sensor_item) {
  switch(sensor_item.data.key) {
    case 'tent.temperature':
      evaluate_temperature(sensor_item.data.value)
      break;

    case 'tent.humidity':
      evaluate_humidity(sensor_item.data.value)
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

const evaluate_humidity = function(humidity) {
  if (!relays.light.status() && !relays.ac.status() && humidity > 80) {
    relays.exhaust.on()
  } else {
    relays.exhaust.off()
  }
}

const evaluate_temperature = function(temperature) {
  if (temperature >= 25) {
    relays.ac.on()
    relays.exhaust.off()
  } else if (temperature < 23.3) {
    relays.ac.off()
  }
}

const evaluate_ph = function(ph) {
  if (system.getState() !== 'GROWING')
    return

  if (!config.ph.automate)
    return

  const now = moment()
  if (system.getLastDose() && system.getLastDose().isAfter(now.subtract(15, 'minutes')))
    return

  if (ph < config.ph.minimum) {
    pumps.pH.up.add(1)
    system.setLastDose()
  } else if (ph > config.ph.maximum) {
    pumps.pH.down.add(1)
    system.setLastDose()
  }
}

const evaluate_water_level = function(water_level) {
  if (system.getState() === 'GROWING') {

    relays.drain_pump.off()

    if (!config.water_level.automate) {
      relays.fill_valve.off()
      relays.drain_valve.off()
      return
    }

    if (water_level < config.water_level.maximum) {
      relays.drain_valve.on()
    } else if (water_level > config.water_level.grow_limit) {
      relays.fill_valve.on()
    } else {
      relays.fill_valve.off()
      relays.drain_valve.off()
    }

    return
  }

  if (system.getState() === 'DRAINING') {

    //INFO: water level is depicted by distance from lid to water

    if (water_level >= config.water_level.minimum) {
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

    if (system.getDrainCycle() < 2 && water_level <= config.water_level.drain_cycle_limit) {
      system.setState('DRAINING')
      system.increaseDrainCycle()
      relays.drain_valve.on()
      relays.drain_pump.on()
      relays.fill_valve.off()
    } else if (water_level <= config.water_level.maximum) {
      system.setState('GROWING')
      system.resetDrainCycle()
      relays.fill_valve.off()
    } else {
      relays.fill_valve.on()
      relays.drain_valve.off()
      relays.drain_pump.off()
    }

  }
}

const light_program = function() {
  const stage = grow.stage
  const now = new moment()

  const dark_start = new moment(config.lights[stage].start, 'H')
  const dark_end = new moment(config.lights[stage].end, 'H')

  if (now.isBetween(dark_start, dark_end, 'minute'))
    relays.light.off()
  else
    relays.light.on()
}

module.exports = {
  evaluate: evaluate,
  light_program: light_program
}
