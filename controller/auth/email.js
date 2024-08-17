const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "E4d4U$er";
const User = require('../../schema/User')

router.post('/', async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            confirmPassword,
            phone
        } = req.body
        let errors = []
        if (!fullName) {
            errors.push(`Full Name is Invalid or not Filled`)
        }
        if (!email) {
            errors.push(`Email is Invalid or not Filled`)
        }
        if (!password) {
            errors.push(`Password is Invalid or not Filled`)
        }
        if (errors.length == 0) {
            if (password !== confirmPassword) {
                return res.status(409).json({
                    error: "Password & Confirm Should be same"
                })
            }
            const checkUser = await User.findOne({ 'primaryEmail.email': email })
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            if (checkUser) {
                if (checkUser.primaryEmail.provider.some(provider => provider.type === 'google') || checkUser.primaryEmail.provider.some(provider => provider.type === 'facebook')) {
                    checkUser.fullName = fullName
                    checkUser.password = hashPassword
                    checkUser.phone = phone
                    await checkUser.save()
                    const user = {
                        id: checkUser._id, primaryEmail: {
                            email: email,
                            verified: false
                        }
                    }
                    const authtoken = jwt.sign(user, JWT_SECRET);
                    return res.status(200).json({
                        success: true,
                        message: "Registeration Completed",
                        authtoken
                    })
                }
                return res.status(409).json({
                    success: false,
                    error: "Email Already Registered"
                })
            }
            newUser = await User.create({
                fullName,
                password: hashPassword,
                primaryEmail: {
                    email: email,
                    verified: false
                },
                phone
            })
            const fetchUser = await User.findOne({ 'primaryEmail.email': email })
            const { _id, primaryEmail } = fetchUser
            const user = {
                id: _id, primaryEmail
            }
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