const Logger = require('logplease')

const argv = require('yargs').argv

const logger = Logger.create('pumps')

const pumps = require('../utils/pumps')

pumps.setup()

const run = function() {
  pumps.pH.up.motor.run('fwd')
  pumps.pH.down.motor.run('fwd')
}

const stop = function() {
  pumps.pH.up.motor.stop()
  pumps.pH.down.motor.stop()
  process.exit()

}

const dose = function() {
  run()
  setInterval(stop, 1500)
}

dose()

function exitHandler(options, err) {
  pumps.pH.up.motor.stop()
  pumps.pH.down.motor.stop()

  if (err) console.log(err.stack)

  process.exit()
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));

process.on('SIGINT', exitHandler.bind(null, {exit:true}));

process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
