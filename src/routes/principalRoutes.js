// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const upload = require('../middleware/fileUpload');
// const Principal = require('../models/Principal');
// const path = require('path');
// const fs = require('fs');

// // Get principal info
// router.get('/', auth, (req, res) => {
//   Principal.findOne()
//     .then(principal => res.json(principal || {}))
//     .catch(err => {
//       console.error('Error getting principal:', err);
//       res.status(500).json({error: 'Error getting principal info'});
//     });
// });

// // Update principal info
// router.put('/', auth, upload.single('image'), (req, res) => {
//   const updateData = {
//     name: req.body.name,
//     title: req.body.title,
//     message: req.body.message
//   };

//   if (req.file) {
//     updateData.image = `/uploads/${req.file.filename}`;
//   }

//   Principal.findOneAndUpdate({}, updateData, {new: true, upsert: true})
//     .then(principal => res.json(principal))
//     .catch(err => {
//       console.error('Error updating principal:', err);
//       res.status(500).json({error: 'Error updating principal'});
//     });
// });

// module.exports = router;
