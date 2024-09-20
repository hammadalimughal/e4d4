const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Business = require('../../schema/Business')

const storageVideo = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './views/assets/uploads/video';
        const fullPath = path.resolve(dir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const storageProfilePic = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './views/assets/uploads/profilePic';
        const fullPath = path.resolve(dir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const videoFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "video/mp4",
        "video/avi",
        "video/mkv",
        "video/mov",
        "video/webm"
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const imageFilter = (req, file, cb) => {
    console.log("file", file)
    // only image files
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadProfileImage = multer({ storage: storageProfilePic, fileFilter: imageFilter });
const uploadProfileVideo = multer({ storage: storageVideo, fileFilter: videoFilter });

router.post('/profile-pic', uploadProfileImage.single('profilePic'), async (req, res) => {
    try {
        const profilePic = req.file
        const { id } = req.body
        const business = await Business.findById(id)
        if (!profilePic) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Error Updating Profile Picture')
        }
        if (!business) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        business.profilePic = `/assets/uploads/profilePic/` + profilePic.filename
        await business.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Profile Picture Updated Successfully')
    } catch (error) {
        console.log('error updating Business Profile Picture: ', error.message)
        return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
    }
})

router.post('/profile-video', uploadProfileVideo.single('profileVideo'), async (req, res) => {
    try {
        const profileVideo = req.file
        const { id } = req.body
        const business = await Business.findById(id)
        if (!profileVideo) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Error Updating Profile Video')
        }
        if (!business) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        business.profileVideo = `/assets/uploads/video/` + profileVideo.filename
        await business.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Profile Video Updated Successfully')
    } catch (error) {
        console.log('error updating Business Profile Video: ', error.message)
        return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
    }
})

router.post('/remove-profile-video', uploadProfileVideo.single('profileVideo'), async (req, res) => {
    try {
        const { id } = req.body
        const business = await Business.findById(id)
        if (!business) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        business.profileVideo = undefined
        await business.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Profile Video Deleted Successfully')
    } catch (error) {
        console.log('error updating Business Profile Video: ', error.message)
        return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
    }
})

router.post('/info', async (req, res) => {
    try {
        const { id, businessYears, fullName, subHeading, industry, about, workWithUs } = req.body
        const business = await Business.findById(id)
        if (!business) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        if (businessYears) {
            business.businessYears = businessYears
        }
        if (fullName) {
            business.fullName = fullName
        }
        if (subHeading) {
            business.subHeading = subHeading
        }
        if (about) {
            business.about = about
        }
        if (industry) {
            business.industry = industry
        }
        if (workWithUs) {
            business.workWithUs = workWithUs
        }
        await business.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Business Info Updated Successfully')
    } catch (error) {
        console.log('error updating Business Profile Video: ', error.message)
        return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
    }
})

module.exports = router