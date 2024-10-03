const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Business = require('../../schema/Business');
const Otp = require("../../schema/OTP")
const bcrypt = require('bcryptjs');
const JWT_SECRET = "E4d4U$er";
const sendOtp = require('../email/send-otp');

router.post('/get-otp', async (req, res) => {
    try {
        const { email } = req.body
        const checkBusiness = await Business.findOne({ 'primaryEmail.email': email })
        if (checkBusiness) {
            const businessId = checkBusiness._id
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
            var otpObj = await Otp.findOne({ business: businessId })
            if (otpObj) {
                otpObj.code = otpCode
                await otpObj.save()
            } else {
                otpObj = await Otp.create({ business: businessId, code: otpCode })
            }
            console.log('otpObj', otpObj)
            await sendOtp(checkBusiness, otpCode)
            console.log('businessId', businessId)
            // req.session.otpObjId = otpObj._id
            // req.session.otpbusinessId = businessId
            const token = jwt.sign({
                business: businessId,
                otp: otpObj._id
            }, JWT_SECRET);
            return res.cookie('businesscodepass', token, { maxAge: 5 * 60 * 1000 }).redirect('/business-otp-verification')
        } else {
            // return res.status(200).json({
            //     success: false,
            //     error: `Email Address Not Registered!`
            // })
            return res.redirect('/business-reset-password?error=Email Address Not Registered!')
        }

    } catch (error) {
        console.log('error', error)
        console.log('error from business forget password route: /get-otp ', error.message)
        // res.status(200).json({
        //     success: false,
        //     message: error.message
        // })
        return res.redirect('/reset-password?error=Something Went Wrong')
    }
})

router.post('/verify-otp', async (req, res) => {
    try {
        const { code } = req.body;
        const token = jwt.verify(req.cookies['businesscodepass'], JWT_SECRET)
        console.log('token', token)
        const otpBusinessId = token.business
        const otpObjId = token.otp
        const checkBusiness = await Business.findById(otpBusinessId)
        console.log('checkBusiness', checkBusiness)
        if (checkBusiness) {
            const businessId = checkBusiness._id
            const otpDocument = await Otp.findOne({ _id: otpObjId, business: businessId }).exec();
            console.log('otpDocument', otpDocument)
            if (!otpDocument) {
                // return res.status(200).json({ success: false, error: 'OTP Verification Failed' });
                return res.redirect('/business-otp-verification?error=OTP Verification Failed')
            } else {
                if (otpDocument.code == code) {
                    return res.redirect('/business-update-password')
                }
                return res.redirect('/business-otp-verification?error=Invalid or Expired OTP')
            }
        } else {
            // res.status(200).json({ success: false, error: 'User Not Found' });
            return res.redirect('/business-otp-verification?error=OTP Verification Failed')
        }
    } catch (error) {
        console.error('otp verification failed: ', error);
        return res.redirect('/business-otp-verification?error=OTP Verification Failed')
        // return res.status(200).json({ success: false, error: 'OTP Verification Failed' });
    }
})
router.post('/update-password', async (req, res) => {
    try {
        const { password, confirmresetpassword } = req.body;
        // const { otpObjId, otpUserId } = req.session
        // console.log('otpObjId', otpObjId)
        // console.log('otpUserId', otpUserId)
        const token = jwt.verify(req.cookies['businesscodepass'], JWT_SECRET)
        const otpBusinessId = token.business
        const otpObjId = token.otp
        const otpDocument = await Otp.findOne({
            business: otpBusinessId
        }).exec();
        console.log(req.body)
        console.log('otpDocument', otpDocument)
        // return
        if (otpDocument?._id == otpObjId) {
            if (password == confirmresetpassword) {
                const checkBusiness = await Business.findById(otpBusinessId)
                if (checkBusiness) {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    checkBusiness.password = hashPassword
                    await checkBusiness.save()
                    const { _id, primaryEmail } = checkBusiness
                    const user = {
                        id: _id, primaryEmail
                    }
                    const authtoken = jwt.sign(user, JWT_SECRET);
                    return res.cookie('authtoken', authtoken).redirect(`/business-dashboard?message=Password Updated Successfully...`)
                } else {
                    return res.redirect(`/business-update-password/?error=Something Went Wrong...`)
                }

            } else {
                return res.redirect(`/business-update-password/?error=Password not matched with Confirm Password...`)
            }
        } else {
            return res.redirect(`/business-update-password/?error=Session Expired`)
        }
    } catch (error) {
        console.error(error);
        return res.redirect(`/business-update-password/?error=Something Went Wrong`)
    }
})
module.exports = router