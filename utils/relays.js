const rpio = require('rpio')
const EventEmitter = require('events').EventEmitter

rpio.init({ mapping: 'gpio' })

const db = require('../db')

const events = new EventEmitter()

const relays = {
  events: events,
  setup: function() {
    this.ac.setup()
    this.light.setup()
    this.exhaust.setup()
    this.grow_system_pumps.setup()
    this.drain_valve.setup()
    this.fill_valve.setup()
    this.drain_pump.setup()
  },
  ac: {
    pin: 27,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
      rpio.poll(this.pin, this.onChange.bind(this))
    },
    on: function() {
      !this.status() && rpio.write(this.pin, rpio.HIGH)
    },
    off: function() {
      this.status() && rpio.write(this.pin, rpio.LOW)
    },
    save: function() {
      db.recorder('ac.status', this.status)
    },
    status: function() {
      return !!rpio.read(this.pin)
    },
    onChange: function() {
      this.save()
      events.emit('change', 'ac.status', this.status())
    }
  },
  light: {
    pin: 13,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
      rpio.poll(this.pin, this.onChange.bind(this))
    },    
    on: function() {
      !this.status() && rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      this.status() && rpio.write(this.pin, rpio.HIGH)
    },
    save: function() {
      db.recorder('light.status', this.status)
    },
    status: function() {
      return !rpio.read(this.pin)
    },
    onChange: function() {
      this.save()
      events.emit('change', 'light.status', this.status())
    }
  },
  exhaust: {
    pin: 12,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
      rpio.poll(this.pin, this.onChange.bind(this))
    },
    on: function() {
      !this.status() && rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      this.status() && rpio.write(this.pin, rpio.HIGH)
    },
    save: function() {
      db.recorder('exhaust.status', this.status)
    },
    status: function() {
      return !rpio.read(this.pin)
    },
    onChange: function() {
      this.save()
      events.emit('change', 'exhaust.status', this.status())
    }
  },
  drain_valve: {
    pin: 17,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
      rpio.poll(this.pin, this.onChange.bind(this))
    },    
    on: function() {
      !this.status() && rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      this.status() && rpio.write(this.pin, rpio.HIGH)
    },
    save: function() {
      db.recorder('drain_valve.save', this.status)
    },
    status: function() {
      return !rpio.read(this.pin)
    },
    onChange: function() {
      this.save()
      events.emit('change', 'drain_valve.status', this.status())
    }
  },
  fill_valve: {
    pin: 16,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
      rpio.poll(this.pin, this.onChange.bind(this))
    },    
    on: function() {
      !this.status() && rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      this.status() && rpio.write(this.pin, rpio.HIGH)
    },
    save: function() {
      db.recorder('fill_valve.status', this.status)
    },
    status: function() {
      return !rpio.read(this.pin)
    },
    onChange: function() {
      this.save()
      events.emit('change', 'fill_valve.status', this.status())
    }
  },
  drain_pump: {
    pin: 6,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
      rpio.poll(this.pin, this.onChange.bind(this))
    },    
    on: function() {
      !this.status() && rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      this.status() && rpio.write(this.pin, rpio.HIGH)
    },
    save: function() {
      db.recorder('drain_pump.status', this.status)
    },
    status: function() {
      return !rpio.read(this.pin)
    },
    onChange: function() {
      this.save()
      events.emit('change', 'drain_pump.status', this.status())
    }
  },
  grow_system_pumps: {
    pin: 5,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
      rpio.poll(this.pin, this.onChange.bind(this))
    },
    on: function() {
      !this.status() && rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      this.status() && rpio.write(this.pin, rpio.HIGH)
    },
    save: function() {
      db.recorder('grow_system_pumps.status', this.status)
    },
    status: function() {
      return !rpio.read(this.pin)
    },
    onChange: function() {
      this.save()
      events.emit('change', 'grow_system_pumps.status', this.status())
    }
  }
}

module.exports = relays
