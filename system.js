const EventEmitter = require('events').EventEmitter
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('logplease');
const logger = Logger.create('system')

const config = require('./config')

const system = {
  _data: {
    state: 'GROWING',
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

  setState: function(value) {
    logger.info(`changing system state: ${value}`)
    this._data.state = value
    this.save()
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
  }

}

module.exports = system
