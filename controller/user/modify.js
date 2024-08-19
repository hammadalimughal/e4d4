const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const User = require('../../schema/User')

// Set the ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Configure storage for video uploads
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
// Configure storage for image uploads
const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './views/assets/uploads/projects';
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

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
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

// Set up multer for video uploads
const uploadProfileVideo = multer({ storage: storageVideo, fileFilter: fileFilter });
const uploadImage = multer({ storage: storageImage, fileFilter: imageFilter });

// Video upload route
router.post('/profileVideo', uploadProfileVideo.single("profileVideo"), async (req, res, next) => {
    try {
        const video = req.file;
        const userId = req.body.user
        const user = await User.findById(userId)
        if (!video) {
            const error = new Error("Please upload a video file");
            error.httpStatusCode = 400;
            return next(error);
        }
        if (!user) {
            const error = new Error("Something went Wrong");
            error.httpStatusCode = 400;
            return next(error);
        }
        const videoUrl = `/assets/uploads/video/${video.filename}`;
        user.profileVideo = {
            url: videoUrl
        }
        await user.save()
        res.status(200).json({ url: videoUrl, file: video });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Edit User Data
router.post('/user-info', async (req, res) => {
    try {
        const { id, fullName, subHeading, jobTitle, about, phone, linkedin } = req.body
        console.log('body', req.body)
        const user = await User.findById(id)
        // const formData = {}
        if (!user) {
            return res.redirect('/sites/e4d4/edit/profile?error=User Not Found')
        }
        if (fullName) {
            user.fullName = fullName
        }
        if (subHeading) {
            user.subHeading = subHeading
        }
        if (jobTitle) {
            user.jobTitle = jobTitle
        }
        if (about) {
            user.about = about
        }
        if (phone) {
            user.phone = phone
        }
        if (linkedin) {
            user.linkedin = linkedin
        }
        console.log('user', user)
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=User Info Updated')
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
});

// project upload route
router.post('/project', uploadImage.single("image"), async (req, res, next) => {
    try {
        const image = req.file;
        const { title, id } = req.body
        const user = await User.findById(id)
        if (!image) {
            return res.json({ error: 'Project Image Not Found' });
        }
        if(!user){
            return res.json({ error: 'User Not Found' });
        }
        let projects = user.projects ? user.projects : []
        projects.push({
            title,
            image: `/assets/uploads/projects/` + image.filename
        }) 
        user.projects = projects
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Project Added Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
