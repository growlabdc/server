const through = require('through')
const express = require('express')
const router = express.Router()

const config = require('../config')
const relays = require('../utils/relays')

const db = require('../db')
const relay_router = require('./relay')

router.use('/relays', relay_router)

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
    ac: relays.ac.status(),
    light: relays.light.status(),
    exhaust: relays.light.status(),
    drain_valve: relays.drain_valve.status(),
    fill_valve: relays.fill_valve.status(),
    drain_pump: relays.drain_pump.status(),
    grow_system_pumps: relays.grow_system_pumps.status()
  }

  res.status(200).json(result)
})

module.exports = router


//TODO:  PH UP Dispensing history

//TODO:  PH Down Dispensing history
