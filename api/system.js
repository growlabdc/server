const express = require('express')
const router = express.Router()

const system = require('../system')

router.use(function(req, res, next) {
  const token = req.query.token

  if (!token || token !== config.token) {
    res.status(401).json({message: 'token missing or not valid'})
  } else {
    next()
  }
})

router.get('/', function(req, res) {
  const options = ['DRAINING','FILLING','GROWING']
  const state = req.query.state

  if (options.indexOf(state) < 0)
    return res.status(400).json({message: 'invalid state'})

  system.setState(state)

  res.status(200).json({state: system.getState()})
})

module.exports = router
