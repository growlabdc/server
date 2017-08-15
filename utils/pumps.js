const motorHat = require('motor-hat')

const hat_one = motorHat(config.motor_hat_one.hat_config)
const hat_two = motorHat(config.motor_hat_two.hat_config)

const motors = {
  setup: function() {
    config.motor_hat_one.motor_config.forEach((item, i) => {
      hat_one.dcs[i].setSpeed(item.speed)
    })

    config.motor_hat_two.motor_config.forEach((item, i) => {
      hat_two.dcs[i].setSpeed(item.speed)
    })
  },

  pH: {
    up: {
      motor: hat_one.dcs[0],
      base_dose: 1,
      add: function(value) {
	const dose = value || this.base_dose
	const timeout = 1800 * dose

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    down: {
      motor: hat_one.dcs[1],
      base_dose: 1,
      add: function(value) {
	const dose = value || this.base_dose
	const timeout = 1800 * dose

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    }
  },

  nutrients: {
    basis_A: {
      motor: hat_one.dcs[2],
      base_dose: 1,
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1800 * dose

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    basis_B: {
      motor: hat_one.dcs[3],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1800 * dose

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    start_r: {
      motor: hat_two.dcs[0],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1800 * dose

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    vitalize: {
      motor: hat_two.dcs[1],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1800 * dose

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    c4: {
      motor: hat_two.dcs[2],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1800 * dose

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    pk_boost: {
      motor: hat_two.dcs[3],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1800 * dose

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    }
  }
}

module.exports = motors
