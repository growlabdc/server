const EventEmitter = require('events').EventEmitter
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('logplease');
const logger = Logger.create('system')
const moment = require('moment')

const config = require('./config')

const db = require('./db')

const system = {
  _data: {
    state: 'GROWING',
    last_dose: null,
    drain_cycle: 0
  },
  events: new EventEmitter(),
  save: function() {
    logger.debug('saving')
    jsonfile.writeFileSync(config.state_path, this._data, { spaces: 2})
  },
  load: function() {
    logger.debug('loading')
    if (!fs.existsSync(config.state_path))
      return this.save()

    let data = jsonfile.readFileSync(config.state_path)
    this._data = data
  },

  record: function() {
    db.recorder('system.state')(this._data.state)
  },

  setState: function(value) {
    logger.info(`changing system state: ${value}`)
    this._data.state = value
    this.save()
    this.record()
    this.events.emit('change', value)
  },
  getState: function() {
    return this._data.state
  },

  getDrainCycle: function() {
    return this._data.drain_cycle
  },
  increaseDrainCycle: function() {
    logger.info('increasing drain cycle')
    this._data.drain_cycle++
    this.save()
  },
  resetDrainCycle: function() {
    logger.info('resetting drain cycle')
    this._data.drain_cycle = 0
    this.save()
  },

  getLastDose: function() {
    return this._data.last_dose
  },
  setLastDose: function() {
    this._data.last_dose = moment()
  }

}

module.exports = system
