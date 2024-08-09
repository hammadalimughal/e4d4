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
            suburb,
            phone,
            educationLevel,
            skills,
            industryInterest,
            termsCondition,
            weeksOfAvailablity,
            workType,
            workClassification,
            preferredJobLocation,
            positionTypeInterest,
            salaryExpectation
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
        if (!suburb) {
            errors.push(`Suburb is Invalid or not Filled`)
        }
        if (!educationLevel) {
            errors.push(`Education Level is Invalid or not Filled`)
        }
        if (!phone) {
            errors.push(`Phone is Invalid or not Filled`)
        }
        if (!skills) {
            errors.push(`Skills is Invalid or not Filled`)
        }
        if (!industryInterest) {
            errors.push(`Industry Interest is Invalid or not Filled`)
        }
        if (!termsCondition) {
            errors.push(`Accept on Terms & Condition`)
        }
        if (!weeksOfAvailablity) {
            errors.push(`Weeks Of Availablity is Invalid or not Filled`)
        }
        if (!workType) {
            errors.push(`Work Type is Invalid or not Filled`)
        }
        if (!workClassification) {
            errors.push(`Work Classification is Invalid or not Filled`)
        }
        if (!preferredJobLocation) {
            errors.push(`Job Location is Invalid or not Filled`)
        }
        if (!positionTypeInterest) {
            errors.push(`Position Type Interest is Invalid or not Filled`)
        }
        if (!salaryExpectation) {
            errors.push(`Salary Expectation is Invalid or not Filled`)
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
                    checkUser.suburb = suburb
                    checkUser.phone = phone
                    checkUser.educationLevel = educationLevel
                    checkUser.skills = skills
                    checkUser.industryInterest = industryInterest
                    checkUser.termsCondition = termsCondition
                    checkUser.weeksOfAvailablity = weeksOfAvailablity
                    checkUser.workType = workType
                    checkUser.workClassification = workClassification
                    checkUser.preferredJobLocation = preferredJobLocation
                    checkUser.positionTypeInterest = positionTypeInterest
                    checkUser.salaryExpectation = salaryExpectation
                    checkUser.infoRequired = false
                    await checkUser.save()
                    const user = {
                        id: checkUser._id, primaryEmail: {
                            email: email,
                            verified: false,
                            provider: [{
                                type: 'email'
                            }],
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
                    verified: false,
                    provider: [{
                        type: 'email'
                    }],
                },
                suburb,
                phone,
                educationLevel,
                skills,
                industryInterest,
                termsCondition,
                weeksOfAvailablity,
                workType,
                workClassification,
                preferredJobLocation,
                positionTypeInterest,
                salaryExpectation,
                infoRequired: false
            })
            const fetchUser = await User.findOne({ 'primaryEmail.email': email })
            const { _id } = fetchUser
            const user = {
                id: checkUser._id, primaryEmail: {
                    email: email,
                    verified: false,
                    provider: [{
                        type: 'email'
                    }],
                }
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