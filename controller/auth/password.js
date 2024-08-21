const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../schema/User');
const Otp = require("../../schema/OTP")
const bcrypt = require('bcryptjs');
const JWT_SECRET = "E4d4U$er";
const sendOtp = require('../email/send-otp');

router.post('/get-otp', async (req, res) => {
    try {
        const { email } = req.body
        const checkUser = await User.findOne({ 'primaryEmail.email': email })
        if (checkUser) {
            const userId = checkUser._id
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
            var otpObj = await Otp.findOne({ userId })
            if (otpObj) {
                otpObj.code = otpCode
                await otpObj.save()
            } else {
                otpObj = await Otp.create({ user: userId, code: otpCode })
            }

            await sendOtp(checkUser, otpCode)
            // return res.status(200).json({
            //     success: true,
            //     message: `OTP sent successfully`,
            // })
            return res.redirect('/sites/e4d4/otp-verification')
        } else {
            // return res.status(200).json({
            //     success: false,
            //     error: `Email Address Not Registered!`
            // })
            return res.redirect('/sites/e4d4/reset-password?error=Email Address Not Registered!')
        }

    } catch (error) {
        console.log('error from forger password app', error.message)
        res.status(200).json({
            success: false,
            message: error.message
        })
        return res.redirect('/sites/e4d4/reset-password?error=Something Went Wrong')
    }
})

router.post('/verify-otp', async (req, res) => {
    try {
        const { code, email } = req.body;
        const checkUser = await User.findOne({ 'primaryEmail.email': email })

        if (checkUser) {
            const userId = checkUser._id
            const otpDocument = await Otp.findOne({ user: userId }).exec();
            if (!otpDocument) {
                return res.status(200).json({ success: false, error: 'OTP Verification Failed' });
            } else {
                if (otpDocument.code == code) {
                    return res.redirect('/sites/e4d4/update-password')
                }
                return res.redirect('/sites/e4d4/otp-verification?error=Invalid or Expired OTP')
            }
        } else {
            res.status(200).json({ success: false, error: 'User Not Found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(200).json({ success: false, error: 'OTP Verification Failed' });
    }
})
router.post('/update-password', async (req, res) => {
    try {
        const { entp, enml, resetpassword, confirmresetpassword } = req.body;
        const otpDocument = await Otp.findOne({ userId: entp }).exec();
        console.log(req.body)
        console.log('otpDocument', otpDocument)
        if (otpDocument?.code == enml) {
            if (resetpassword == confirmresetpassword) {
                const checkUser = await User.findById(entp)
                if (checkUser) {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(resetpassword, salt)
                    checkUser.password = hashPassword
                    await checkUser.save()
                    const { _id, email } = checkUser
                    const user = {
                        id: _id, email
                    }
                    const authtoken = jwt.sign(user, JWT_SECRET);
                    return res.status(200).json({
                        success: true,
                        authtoken,
                        message: 'Password Updated Successfully',
                    })
                } else {
                    res.status(200).json({ success: false, error: 'User Not Found' });
                }

            } else {
                return res.status(200).json({ success: false, error: 'Password Not Match with Confirm Password' });
            }
        } else {
            return res.status(200).json({ success: false, error: 'OTP Verification Failed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(200).json({ success: false, error: error.message });
    }
})
module.exports = router