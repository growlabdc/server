const express = require('express')
const router = express.Router()

const config = require('../config')
const system = require('../system')

router.get('/', function(req, res) {
  const options = ['DRAINING','FILLING','GROWING']
  const state = req.query.state

  if (options.indexOf(state) < 0)
    return res.status(400).json({message: 'invalid state'})

  system.setState(state)

  res.status(200).json({state: system.getState()})
})

router.get('/override', function(req, res) {
  try {
    const value = req.query.on === 'true'
    system.setOverride(value)

    res.status(200).json({override: system.isOverrided()})
  } catch(err) {
    res.status(500).json({message: err.toString()})
  }
})

router.get('/off', function(req, res) {
  try {
    system.setOverride(true)
    relays.off()

    res.status(200).json({message: 'success'})
  } catch(err) {
    res.status(500).json({message: err.toString()})
  }
})

module.exports = router
