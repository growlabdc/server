const logger = require('logplease')

const argv = require('yargs').argv

const logger = Logger.create('pumps')

const pumps = require('../utils/pumps')

pumps.setup()

pumps.pH.up.motor.run('fwd')
pumps.pH.down.motor.run('fwd')

function exitHandler(options, err) {
  pumps.pH.up.motor.stop()
  pumps.pH.down.motor.stop()

  if (err) console.log(err.stack)
  
  process.exit()
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));

process.on('SIGINT', exitHandler.bind(null, {exit:true}));

process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
