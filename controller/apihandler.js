const express = require('express')
const router = express.Router()

router.use('/auth/google',require('./auth/google-auth'))
router.use('/auth/facebook', require('./auth/facebook-auth'));

module.exports = router