const express = require('express')
const router = express.Router()
const passport = require('passport')

router.use('/auth/google',require('./auth/google-auth'))

module.exports = router