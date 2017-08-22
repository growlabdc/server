const express = require('express')
const router = express.Router()

const pumps = require('../utils/pumps')
const config = require('../config')

router.get('/ph/:direction', function(req, res) {
  try {
    const valid_directions = ['up', 'down']

    if (valid_directions.indexOf(req.params.direction) < 0)
      return res.status(400).json({message: 'invalid direction param'})

    const dose = parseInt(req.query.dose, 10) || 1

    pumps.pH[req.params.direction].add(dose)

    res.status(200).json({message: 'done'})
  } catch(err) {
    res.status(500).json({message: err.toString()})
  }
})

module.exports = router
