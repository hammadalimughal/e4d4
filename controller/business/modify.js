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

const storageBusinessPhoto = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './views/assets/uploads/businessImages';
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
const uploadCoverPhoto = multer({ storage: storageCoverPhoto, fileFilter: imageFilter });
const uploadbusinessImages = multer({ storage: storageBusinessPhoto, fileFilter: imageFilter });

router.post('/cover-photo', uploadCoverPhoto.single("coverPhoto"), async (req, res, next) => {
    try {
        const image = req.file;
        const { id } = req.body
        const business = await Business.findById(id)
        if (!image) {
            // return res.json({ error: 'Project Image Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Error Updating Cover Photo')
        }
        if (!business) {
            // return res.json({ error: 'User Not Found' });
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        console.log('image', image)
        business.coverPhoto = `/assets/uploads/CoverPhoto/` + image.filename
        await business.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Cover Photo Updated Successfully')
    } catch (error) {
        console.log(error.message);
        return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
    }
});

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

router.post('/business-images', uploadbusinessImages.array('image'), async (req, res) => {
    try {
        const businessImages = req.files
        console.log('businessImages', businessImages)
        const { id } = req.body
        const business = await Business.findById(id)
        if (!businessImages || businessImages?.length == 0) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Error Uploading Business Photos')
        }
        if (!business) {
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        let images = business.businessImages ? business.businessImages : []
        let tempImages = []
        businessImages.forEach((item) => {
            tempImages.push(`/assets/uploads/businessImages/${item.filename}`)
            images.push(`/assets/uploads/businessImages/${item.filename}`)
        })
        business.businessImages = images
        await business.save()
        console.log('business', business)
        return res.json({ images: tempImages })
    } catch (error) {
        console.log('error updating Business Profile Picture: ', error.message)
        return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
    }
})

router.post('/remove-business-image', async (req, res) => {
    try {
        const { id, item } = req.body
        const business = await Business.findByIdAndUpdate(
            id,
            {
                $pull: { businessImages: item }
            },
            { new: true }        );
        if (!business) {
            console.log('business',business)
            return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
        }
        await business.save()
        console.log('business', business)
        return res.status(409).redirect('/sites/e4d4/edit/profile?message=Business Image Deleted!')
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
        const { id, businessYears, fullName, subHeading, industry, about, workWithUs, phone, companySize, foundedDate } = req.body
        const business = await Business.findById(id)
        console.log('business', business)
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
        if (phone) {
            business.phone = phone
        }
        if (companySize) {
            business.companySize = companySize
        }
        if (foundedDate) {
            business.foundedDate = new Date(foundedDate)
        }
        await business.save()
        return res.redirect('/sites/e4d4/edit/profile?message=Business Info Updated Successfully')
    } catch (error) {
        console.log('error updating Business Profile Video: ', error.message)
        return res.status(409).redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
    }
})

router.post('/social-info', async (req, res) => {
    try {
        const { id, facebook, instagram, twitter, linkedin, behance, pinterest, dribbble, linktree } = req.body
        console.log('id: ', id, 'facebook: ', facebook, 'instagram: ', instagram, 'twitter: ', twitter, 'linkedin: ', linkedin, 'behance: ', behance, 'pinterest: ', pinterest, 'dribbble: ', dribbble, 'linktree: ', linktree)
        console.log('body', req.body)
        const business = await Business.findById(id)
        // const formData = {}
        if (!business) {
            return res.json({
                success: false,
                error: 'Business Not Found'
            })
        }
        const socialLinks = business.socialLinks?.length > 0 ? business.socialLinks : []
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
        business.socialLinks = socialLinks;
        console.log('business', business)
        await business.save()
        // return res.redirect('/sites/e4d4/edit/profile?message=User Info Updated')
        return res.redirect('/sites/e4d4/edit/profile?message=Social Links Updated Successfully')
    } catch (error) {
        console.log(error.message);
        // return res.status(500).json({ message: error.message });
        return res.redirect('/sites/e4d4/edit/profile?error=Something Went Wrong')
    }
});

module.exports = router