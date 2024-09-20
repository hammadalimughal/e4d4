const express = require('express')
const router = express.Router()

router.use('/connection',require('./connection/connection'))

router.use('/location',require('./location/places'))

router.use('/user/modify',require('./user/modify'))

router.use('/business/job/add',require('./job/add'))
router.use('/business/modify',require('./business/modify'))

router.use('/auth/business/register',require('./business-auth/register'))
router.use('/auth/business/login',require('./business-auth/login'))

router.use('/auth/google',require('./auth/google-auth'))
router.use('/auth/facebook', require('./auth/facebook-auth'));
router.use('/auth/email', require('./auth/email'));
router.use('/auth/login', require('./auth/login'));
router.use('/auth/password', require('./auth/password'));
router.use('/auth/business/password', require('./auth/business-password'));

module.exports = router