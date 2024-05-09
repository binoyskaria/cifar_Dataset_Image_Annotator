const cifarImages = require('../../models/cifarImages');
const multer = require('multer');
const crypto = require('crypto');
const Jimp = require('jimp');


const storage = multer.memoryStorage(); // Switch to memoryStorage to process the image before saving

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // 10 MB limit
}).single("image");

const resizeAndStoreImage = async (imagePath, imageBuffer) => {
    const image = await Jimp.read(imageBuffer);
    image.cover(800, 600) // Resize and crop as needed to fit 800x600
        .quality(60) // Set image quality
        .writeAsync(imagePath); // Save the image
};

const storeCifarImage = async (req, res) => {
    try {
        await upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                console.error("Multer Error:", err);
                return res.status(500).json({ error: "Image Upload Failed due to upload error" });
            } else if (err) {
                console.error("Unknown Error:", err);
                return res.status(500).json({ error: "Image Upload Failed due to unknown error" });
            }
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const filename = `image-${Date.now()}-${crypto.randomBytes(8).toString('hex')}.jpg`;
            const imagePath = `./data/cifarImages/${filename}`;

            await resizeAndStoreImage(imagePath, req.file.buffer);

            const { annotation, user } = req.body;
            const newCifarImage = new cifarImages({
                imageUrl: filename,
                annotation,
                user,
            });

            const savedCifarImage = await newCifarImage.save();
            res.json({
                message: "Image upload successful",
                imageUrl: savedCifarImage.imageUrl,
                annotation: savedCifarImage.annotation,
                user: savedCifarImage.user,
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Image Upload Failed due to server error" });
    }
};

module.exports = { storeCifarImage };
