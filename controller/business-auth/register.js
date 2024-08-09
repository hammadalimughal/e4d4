const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "E4d4U$er";
const Business = require('../../schema/Business')

router.post('/', async (req, res) => {
    try {
        const { email } = req.body
        let errors = []
        if (errors.length == 0) {
            // if (password !== confirmPassword) {
            //     return res.status(409).json({
            //         error: "Password & Confirm Should be same"
            //     })
            // }
            const checkBusiness = await Business.findOne({ 'primaryEmail.email': email })
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            
            newUser = await Business.create({})
            const user = {}
            const authtoken = jwt.sign(user, JWT_SECRET);
            return res.status(200).cookie('authtoken', authtoken).cookie('e4d4user', true).json({
                success: true,
                message: "Registeration Completed",
                authtoken
            })
        }
        else {
            console.log(req.body)
            return res.status(422).json({
                success: false,
                error: "Fill all Required Fields",
                errors
            })
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: err.message
        })
    }
})

module.exports = router