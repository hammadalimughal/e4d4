const express = require('express')
const router = express.Router()
const Connection = require('../../schema/Connection');
const User = require('../../schema/User');
const Business = require('../../schema/Business');

router.post('/request/business', async (req, res) => {
    try {
        const { company,
            user,
            coverPhoto = false,
            profile = false,
            fullName = false,
            jobTitle = false,
            subHeading = false,
            experience = false,
            location = false,
            memberSince = false,
            about = false,
            profileVideo = false,
            primaryEmail = false,
            phone = false,
            portfolio,
            experiences = false,
            educations = false,
            volunteerExperiences = false,
            licenseCertification = false
        } = req.body;
        const projects = JSON.parse(req.body.projects)

        const userObj = await User.findById(user)

        if (!userObj) {
            return res.redirect('/sites/e4d4/dashboard?error=Something Went Wrong');
        }

        const checkConnection = await Connection.findOne({
            company, user
        })
        if (checkConnection) {
            return res.redirect('/sites/e4d4/dashboard?error=Connection Already Exists');
        }
        const connectionCount = await Connection.countDocuments({user})
        console.log('connectionCount',connectionCount)
        if(connectionCount > 10){
            return res.redirect('/sites/e4d4/dashboard?error=You can Connect with 10 Businesses Only!');
        }
        const connection = await Connection.create({ business: company, user, coverPhoto, profile, fullName, jobTitle, subHeading, experience, location, memberSince, about, profileVideo, primaryEmail, phone, portfolio, experiences, educations, volunteerExperiences, licenseCertification, projects })
        let connectionArray = userObj.connection ? userObj.connection : []
        connectionArray.push(connection._id)
        userObj.connection = connectionArray
        await userObj.save()

        const businessObj = await Business.findById(company)
        const businessNotifications = businessObj.notifications ? businessObj.notifications : []

        businessNotifications.push({
            type: 'connection request',
            message: 'New Connection Request',
            url: `/sites/e4d4/connection/request/${connection._id}`,
            relatedId: connection._id,
            relatedModel: 'connection'
        })

        businessNotifications.notifications = businessNotifications

        await businessObj.save()
        // Continue with your logic...
        if (connection) {
            return res.redirect('/sites/e4d4/dashboard?message=Connection Request Sent');
        }
        res.redirect(`/sites/e4d4/connection-request?company=${company}`);
    } catch (error) {
        console.log('Error making connection request:', error.message);
        res.redirect('/sites/e4d4/dashboard?error=', error.message);
    }
});

router.post('/approval', async (req, res) => {
    try {
        const { id, user, business } = req.body
        const connection = await Connection.findById(id)
        if (connection.user.toString() == user.toString() && connection.business.toString() == business.toString()) {
            connection.approved = true
            await connection.save()
            return res.redirect(`/sites/e4d4/connected-profile/${connection._id}?message=Connected Successfully`)
        }
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    } catch (error) {
        console.log('Error accepting connection request:', error.message);
        res.redirect('/sites/e4d4/dashboard?error=', error.message);
    }
})

router.post('/delete', async (req, res) => {
    try {
        const { id, user, business } = req.body
        console.log({ id, user, business })
        const connection = await Connection.findById(id)
        if (connection.user.toString() == user.toString() && connection.business.toString() == business.toString()) {
            connection.approved = true
            await connection.deleteOne();
            const updatedBusiness = await Business.findOneAndUpdate(
                { _id: business },
                { $pull: { notifications: { relatedId: id } } },
                { new: true } // Return the updated document
            );
            return res.redirect(`/sites/e4d4/profile?message=Connection Deleted Successfully`)
        }
        return res.redirect(`/sites/e4d4/profile?error=Something Went Wrong`)
    } catch (error) {
        console.log('Error accepting connection request:', error.message);
        res.redirect('/sites/e4d4/dashboard?error=', error.message);
    }
})

module.exports = router