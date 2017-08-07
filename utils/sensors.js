const rpio = require('rpio');

rpio.init({ mapping: 'gpio' })

const sensors = {
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
    },
    on: function() {
      rpio.write(this.pin, rpio.HIGH)
    },
    off: function() {
      rpio.write(this.pin, rpio.LOW)
    },
    status: function() {
      return rpio.read(this.pin)
    }    
  },
  light: {
    pin: 13,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)      
    },    
    on: function() {
      rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      rpio.write(this.pin, rpio.HIGH)
    },
    status: function() {
      return !rpio.read(this.pin)
    }    
  },
  exhaust: {
    pin: 12,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
    },
    on: function() {
      rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      rpio.write(this.pin, rpio.HIGH)
    },
    status: function() {
      return !rpio.read(this.pin)
    }    
  },
  drain_valve: {
    pin: 17,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
    },    
    on: function() {
      rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      rpio.write(this.pin, rpio.HIGH)
    },
    status: function() {
      return !rpio.read(this.pin)
    }    
  },
  fill_valve: {
    pin: 16,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
    },    
    on: function() {
      rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      rpio.write(this.pin, rpio.HIGH)
    },
    status: function() {
      return !rpio.read(this.pin)
    }    
  },
  drain_pump: {
    pin: 6,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
    },    
    on: function() {
      rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      rpio.write(this.pin, rpio.HIGH)
    },
    status: function() {
      return !rpio.read(this.pin)
    }    
  },
  grow_system_pumps: {
    pin: 5,
    setup: function() {
      rpio.open(this.pin, rpio.OUTPUT)
    },   
    on: function() {
      rpio.write(this.pin, rpio.LOW)
    },
    off: function() {
      rpio.write(this.pin, rpio.HIGH)
    },
    status: function() {
      return !rpio.read(this.pin)
    }
  }
}

module.exports = sensors
