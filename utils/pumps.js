const config = require('../config')
if (config.test)
  return

const motorHat = require('motor-hat')

const Logger = require('logplease');
const logger = Logger.create('pumps')

const lemdb = require('../db').lemdb

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
	const timeout = 1500 * dose

	lemdb.recorder('ph.up')(dose)
	logger.info(`pH up dose: ${dose}`)

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    down: {
      motor: hat_one.dcs[1],
      base_dose: 1,
      add: function(value) {
	const dose = value || this.base_dose
	const timeout = 1500 * dose

	lemdb.recorder('ph.down')(dose)
	logger.info(`pH down dose: ${dose}`)

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
	const timeout = 1500 * dose

	lemdb.recorder('nutrients.basis_a')(dose)
	logger.info(`basis_a dose: ${dose}`)

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    basis_B: {
      motor: hat_one.dcs[3],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1500 * dose

	lemdb.recorder('nutrients.basis_b')(dose)
	logger.info(`basis_b dose: ${dose}`)

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    start_r: {
      motor: hat_two.dcs[0],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1500 * dose

	lemdb.recorder('nutrients.start_r')(dose)
	logger.info(`start_r dose: ${dose}`)

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    vitalize: {
      motor: hat_two.dcs[1],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1500 * dose

	lemdb.recorder('nutrients.vitalize')(dose)
	logger.info(`vitalize dose: ${dose}`)

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    c4: {
      motor: hat_two.dcs[2],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1500 * dose

	lemdb.recorder('nutrients.c4')(dose)
	logger.info(`c4 dose: ${dose}`)

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    },
    pk_boost: {
      motor: hat_two.dcs[3],
      base_dose: 1,      
      add: function() {
	const dose = value || this.base_dose
	const timeout = 1500 * dose

	lemdb.recorder('nutrients.pk_boost')(dose)
	logger.info(`pk_boost dose: ${dose}`)

	this.motor.run('fwd')
	setTimeout(this.motor.stop, timeout)
      }
    }
  }
}

module.exports = motors
