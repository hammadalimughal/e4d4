const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', passport.authenticate('google', { scope: ['profile','email'] }))

router.get('/callback', passport.authenticate('google', {
     failureRedirect: '/failure' ,
    //  successRedirect: '/success'
    }), async (req, res) => {
        console.log('google auth req',req.session)
    // Successful authentication, redirect home.
    res.redirect('/portfolioreg?Google Authenticated Successfully');
});

module.exports = router