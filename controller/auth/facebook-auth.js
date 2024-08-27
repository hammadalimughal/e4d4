const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

router.get('/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log('google auth req',req.session)
        res.redirect('/sites/e4d4/portfolioreg?Facebook Authenticated Successfully');
    }
);

module.exports = router