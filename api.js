const through = require('through')
const express = require('express')
const router = express.Router()

const config = require('./config')
const sensors = require('./utils/sensors')

const db = require('./db')


router.get('/bucket/:bucketId/temperature', function(req, res) {

  const result = []

  db.valuestream('bucket.' + req.params.bucketId + '.temperature', {
    start: new Date(req.query.start).getTime(),
    end: new Date(req.query.end).getTime()
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

  db.valuestream('tent.humidity', {
    start: new Date(req.query.start).getTime(),
    end: new Date(req.query.end).getTime()
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

  db.valuestream('tent.temperature', {
    start: new Date(req.query.start).getTime(),
    end: new Date(req.query.end).getTime()
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

  db.valuestream('reservoir.ph', {
    start: new Date(req.query.start).getTime(),
    end: new Date(req.query.end).getTime()
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

  db.valuestream('reservoir.water_level', {
    start: new Date(req.query.start).getTime(),
    end: new Date(req.query.end).getTime()
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

  db.valuestream('tent.infrared_spectrum', {
    start: new Date(req.query.start).getTime(),
    end: new Date(req.query.end).getTime()
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

  db.valuestream('tent.full_spectrum', {
    start: new Date(req.query.start).getTime(),
    end: new Date(req.query.end).getTime()
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

  db.valuestream('tent.illuminance', {
    start: new Date(req.query.start).getTime(),
    end: new Date(req.query.end).getTime()
  }).pipe(through(function(data){

    result.push({
      timestamp: data.key,
      value: data.value
    })

  }, function(){
    res.status(200).json(result)
  }))
})

router.get('/status', function(req, res) {
  const result = {
    ac: sensors.ac.status(),
    light: sensors.light.status(),
    exhaust: sensors.light.status(),
    drain_valve: sensors.drain_valve.status(),
    fill_valve: sensors.fill_valve.status(),
    drain_pump: sensors.drain_pump.status(),
    grow_system_pumps: sensors.grow_system_pumps.status()
  }

  res.status(200).json(result)
})

module.exports = router


//TODO:  PH UP Dispensing history

//TODO:  PH Down Dispensing history
