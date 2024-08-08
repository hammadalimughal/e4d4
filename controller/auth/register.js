const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "USD00RD!rEcT!";
const User = require('../../schema/User')

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, password, VAT } = req.body.formData

        if (firstName && lastName && phone && email && password) {
            const checkUser = await User.findOne({ email })
            if (checkUser) {
                // return res.status(409).json({
                //     message: "Email Address already registered...!!!"
                // })
                return res.status(409).json({
                    message: "Email Already Registered"
                })
            }
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            newUser = await User.create({ firstName, lastName, email, password: hashPassword, VAT })
            const fetchUser = await User.findOne({ email })
            const { _id, verified, totalPurchase, orders, address, role } = fetchUser
            const user = {
                id: _id, firstName, lastName, phone, email, verified, totalPurchase, orders, address, role, VAT
            }
            const authtoken = jwt.sign(user, JWT_SECRET);
            return res.status(200).cookie('authtoken', authtoken).cookie('usdoorsuser', true).redirect("" + '?message=User Logged In Successfully...')
        }
        else {
            console.log(req.body)
            return res.status(422).json({
                message: "Invalid Form Data"
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