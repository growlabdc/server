const through = require('through')
const express = require('express')
const router = express.Router()

const config = require('./config')
const sensors = require('./utils/sensors')

const db = require('./db')


router.get('/bucket/:bucketId/temperature', function(req, res) {

  const result = []

  db.valuestream('bucket.' + req.params.bucketId + '.temperature', {
    start: req.query.start,
    end: req.query.end
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
    start: req.query.start,
    end: req.query.end
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
    start: req.query.start,
    end: req.query.end
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
    start: req.query.start,
    end: req.query.end
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
    start: req.query.start,
    end: req.query.end
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
    start: req.query.start,
    end: req.query.end
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
    start: req.query.start,
    end: req.query.end
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
    start: req.query.start,
    end: req.query.end
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

//TODO:  Light status / history

//TODO:  AC status / history

//TODO:  Exhaust status / history

//TODO:  Air Pump status / history

//TODO:  Resevoir Pump status / history

//TODO:  Drain Pump status / history
