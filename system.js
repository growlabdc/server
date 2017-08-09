const EventEmitter = require('events').EventEmitter
const fs = require('fs')
const jsonfile = require('jsonfile')

const config = require('./config')

const system = {
  _data: {
    state: 'GROWING'
  },
  events: new EventEmitter(),
  save: function() {
    jsonfile.writeFileSync(config.state_path, this._data, { spaces: 2})
  },
  setState: function(value) {
    this._data.state = value
    this.save()
    this.events.emit('change', value)
  },
  getState: function() {
    return this._data.state
  },
  load: function() {
    if (!fs.existsSync(config.state_path))
      return this.save()

    let data = jsonfile.readFileSync(config.state_path)
    this._data = data
  }
}

module.exports = system
