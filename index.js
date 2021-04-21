const express = require('express')
const app = express()
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const multer = require('multer')

require('dotenv').config()


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});
const port = 3000
const fileUpload = multer()

app.get('/', (req, res) => res.json({ message: 'Hello World!' }))

app.post('/upload', fileUpload.single('image'), function(req, res, next) {
	let streamUpload = (req) => {
		return new Promise((resolve, reject) => {
			let stream = cloudinary.uploader.upload_stream(
				(error, result) => {
					if (result) {
						resolve(result);
					} else {
						reject(error);
					}
				}
			);

			streamifier.createReadStream(req.file.buffer).pipe(stream);
		});
	};

	async function upload(req) {
		let result = await streamUpload(req);
		console.log(result);

		return res.status(200).json({
			message: "Uploaded successfully!",
			success: true,
			result,
		});
	}

	upload(req);
});

app.listen(port, () => console.log(`This is the beginning of the Node File Upload App`))