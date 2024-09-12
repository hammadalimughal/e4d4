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
        const { id } = req.body
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
        const { id, fullName, subHeading, jobTitle, about, phone, portfolio, experience, skills } = req.body
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
        if (portfolio) {
            user.portfolio = portfolio
        }
        if (experience) {
            user.experience = experience
        }
        if (skills) {
            user.skills = JSON.parse(skills)
        }
        console.log('user', user)
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=User Info Updated')
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
});
router.post('/social-info', async (req, res) => {
    try {
        const { id, facebook, instagram, twitter, linkedin, behance, pinterest, dribbble, linktree } = req.body
        console.log('id: ', id, 'facebook: ', facebook, 'instagram: ', instagram, 'twitter: ', twitter, 'linkedin: ', linkedin, 'behance: ', behance, 'pinterest: ', pinterest, 'dribbble: ', dribbble, 'linktree: ', linktree)
        console.log('body', req.body)
        const user = await User.findById(id)
        // const formData = {}
        if (!user) {
            return res.json({
                success: false,
                error: 'User Not Found'
            })
        }
        const socialLinks = user.socialLinks?.length > 0 ? user.socialLinks : []
        // Helper function to add or update a social link
        const addOrUpdateLink = (platform, username) => {
            let existingLink = socialLinks.find(link => link.platform === platform);
            const index = socialLinks.indexOf(existingLink)
            if (existingLink) {
                if (username) {
                    existingLink.username = username; // Update the username if the platform already exists
                } else {
                    socialLinks.splice(index, 1);
                }
            } else {
                socialLinks.push({ platform, username }); // Add new link if platform doesn't exist
            }
        };
        // Add or update social links based on the provided data
        if (facebook !== undefined) { addOrUpdateLink('facebook', facebook) };
        if (instagram !== undefined) { addOrUpdateLink('instagram', instagram) };
        if (twitter !== undefined) { addOrUpdateLink('twitter', twitter) };
        if (linkedin !== undefined) { addOrUpdateLink('linkedin', linkedin) };
        if (behance !== undefined) { addOrUpdateLink('behance', behance) };
        if (pinterest !== undefined) { addOrUpdateLink('pinterest', pinterest) };
        if (dribbble !== undefined) { addOrUpdateLink('dribbble', dribbble) };
        if (linktree !== undefined) { addOrUpdateLink('linktree', linktree) };

        // Update user's socialLinks and save
        user.socialLinks = socialLinks;
        console.log('user', user)
        await user.save()
        // return res.redirect('/sites/e4d4/edit/profile?message=User Info Updated')
        return res.json({
            success: true,
            message: `Contact Info Updated`
        })
    } catch (error) {
        console.log(error.message);
        // return res.status(500).json({ message: error.message });
        return res.json({
            success: false,
            error: error.message
        })
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
        if (!user) {
            // return res.json({ error: 'User Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        let newProject = await Project.create({
            user: id,
            title,
            image: `/assets/uploads/projects/` + image.filename
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

router.post('/education/add', async (req, res) => {
    try {
        const { userId, institute, degree, startingDate_month, startingDate_year, endingDate_month, endingDate_year } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        let startingDate = new Date()
        startingDate.setMonth(startingDate_month)
        startingDate.setYear(startingDate_year)

        let endingDate = new Date()
        endingDate.setMonth(endingDate_month)
        endingDate.setYear(endingDate_year)

        console.log('startingDate',startingDate)
        console.log('endingDate',endingDate)

        if (endingDate < startingDate) {
            return res.redirect('/sites/e4d4/edit/profile?error=Starting Date should be before Ending Date')
        }
        const education = { institute, degree, startingDate, endingDate }
        let educations = user.educations ? user.educations : []
        educations.push(education)
        user.educations = educations
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=New Education Added Successfully')
    } catch (error) {
        console.log(error.message);
        return res.redirect(`/sites/e4d4/edit/profile?error=${error.message}`)
    }
})
router.post('/education/edit', async (req, res) => {
    try {
        const { userId, eduId, institute, degree, startingDate_month, startingDate_year, endingDate_month, endingDate_year } = req.body

        let startingDate = new Date()
        startingDate.setMonth(startingDate_month)
        startingDate.setYear(startingDate_year)

        let endingDate = new Date()
        endingDate.setMonth(endingDate_month)
        endingDate.setYear(endingDate_year)
        const updatedEducationData = {
            institute, degree, startingDate, endingDate
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "educations._id": eduId },
            {
                $set: {
                    "educations.$": updatedEducationData 
                }
            },
            { new: true }
        );
        if (!updatedUser) {
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        return res.redirect('/sites/e4d4/edit/profile?message=Education Updated Successfully')
    } catch (error) {
        console.log(error.message);
        return res.redirect(`/sites/e4d4/edit/profile?error=${error.message}`)
    }
});
router.post('/education/delete', async (req, res) => {
    try {
        const { userId, educationId } = req.body

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { educations: { _id: educationId } } },
            { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.json({
                success: false,
                error: 'Something Went Wrong'
            })
        }
        return res.json({
            success: true,
            message: 'Education Deleted!'
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
router.post('/education/get', async (req, res) => {
    try {
        const { userId, educationId } = req.body

        const updatedUser = await User.findById(userId);
        let education;
        updatedUser?.educations.forEach((item) => {
            if (item._id == educationId) {
                education = item
            }
        })
        if (!education) {
            return res.json({
                success: false,
                error: 'Something Went Wrong'
            })
        }
        return res.json({
            success: true,
            education
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
router.post('/experience/add', async (req, res) => {
    try {
        const { id, title, employementType, companyName, location, locationType, currentlyWorking, startingDate_month, startingDate_year, endingDate_month, endingDate_year, description } = req.body

        let startingDate = new Date()
        startingDate.setMonth(startingDate_month)
        startingDate.setYear(startingDate_year)

        let endingDate = new Date()
        endingDate.setMonth(endingDate_month)
        endingDate.setYear(endingDate_year)
        if (endingDate < startingDate) {
            return res.redirect('/sites/e4d4/edit/profile?error=Starting Date should be before Ending Date')
        }
        const textDescription = description.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('<ul>', '').replaceAll('</ul>', '').replaceAll('<ol>', '').replaceAll('</ol>', '').replaceAll('<li>', '').replaceAll('</li>', '').replaceAll('<strong>', '').replaceAll('</strong>', '')
        console.log('textDescription', textDescription.length)
        if (textDescription.length > 1150) {
            console.log('textDescription', textDescription)
            return res.redirect('/sites/e4d4/edit/profile?error=Experience Description Should Not Exceed 1000 characters')
        }
        const user = await User.findById(id)
        if (!user) {
            // return res.json({ error: 'User Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        let experience = {
            title, employementType, companyName, location, locationType, currentlyWorking, startingDate, endingDate, description
        }
        let experiences = user.experiences ? user.experiences : []
        experiences.push(experience)
        user.experiences = experiences
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=New Experience Added Successfully')
    } catch (error) {
        console.log(error.message);
        return res.redirect(`/sites/e4d4/edit/profile?error=${error.message}`)
    }
});
router.post('/experience/edit', async (req, res) => {
    try {
        const { userId, expId, title, employementType, companyName, location, locationType, currentlyWorking, startingDate_month, startingDate_year, endingDate_month, endingDate_year, description } = req.body

        let startingDate = new Date()
        startingDate.setMonth(startingDate_month)
        startingDate.setYear(startingDate_year)

        let endingDate = new Date()
        endingDate.setMonth(endingDate_month)
        endingDate.setYear(endingDate_year)
        const textDescription = description.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('<ul>', '').replaceAll('</ul>', '').replaceAll('<ol>', '').replaceAll('</ol>', '').replaceAll('<li>', '').replaceAll('</li>', '').replaceAll('<strong>', '').replaceAll('</strong>', '')
        console.log('textDescription', textDescription.length)
        if (textDescription.length > 1150) {
            console.log('textDescription', textDescription)
            return res.redirect('/sites/e4d4/edit/profile?error=Experience Description Should Not Exceed 1000 characters')
        }
        // const updatedUser = await User.findOneAndUpdate(
        //     { _id: userId },
        //     { $pull: { experiences: { _id: expId } } }
        // );
        const updatedExperienceData = {
            title, employementType, companyName, location, locationType, currentlyWorking, startingDate, endingDate, description
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "experiences._id": expId }, // Find the user with the specific experience
            {
                $set: {
                    "experiences.$": updatedExperienceData // Update the specific experience in the array
                }
            },
            { new: true } // Return the updated document
        );
        // const user = await User.findById(id)
        if (!updatedUser) {
            // return res.json({ error: 'User Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        // let experience = {
        //     title, employementType, companyName, location, locationType, currentlyWorking, startingDate, endingDate, description
        // }
        // let experiences = user.experiences ? user.experiences : []
        // experiences.push(experience)
        // user.experiences = experiences
        // await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Experience Updated Successfully')
    } catch (error) {
        console.log(error.message);
        return res.redirect(`/sites/e4d4/edit/profile?error=${error.message}`)
    }
});
router.post('/experience/delete', async (req, res) => {
    try {
        const { userId, experienceId } = req.body

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { experiences: { _id: experienceId } } },
            { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.json({
                success: false,
                error: 'Something Went Wrong'
            })
        }
        return res.json({
            success: true,
            message: 'Experience Deleted!'
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
router.post('/experience/get', async (req, res) => {
    try {
        const { userId, experienceId } = req.body

        const updatedUser = await User.findById(userId);
        let experience;
        updatedUser?.experiences.forEach((item) => {
            if (item._id == experienceId) {
                experience = item
            }
        })
        if (!experience) {
            return res.json({
                success: false,
                error: 'Something Went Wrong'
            })
        }
        return res.json({
            success: true,
            experience
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
router.post('/remove-project-item', async (req, res) => {
    try {
        const { user, project } = req.body
        const userObj = await User.findById(user)

        if (!userObj) {
            // return res.json({ error: 'User Not Found' });
            return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        await Project.findByIdAndDelete(project)
        const projectIndex = userObj.projects.indexOf(project)
        userObj.projects.splice(projectIndex, 1)
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

        if (!userObj) {
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

        if (!userObj) {
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
        if (!user) {
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('image', image)
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
        if (!user) {
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('image', image)
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
        if (!user) {
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('resume', resume)
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
        if (!user) {
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('coverLetter', coverLetter)
        user.coverLetter = `/assets/uploads/cover-letter/` + coverLetter.filename
        await user.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Resume Updated Successfully')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
