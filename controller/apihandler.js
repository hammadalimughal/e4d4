const express = require('express')
const router = express.Router()

router.use('/auth/google',require('./auth/google-auth'))
router.use('/auth/facebook', require('./auth/facebook-auth'));
router.use('/auth/email', require('./auth/email'));

module.exports = router