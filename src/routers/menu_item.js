const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const MenuItem = require("../models/menu_orders/menu_item");
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");

const router = new express.Router();

const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
			cb(new Error("Please upload an image."));
		}

		cb(undefined, true);
	},
});

router.post(
	"/menuItems",
	auth,
	permit("Bartender"),
	upload.single("itemImage"),
	async (req, res) => {
		const menuItem = new MenuItem(req.body);

		try {
			if (req.file) {
				const buffer = await sharp(req.file.buffer)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				menuItem.itemImage = buffer;
			}

			await menuItem.save();

			res.status(201).send(menuItem);
		} catch (e) {
			res.status(400).send({ error: e.message });
		}
	}
);

router.get("/menuItems", auth, async (req, res) => {
	try {
		menuItems = await MenuItem.find({}).limit();

		res.send(menuItems);
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

router.delete("/menuItems/:id", auth, permit("Bartender"), async (req, res) => {
	try {
		menuItem = await MenuItem.findOneAndDelete({ _id: req.params.id });

		if (!menuItem) {
			return res.status(404).send();
		}

		res.send(menuItem);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.patch(
	"/menuItems/:id",
	auth,
	permit(""),
	upload.single("itemImage"),
	async (req, res) => {
		const updates = Object.keys(req.body);

		try {
			const image = req.file;
			const menuItem = await MenuItem.findById(req.params.id);

			if (!menuItem) {
				return res.status(404).send();
			}

			updates.forEach((update) => (menuItem[update] = req.body[update]));

			if (req.file) {
				const buffer = await sharp(req.file.buffer)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				menuItem.itemImage = buffer;
			}

			await menuItem.save();

			res.send(menuItem);
		} catch (e) {
			res.status(400).send(e);
		}
	}
);

module.exports = router;
