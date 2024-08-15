const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "E4d4U$er";

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/callback', passport.authenticate('google', {
    failureRedirect: '/join?error=Something Went Wrong',
    //  successRedirect: '/success'
}), (req, res) => {
        const user = req.session?.passport?.user
        const authUser = {
            id: user._id,
            primaryEmail: user?.primaryEmail
        }
        const authtoken = jwt.sign(authUser, JWT_SECRET);

        if (user.infoRequired) {
            return res.cookie('authtoken', authtoken).redirect('/sites/e4d4/portfolioreg?Google Authenticated Successfully');
        } else {
            return res.cookie('authtoken', authtoken).redirect('/sites/e4d4/dashboard');
        }
});

module.exports = router