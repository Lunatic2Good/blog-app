require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//instance of cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg','jpeg','png'],
    params: {
        folder: 'blog-app-v1',
        transformation: [{width: 500, height: 500, crop: "limit"}],
    },
});

module.exports = storage;