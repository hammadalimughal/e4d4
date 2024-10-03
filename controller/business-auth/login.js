const express = require('express');
const router = express.Router();
const Business = require('../../schema/Business')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "E4d4U$er";

// login a user
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body
        const checkBusiness = await Business.findOne({ 'primaryEmail.email': email })
        if (checkBusiness) {
            const passwordCompare = await bcrypt.compare(password, checkBusiness.password);
            if (passwordCompare) {
                const { _id, primaryEmail } = checkBusiness
                    const user = { id: _id, primaryEmail }
                const authtoken = jwt.sign(user, JWT_SECRET);
                return res.status(200).cookie('authtoken', authtoken).redirect('/profile?message=Business Logged In Successfully...')
            }
            else {
                return res.status(409).redirect('/user-loginemail?error=Invalid Credentials')
            }
        }
        else {
            return res.status(409).redirect('/user-loginemail?error=Invalid Credentials')
        }
    }
    catch (err) {
        console.log(err);
        return res.status(409).redirect('/user-loginemail?error=' + encodeURIComponent(err.message))
    }
})


module.exports = router