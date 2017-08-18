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

module.exports = router
