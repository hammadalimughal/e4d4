const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const User = require('../../schema/User')
const Project = require('../../schema/Project')

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
// Configure storage for video uploads
const storageResume = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './views/assets/uploads/resume';
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
// Configure storage for video uploads
const storageCoverLetter = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './views/assets/uploads/cover-letter';
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

// Configure storage for Profile image uploads
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

// Configure storage for Cover Photo uploads
const storageCoverPhoto = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './views/assets/uploads/CoverPhoto';
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
// File filter to accept only video files
const docFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "application/pdf"
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
const uploadProfileImage = multer({ storage: storageProfilePic, fileFilter: imageFilter });
const uploadCoverPhoto = multer({ storage: storageCoverPhoto, fileFilter: imageFilter });
const uploadResume = multer({ storage: storageResume, fileFilter: docFilter });
const uploadCoverLetter = multer({ storage: storageCoverLetter, fileFilter: docFilter });

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

// Video upload route
router.post('/remove-profile-video', async (req, res) => {
    try {
        const {id} = req.body
        const user = await User.findById(id)
        if (!user) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        user.profileVideo = null
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Profile Video Deleted')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// Edit User Data
router.post('/user-info', async (req, res) => {
    try {
        const { id, fullName, subHeading, jobTitle, about, phone, linkedin, experience } = req.body
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
        if (experience) {
            user.experience = experience
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
            // return res.json({ error: 'Project Image Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Error Updating Project Image')
        }
        if(!user){
            // return res.json({ error: 'User Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        let newProject = await Project.create({
            user: id,
            title,
            image:`/assets/uploads/projects/` + image.filename
        })
        let projects = user.projects ? user.projects : []
        projects.push(newProject._id) 
        user.projects = projects
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Project Added Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
router.post('/remove-project-item', async (req, res) => {
    try {
        const { user, project } = req.body
        const userObj = await User.findById(user)
        
        if(!userObj){
            // return res.json({ error: 'User Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        await Project.findByIdAndDelete(project)
        const projectIndex = userObj.projects.indexOf(project)
        userObj.projects.splice(projectIndex,1)
        await userObj.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Project Removed Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
router.post('/remove-resume-item', async (req, res) => {
    try {
        const { user } = req.body
        const userObj = await User.findById(user)
        
        if(!userObj){
            // return res.json({ error: 'User Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        userObj.resume = null
        await userObj.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Resume Removed Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
router.post('/remove-cover-letter-item', async (req, res) => {
    try {
        const { user } = req.body
        const userObj = await User.findById(user)
        
        if(!userObj){
            // return res.json({ error: 'User Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        userObj.coverLetter = null
        await userObj.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Cover Letter Removed Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

router.post('/profile-pic', uploadProfileImage.single("profilePic"), async (req, res, next) => {
    try {
        const image = req.file;
        const { id } = req.body
        const user = await User.findById(id)
        if (!image) {
            // return res.json({ error: 'Project Image Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Error Updating Profile Image')
        }
        if(!user){
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('image',image)
        user.profilePic = `/assets/uploads/profilePic/` + image.filename
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Profile Pic Updated Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

router.post('/cover-photo', uploadCoverPhoto.single("coverPhoto"), async (req, res, next) => {
    try {
        const image = req.file;
        const { id } = req.body
        const user = await User.findById(id)
        if (!image) {
            // return res.json({ error: 'Project Image Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Error Updating Cover Photo')
        }
        if(!user){
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('image',image)
        user.coverPhoto = `/assets/uploads/CoverPhoto/` + image.filename
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Cover Photo Updated Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

router.post('/upload/resume', uploadResume.single("resume"), async (req, res, next) => {
    try {
        const resume = req.file;
        const { id } = req.body
        const user = await User.findById(id)
        if (!resume) {
            // return res.json({ error: 'Project Image Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Error Updating Cover Photo')
        }
        if(!user){
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('resume',resume)
        user.resume = `/assets/uploads/resume/` + resume.filename
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Resume Updated Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
router.post('/upload/cover-letter', uploadCoverLetter.single("coverLetter"), async (req, res, next) => {
    try {
        const coverLetter = req.file;
        const { id } = req.body
        const user = await User.findById(id)
        if (!coverLetter) {
            // return res.json({ error: 'Project Image Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Error Updating Cover Photo')
        }
        if(!user){
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('coverLetter',coverLetter)
        user.coverLetter = `/assets/uploads/cover-letter/` + coverLetter.filename
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Resume Updated Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
