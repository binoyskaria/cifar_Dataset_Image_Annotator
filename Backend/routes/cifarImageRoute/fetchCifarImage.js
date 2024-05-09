const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cifarImages = require('../../models/cifarImages');

const fetchCifarImage = async (req, res) => {
    const annotation = req.body.annotation;
    console.log("Received annotation: ", annotation);
    if (!annotation) {
        return res.status(400).json({ error: "Annotation must be provided" });
    }

    try {
        console.log("Fetching images with annotation:", annotation);
        const images = await cifarImages.find({ annotation: new RegExp(annotation, 'i') });
        console.log("Images found:", images.length);

        if (images.length === 0) {
            return res.status(400).json({ error: "No images found with the provided annotation" });
        }

        const imageFiles = await Promise.all(images.map(async (image) => {
            const imagePath = path.join(__dirname, '../../data/cifarImages/', `${image.imageUrl}`);
            const fileData = await fs.promises.readFile(imagePath);
            return {
                image: fileData.toString('base64'),
                imageUrl: image.imageUrl,
                annotation: image.annotation,
                user: image.user
            };
        }));

        res.json({
            message: "Images fetched successfully",
            images: imageFiles
        });

    } catch (error) {
        console.error("Failed to fetch images:", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
};

module.exports = { fetchCifarImage }
