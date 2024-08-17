const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './views/assets/uploads';
        const fullPath = path.resolve(dir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "" + Date.now() + '.' + file.originalname.split('.')[1]);
    }
});

const fileFilter = (req, file, cb) => {
    // only image files
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/image", upload.single("image"), (req, res, next) => {
    try {
        const image = req.file;
        if (!image) {
            const error = new Error("Please upload an image");
            error.httpStatusCode = 400;
            return next(error);
        }
        const imageUrl = `/assets/uploads/${image.filename}`
        // const imageUrl = `http://localhost:8080/uploads/${image.filename}`
        res.status(200).json({ url: imageUrl, file: image });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
});

module.exports = router