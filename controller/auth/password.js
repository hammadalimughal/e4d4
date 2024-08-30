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
            var otpObj = await Otp.findOne({ user: userId })
            if (otpObj) {
                otpObj.code = otpCode
                await otpObj.save()
            } else {
                otpObj = await Otp.create({ user: userId, code: otpCode })
            }
            console.log('otpObj', otpObj)
            await sendOtp(checkUser, otpCode)
            console.log('userId', userId)
            // req.session.otpObjId = otpObj._id
            // req.session.otpUserId = userId
            const token = jwt.sign({
                user: userId,
                otp: otpObj._id
            }, JWT_SECRET);
            return res.cookie('codepass', token, { maxAge: 5 * 60 * 1000 }).redirect('/sites/e4d4/otp-verification')
        } else {
            // return res.status(200).json({
            //     success: false,
            //     error: `Email Address Not Registered!`
            // })
            return res.redirect('/sites/e4d4/business-reset-password?error=Email Address Not Registered!')
        }

    } catch (error) {
        console.log('error from forget password route: /get-otp ', error.message)
        // res.status(200).json({
        //     success: false,
        //     message: error.message
        // })
        return res.redirect('/sites/e4d4/business-reset-password?error=Something Went Wrong')
    }
})

router.post('/verify-otp', async (req, res) => {
    try {
        const { code, email } = req.body;
        // const { otpObjId, otpUserId } = req.session
        // console.log('otpObjId', otpObjId)
        // console.log('otpUserId', otpUserId)
        // const token = req.cookies['codepass']
        const token = jwt.verify(req.cookies['codepass'], JWT_SECRET)
        console.log('token',token)
        const otpUserId = token.user
        const otpObjId = token.otp
        const checkUser = await User.findById(otpUserId)
        if (checkUser) {
            // const userId = checkUser._id
            const otpDocument = await Otp.findOne({ _id: otpObjId, user: otpUserId }).exec();
            console.log('otpDocument', otpDocument)
            if (!otpDocument) {
                // return res.status(200).json({ success: false, error: 'OTP Verification Failed' });
                return res.redirect('/sites/e4d4/otp-verification?error=OTP Verification Failed')
            } else {
                if (otpDocument.code == code) {
                    return res.redirect('/sites/e4d4/update-password')
                }
                return res.redirect('/sites/e4d4/otp-verification?error=Invalid or Expired OTP')
            }
        } else {
            // res.status(200).json({ success: false, error: 'User Not Found' });
            return res.redirect('/sites/e4d4/otp-verification?error=OTP Verification Failed')
        }
    } catch (error) {
        console.error('otp verification failed: ', error);
        return res.redirect('/sites/e4d4/otp-verification?error=OTP Verification Failed')
        // return res.status(200).json({ success: false, error: 'OTP Verification Failed' });
    }
})
router.post('/update-password', async (req, res) => {
    try {
        const { password, confirmresetpassword } = req.body;
        // const { otpObjId, otpUserId } = req.session
        // console.log('otpObjId', otpObjId)
        // console.log('otpUserId', otpUserId)
        const token = jwt.verify(req.cookies['codepass'], JWT_SECRET)
        const otpUserId = token.user
        const otpObjId = token.otp
        const otpDocument = await Otp.findOne({
            user: otpUserId
        }).exec();
        console.log(req.body)
        console.log('otpDocument', otpDocument)
        // return
        if (otpDocument?._id == otpObjId) {
            if (password == confirmresetpassword) {
                const checkUser = await User.findById(otpUserId)
                if (checkUser) {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    checkUser.password = hashPassword
                    await checkUser.save()
                    const { _id, primaryEmail } = checkUser
                    const user = {
                        id: _id, primaryEmail
                    }
                    const authtoken = jwt.sign(user, JWT_SECRET);
                    return res.cookie('authtoken', authtoken).redirect(`/sites/e4d4/profile/${_id}?message=Password Updated Successfully...`)
                } else {
                    return res.redirect(`/sites/e4d4/update-password/?error=Something Went Wrong...`)
                }

            } else {
                return res.redirect(`/sites/e4d4/update-password/?error=Password not matched with Confirm Password...`)
            }
        } else {
            return res.redirect(`/sites/e4d4/update-password/?error=Session Expired`)
        }
    } catch (error) {
        console.error(error);
        return res.redirect(`/sites/e4d4/update-password/?error=Something Went Wrong`)
    }
})
module.exports = router