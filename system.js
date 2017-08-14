const EventEmitter = require('events').EventEmitter
const fs = require('fs')
const jsonfile = require('jsonfile')

const config = require('./config')

const system = {
  _data: {
    state: 'GROWING',
    drain_cycle: 0
  },
  events: new EventEmitter(),
  save: function() {
    jsonfile.writeFileSync(config.state_path, this._data, { spaces: 2})
  },
  load: function() {
    if (!fs.existsSync(config.state_path))
      return this.save()

    let data = jsonfile.readFileSync(config.state_path)
    this._data = data
  },

  setState: function(value) {
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
    this._data.drain_cycle++
    this.save()
  },
  resetDrainCycle: function() {
    this._data.drain_cycle = 0
    this.save()
  }

}

module.exports = system
