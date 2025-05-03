const { Logo } = require('../../src/models');
const path = require('path');
const fs = require('fs').promises;

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.admin) {
        next();
    } else {
        req.flash('error', 'Please login to access admin panel');
        res.redirect('/admin/login');
    }
};

exports.getLogoPage = [isAuthenticated, async (req, res) => {
    try {
        const logo = await Logo.findOne().sort({ updatedAt: -1 });
        res.render('admin/logo', { 
            title: 'Logo Management',
            logo,
            admin: req.session.admin,
            path: '/admin/logo',
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error in getLogoPage:', error);
        req.flash('error', 'Error loading logo page');
        res.redirect('/admin/dashboard');
    }
}];

exports.updateLogo = [isAuthenticated, async (req, res) => {
    try {
        if (!req.file) {
            req.flash('error', 'Please select a logo file');
            return res.redirect('/admin/logo');
        }

        // Get the upload directory path
        const uploadDir = path.join(__dirname, '../../public/uploads/logo');
        
        // Ensure upload directory exists
        await fs.mkdir(uploadDir, { recursive: true });

        // Get the old logo if it exists
        const oldLogo = await Logo.findOne().sort({ updatedAt: -1 });
        
        // If old logo exists, delete the file
        if (oldLogo) {
            const oldLogoPath = path.join(__dirname, '../../public', oldLogo.logoUrl);
            try {
                await fs.unlink(oldLogoPath);
            } catch (error) {
                console.error('Error deleting old logo:', error);
            }
            await Logo.deleteOne({ _id: oldLogo._id });
        }

        // Save the new logo file
        const logoUrl = `/uploads/logo/${req.file.filename}`;
        
        // Create new logo record
        await Logo.create({ logoUrl });

        req.flash('success', 'Logo updated successfully');
        res.redirect('/admin/logo');
    } catch (error) {
        console.error('Error in updateLogo:', error);
        req.flash('error', 'Error updating logo');
        res.redirect('/admin/logo');
    }
}]; 