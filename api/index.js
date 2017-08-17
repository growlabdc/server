const through = require('through')
const express = require('express')
const router = express.Router()

const config = require('../config')
const relays = require('../utils/relays')

const db = require('../db')
const relay_router = require('./relay')
const system_router = require('./system')
const system = require('../system')
const grow = require(config.grow_info_path)

router.use('/relays', relay_router)
router.use('/system', system_router)

router.get('/bucket/:bucketId/temperature', function(req, res) {

  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(new Date(parseInt(req.query.end, 10)).getTime()).getTime()

  db.valuestream('bucket.' + req.params.bucketId + '.temperature', {
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

router.get('/tent/humidity', function(req, res) {

  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  db.valuestream('tent.humidity', {
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

router.get('/tent/temperature', function(req, res) {

  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  db.valuestream('tent.temperature', {
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

router.get('/reservoir/ph', function(req, res) {

  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  db.valuestream('reservoir.ph', {
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

router.get('/reservoir/water_level', function(req, res) {

  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  db.valuestream('reservoir.water_level', {
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

router.get('/tent/infrared_spectrum', function(req, res) {

  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  db.valuestream('tent.infrared_spectrum', {
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

router.get('/tent/visible_spectrum', function(req, res) {

  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  db.valuestream('tent.full_spectrum', {
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

router.get('/tent/illuminance', function(req, res) {

  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  db.valuestream('tent.illuminance', {
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

router.get('/relay_status', function(req, res) {
  const result = {
    ac: relays.ac.status(),
    light: relays.light.status(),
    exhaust: relays.exhaust.status(),
    drain_valve: relays.drain_valve.status(),
    fill_valve: relays.fill_valve.status(),
    drain_pump: relays.drain_pump.status(),
    grow_system_pumps: relays.grow_system_pumps.status()
  }

  res.status(200).json(result)
})

router.get('/info', function(req, res) {
  const result = {
    state: system.getState(),
    stage: grow.stage,
    strain: grow.strain,
    started_at: grow.started_at,
    title: grow.title
  }

  res.status(200).json(result)
})

router.get('/:key', function(req, res) {
  const result = []
  const start = req.query.start && new Date(parseInt(req.query.start, 10)).getTime()
  const end = req.query.end && new Date(parseInt(req.query.end, 10)).getTime()

  db.valuestream(req.params.key, {
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

module.exports = router


//TODO:  PH UP Dispensing history

//TODO:  PH Down Dispensing history
