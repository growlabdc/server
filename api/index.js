const through = require('through')
const express = require('express')
const router = express.Router()

const config = require('../config')
const relays = require('../utils/relays')

const lemdb = require('../db').lemdb
const leveldb = require('../db').leveldb
const relay_router = require('./relay')
const system_router = require('./system')
const pumps_router = require('./pumps')
const grows_router = require('./grows')
const system = require('../system')
const grow = require(config.grow_info_path)

const authenticate = function(req, res, next) {
  const token = req.query.token

  if (!token || token !== config.token) {
    res.status(401).json({message: 'token missing or not valid'})
  } else {
    next()
  }
}

router.all('/control', authenticate)
router.use('/control/relays', relay_router)
router.use('/control/system', system_router)
router.use('/control/pumps', pumps_router)
router.use('/grows', grows_router)

router.get('/info', function(req, res) {
  const result = {
    state: system.getState(),
    override: system.isOverrided(),
    stage: grow.stage,
    strain: grow.strain,
    started_at: grow.started_at,
    title: grow.title,
    relays: {
      ac: relays.ac.status(),
      light: relays.light.status(),
      exhaust: relays.exhaust.status(),
      drain_valve: relays.drain_valve.status(),
      fill_valve: relays.fill_valve.status(),
      drain_pump: relays.drain_pump.status(),
      grow_system_pumps: relays.grow_system_pumps.status()
    }
  }

  res.status(200).json(result)
})

router.get('/:key', function(req, res) {
  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  lemdb.valuestream(req.params.key, {
    start: start,
    end: end
  }).pipe(through(function(data){

    result.push({
      timestamp: data.key,
      value: data.value
    })

  }, function(){
    res.status(200).json(result)
  }))
})

router.delete('/:key/:value', authenticate, function(req, res) {
  const key = 'values.' + req.params.key + '.' + req.params.value

  leveldb.del(key, function(err) {
    res.status(err ? 500 : 200).json({message: err ? err.toString() : 'done'})
  })
})

module.exports = router
