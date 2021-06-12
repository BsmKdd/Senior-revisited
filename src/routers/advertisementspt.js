const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const AdvertisementsPT = require("../models/advertisementPT");
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");

const router = new express.Router();

const upload = multer({
	limits: {
		fileSize: 10000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
			cb(new Error("Allowed file types: jpg,jpeg,png."));
		}

		cb(undefined, true);
	},
});

router.post(
	"/advertisements",
	auth,
	permit(""),
	upload.fields([
		{ name: "adImage", maxCount: 1 },
		{ name: "adBanner", maxCount: 1 },
	]),
	async (req, res) => {
		const advert = new AdvertisementsPT(req.body);

		const images = req.files;

		try {
			if (images.adImage) {
				const image = images.adImage[0].buffer;
				const buffer = await sharp(image)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				advert.image = buffer;
			}

			if (images.adBanner) {
				const banner = images.adBanner[0].buffer;
				const buffer = await sharp(banner)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				advert.banner = buffer;
			}

			await advert.save();
			res.status(201).send(advert);
		} catch (e) {
			res.status(400).send({ error: e.message });
		}
	}
);

router.patch(
	"/advertisements/:id",
	auth,
	permit(""),
	upload.fields([
		{ name: "adImage", maxCount: 1 },
		{ name: "adBanner", maxCount: 1 },
	]),
	async (req, res) => {
		const updates = Object.keys(req.body);

		try {
			const images = req.files;
			const advert = await AdvertisementsPT.findById(req.params.id);

			if (!advert) {
				return res.status(404).send();
			}

			updates.forEach((update) => (advert[update] = req.body[update]));

			if (images.adImage) {
				const image = images.adImage[0].buffer;
				const buffer = await sharp(image)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				advert.image = buffer;
			}

			if (images.adBanner) {
				const banner = images.adBanner[0].buffer;
				const buffer = await sharp(banner)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				advert.banner = buffer;
			}

			await advert.save();

			res.send(advert);
		} catch (e) {
			res.status(400).send({ error: e.message });
		}
	}
);

router.get("/advertisements", auth, async (req, res) => {
	try {
		adverts = await AdvertisementsPT.find({}).limit();

		res.send(adverts);
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

router.delete("/advertisements/:id", auth, permit(""), async (req, res) => {
	try {
		advert = await AdvertisementsPT.findOneAndDelete({ _id: req.params.id });

		if (!advert) {
			return res.status(404).send();
		}

		res.send(advert);
	} catch (e) {
		res.status(500).send(e);
	}
});

module.exports = router;
