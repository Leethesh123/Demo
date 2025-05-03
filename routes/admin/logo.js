const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for logo upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads/logo';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'logo' + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});

// Get logo management page
router.get('/', async (req, res) => {
    try {
        const Logo = req.models.Logo;
        const logo = await Logo.findOne();
        res.render('admin/logo/index', {
            title: 'Logo Management',
            logo: logo
        });
    } catch (error) {
        console.error('Error fetching logo:', error);
        res.status(500).send('Error fetching logo');
    }
});

// Update logo
router.post('/update', upload.single('logo'), async (req, res) => {
    try {
        const Logo = req.models.Logo;
        let logo = await Logo.findOne();

        if (!logo) {
            logo = new Logo();
        }

        if (req.file) {
            // Delete old logo file if it exists
            if (logo.logoUrl) {
                const oldPath = path.join('public', logo.logoUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            logo.logoUrl = '/uploads/logo/' + req.file.filename;
        }

        await logo.save();
        req.flash('success', 'Logo updated successfully');
        res.redirect('/admin/logo');
    } catch (error) {
        console.error('Error updating logo:', error);
        req.flash('error', 'Error updating logo');
        res.redirect('/admin/logo');
    }
});

module.exports = router; 