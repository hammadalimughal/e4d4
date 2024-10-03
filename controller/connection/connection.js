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
            portfolio = false
        } = req.body;

        const experiences = req.body.experiences ? JSON.parse(req.body.experiences) : []
        const educations = req.body.educations ? JSON.parse(req.body.educations) : []
        const volunteerExperiences = req.body.volunteerExperiences ? JSON.parse(req.body.volunteerExperiences) : []
        const projects = req.body.projects ? JSON.parse(req.body.projects) : []
        // return
        const licenseCertification = req.body.licenseCertification ? JSON.parse(req.body.licenseCertification) : []
        const personalDocuments = req.body.personalDocuments ? JSON.parse(req.body.personalDocuments) : []

        const userObj = await User.findById(user)

        if (!userObj) {
            return res.redirect('/dashboard?error=Something Went Wrong');
        }

        const checkConnection = await Connection.findOne({
            company, user
        })
        if (checkConnection) {
            return res.redirect('/dashboard?error=Connection Already Exists');
        }
        const connectionCount = await Connection.countDocuments({ user })
        console.log('connectionCount', connectionCount)
        if (connectionCount > 10) {
            return res.redirect('/dashboard?error=You can Connect with 10 Businesses Only!');
        }
        const connection = await Connection.create({ business: company, user, coverPhoto, profile, fullName, jobTitle, subHeading, experience, location, memberSince, about, profileVideo, primaryEmail, phone, portfolio, experiences, educations, volunteerExperiences, licenseCertification, projects, personalDocuments })
        let connectionArray = userObj.connection ? userObj.connection : []
        connectionArray.push(connection._id)
        userObj.connection = connectionArray
        await userObj.save()

        const businessObj = await Business.findById(company)
        const businessNotifications = businessObj.notifications ? businessObj.notifications : []

        businessNotifications.push({
            type: 'connection request',
            message: 'New Connection Request',
            url: `/connection/request/${connection._id}`,
            relatedId: connection._id,
            relatedModel: 'connection'
        })

        businessNotifications.notifications = businessNotifications

        await businessObj.save()
        // Continue with your logic...
        if (connection) {
            return res.redirect('/dashboard?message=Connection Request Sent');
        }
        res.redirect(`/connection-request?company=${company}`);
    } catch (error) {
        console.log('Error making connection request:', error.message);
        res.redirect('/dashboard?error=', error.message);
    }
});

router.post('/approval', async (req, res) => {
    try {
        const { id, user, business } = req.body
        const connection = await Connection.findById(id)
        if (connection.user.toString() == user.toString() && connection.business.toString() == business.toString()) {
            connection.approved = true
            await connection.save()
            return res.redirect(`/connected-profile/${connection._id}?message=Connected Successfully`)
        }
        return res.redirect(`/profile?error=Something Went Wrong`)
    } catch (error) {
        console.log('Error accepting connection request:', error.message);
        res.redirect('/dashboard?error=', error.message);
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
            return res.redirect(`/profile?message=Connection Deleted Successfully`)
        }
        return res.redirect(`/profile?error=Something Went Wrong`)
    } catch (error) {
        console.log('Error accepting connection request:', error.message);
        res.redirect('/dashboard?error=', error.message);
    }
})

router.post('/update-connection', async (req, res) => {
    try {
        const { user, companies, data } = req.body
        const parseCompanies = JSON.parse(companies)
        const parsedData = JSON.parse(data);
        const { key, data: fieldData } = parsedData;
        for (const businessId of parseCompanies) {
            const connection = await Connection.findOne({ user, business: businessId });

            connection[key].push(fieldData._id);
            await connection.save();
        }
        res.redirect('/edit/profile?message=Connection Data Updated!');
    } catch (error) {
        console.log('Error accepting connection request:', error.message);
        res.redirect('/dashboard?error=', error.message);

    }
})

module.exports = router