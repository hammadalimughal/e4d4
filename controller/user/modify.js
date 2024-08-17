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
const storage = multer.diskStorage({
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
const uploadProfileVideo = multer({ storage: storage, fileFilter: fileFilter });
const uploadImage = multer({ storage: storage, fileFilter: imageFilter });

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

// project upload route
router.post('/projects', uploadImage.single("projects"), async (req, res, next) => {
    try {
        const images = req.files;
        const userId = req.body.user
        const user = await User.findById(userId)
        if (!user) {
            const error = new Error("Something went Wrong");
            error.httpStatusCode = 400;
            return next(error);
        }
        if (images && images.length > 0) {
            let projects = []
            res.status(200).json({ message: 'Files uploaded successfully', files: images });    
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


module.exports = router;
