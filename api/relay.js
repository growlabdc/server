const express = require('express')
const router = express.Router()

const relays = require('../utils/relays')
const config = require('../config')

router.use(function(req, res, next) {
  const token = req.query.token

  if (!token || token !== config.token) {
    res.status(401).json({message: 'token missing or not valid'})
  } else {
    next()
  }
})

router.get('/ac', function(req, res) {
  try {
    const on = req.query.on === 'true'
    on ? relays.ac.on() : relays.ac.off()

    res.send(200).json({status: relays.ac.status()})
  } catch(err) {
    res.send(500).json({message: err.toString()})
  }
})

router.get('/exhaust', function(req, res) {
  try {
    const on = req.query.on === 'true'
    on ? relays.exhaust.on() : relays.exhaust.off()

    res.send(200).json({status: relays.exhaust.status()})
  } catch(err) {
    res.send(500).json({message: err.toString()})
  }    
})

router.get('/drain_valve', function(req, res) {
  try {
    const on = req.query.on === 'true'
    on ? relays.drain_valve.on() : relays.drain_valve.off()

    res.send(200).json({status: relays.drain_valve.status()})
  } catch(err) {
    res.send(500).json({message: err.toString()})
  }    
})

router.get('/fill_valve', function(req, res) {
  try {
    const on = req.query.on === 'true'
    on ? relays.fill_valve.on() : relays.fill_valve.off()

    res.send(200).json({status: relays.fill_valve.status()})
  } catch(err) {
    res.send(500).json({message: err.toString()})
  }    
})

router.get('/drain_pump', function(req, res) {
  try {
    const on = req.query.on === 'true'
    on ? relays.drain_pump.on() : relays.drain_pump.off()

    res.send(200).json({status: relays.drain_pump.status()})
  } catch(err) {
    res.send(500).json({message: err.toString()})
  }
})

router.get('/light', function(req, res) {
  try {
    const on = req.query.on === 'true'
    on ? relays.light.on() : relays.light.off()

    res.send(200).json({status: relays.light.status()})
  } catch(err) {
    res.send(500).json({message: err.toString()})
  }    
})

router.get('/grow_system_pumps', function(req, res) {
  try {
    const on = req.query.on === 'true'
    on ? relays.grow_system_pumps.on() : relays.grow_system_pumps.off()

    res.send(200).json({status: relays.grow_system_pumps.status()})
  } catch(err) {
    res.send(500).json({message: err.toString()})
  }
})

module.exports = router
