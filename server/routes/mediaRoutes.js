// Import necessary modules
import express from 'express';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import Media from '../model/mediaModel.js'; // Ensure this path is correct

const mediaRouter = express.Router();

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Route for file upload
mediaRouter.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir; // Set the upload directory
    form.keepExtensions = true; // Keep the original file extensions

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ message: 'Error parsing the files', error: err.message });
        }

        const { title } = fields; // Get title from the form fields
        const file = files.file; // Assuming the input field has the name "file"

        if (!file) {
            return res.status(400).json({ message: 'File not uploaded.' });
        }

        // Move the file to the uploads directory and rename it
        const newFilePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
        fs.renameSync(file.filepath, newFilePath);

        try {
            // Image URL after upload
            const newMedia = new Media({
                title,
                url: newFilePath // Store the file path
            });
            
            await newMedia.save();
            res.status(201).json(newMedia);
        } catch (error) {
            console.error('Error uploading image:', error.message);
            res.status(500).json({ message: 'Image upload error', error: error.message });
        }
    });
});

// Route for fetching media files
mediaRouter.get('/get', async (req, res) => {
    let { search } = req.query;

    // Ensure search is a string, if not, default to an empty string
    if (typeof search !== 'string') {
        search = '';
    }

    try {
        const mediaList = await Media.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        });

        if (mediaList.length === 0) {
            return res.status(404).json({ message: 'No images found' });
        }

        res.status(200).json(mediaList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching media files', error });
    }
});

export default mediaRouter;
