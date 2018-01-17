const express = require('express')
const router = express.Router()

const knex = require('../db').knex

const current_grow_id = require('../grow').id

router.get('/current', (req, res) => {
  knex('grows').where('id', current_grow_id).then((grows) => {
    res.status(200).json(grows)
  }).catch((err) => {
    res.status(500).json({message: err.toString()})
  })
})

router.get('/previous', (req, res) => {
  knex.select().from('grows').whereNotNull('started_at').whereNot('id', current_grow_id).then((rows) => {
    res.status(200).json(rows)
  }).catch((err) => {
    res.status(500).json({message: err.toString()})
  })
})

router.get('/upcoming', (req, res) => {
  knex.select().from('grows').whereNull('started_at').then((rows) => {
    res.status(200).json(rows)
  }).catch((err) => {
    res.status(500).json({message: err.toString()})
  })
})

router.get('/:id', (req, res) => {
  const id = req.params.id

  knex('grows').where('id', id).then((grows) => {
    res.status(200).json(grows)
  }).catch((err) => {
    res.status(500).json({message: err.toString()})
  })
})

module.exports = router
