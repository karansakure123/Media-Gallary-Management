import express from 'express';
import multer from 'multer';
import path from 'path';
import Image from '../model/uploadmodel.js';

const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// Initialize multer without file type validation
const upload = multer({
  storage: storage,
  // No fileFilter function to allow any file type
});

// POST API for uploading images
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    console.log(req.file); // Check the uploaded file
    const image = new Image({
      name: req.file.originalname, // Store the original file name
      path: req.file.path, // Store the file path
    });
    await image.save(); // Save the image document to the database
    res.status(201).json({ message: 'Image uploaded successfully', image }); // Send success response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error response
  }
});

// GET API for fetching all images
router.get('/get', async (req, res) => {
  try {
    const images = await Image.find(); // Fetch all images from the database
    res.status(200).json(images); // Send the list of images as a response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error response
  }
});

export default router;
