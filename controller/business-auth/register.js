const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "E4d4U$er";
const Business = require('../../schema/Business')

router.post('/', async (req, res) => {
    try {
        const { fullName, address, email, phone, password, confirmPassword, location, industry, operatingIndustry, sizeOfCompany, foundedDate, headQuarterLocation, website, companyEmail } = req.body
        let errors = []
        if (password !== confirmPassword) {
            errors.push(`Password & Confirm Password should be Same`)
        }
        if (!fullName) {
            errors.push(`Full Name is Invalid or not Filled`)
        }
        if (!address) {
            errors.push(`Address is Invalid or not Filled`)
        }
        if (!email) {
            errors.push(`Email is Invalid or not Filled`)
        }
        if (!phone) {
            errors.push(`Phone is Invalid or not Filled`)
        }
        if (!password) {
            errors.push(`Password is Invalid or not Filled`)
        }
        if (!location) {
            errors.push(`Location is Invalid or not Filled`)
        }
        if (!industry) {
            errors.push(`Industry is Invalid or not Filled`)
        }
        if (!operatingIndustry) {
            errors.push(`Operating Industry is Invalid or not Filled`)
        }
        if (!sizeOfCompany) {
            errors.push(`Size of Company is Invalid or not Filled`)
        }
        if (!foundedDate) {
            errors.push(`Company Founded Date is Invalid or not Filled`)
        }
        if (!headQuarterLocation) {
            errors.push(`Headquarter Location is Invalid or not Filled`)
        }
        if (!companyEmail) {
            errors.push(`Company Email is Invalid or not Filled`)
        }
        if (errors.length == 0) {
            // if (password !== confirmPassword) {
            //     return res.status(409).json({
            //         error: "Password & Confirm Should be same"
            //     })
            // }
            const checkBusiness = await Business.findOne({ 'primaryEmail.email': email })
            if (checkBusiness) {
                return res.status(409).json({
                    success: false,
                    error: 'Email Already Exist',
                })
            }
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const minCompSize = sizeOfCompany.split('-')[0]
            const maxCompSize = sizeOfCompany.split('-')[1]
            newBusiness = await Business.create({
                fullName, address,
                primaryEmail: {
                    email
                },
                phone, password: hashPassword, confirmPassword, location, industry, operatingIndustry, sizeOfCompany: {
                    min: minCompSize,
                    max: maxCompSize
                }, foundedDate, headQuarterLocation, website, companyEmail: {
                    email: companyEmail
                }
            })
            const business = {
                id: newBusiness._id,
                fullName,
                primaryEmail: newBusiness.primaryEmail,
                phone,
                companyEmail
            }
            const authtoken = jwt.sign(business, JWT_SECRET);
            return res.status(200).cookie('authtoken', authtoken).cookie('e4d4business', true).json({
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