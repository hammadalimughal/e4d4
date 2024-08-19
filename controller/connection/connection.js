const express = require('express')
const User = require('../../schema/User')
const Business = require('../../schema/Business')
const router = express.Router()

router.post('/request/business', async (req, res) => {
    try {
        const { businessId, userId } = req.body
        // const user = await User.findById(userId)
        const business = await Business.findById(businessId)
        let requests = business.connectionReq ?business.connectionReq : []
        requests.push(userId)
        await business.save()
        res.redirect('/sites/e4d4/dashboard?message=Connection Request Sent')
    } catch (error) {
        console.log('error making connection request: ', error.message)
        res.redirect('/sites/e4d4/dashboard?error=Error making connection request')
    }
})

module.exports = router