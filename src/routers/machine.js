const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const Machine = require("../models/machine");
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");

const router = new express.Router();

router.post("/machines", auth, permit(""), async (req, res) => {
	const machine = new Machine(req.body);
	try {
		await machine.save();

		res.status(201).send(machine);
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
});

router.get("/machines", auth, async (req, res) => {
	try {
		machines = await Machine.find({}).limit();

		res.send(machines);
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

router.get("/machineMoves/:id", auth, async (req, res) => {
	try {
		const machine = await Machine.findById(req.params.id);
		await machine.populate("machineMove").execPopulate();

		machine.machineMove.forEach((move) => {
			move.moveImage2 = undefined;
			move.moveGif = undefined;
		});

		res.send(machine.machineMove);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.delete("/machines/:id", auth, permit("Admin"), async (req, res) => {
	try {
		machine = await Machine.findOneAndDelete({ _id: req.params.id });

		if (!machine) {
			return res.status(404).send();
		}

		res.send(machine);
	} catch (e) {
		res.status(500).send(e);
	}
});

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
	"/machines/:id/machineImage",
	auth,
	permit(),
	upload.single("machineImage"),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
		const machine = await Machine.findById(req.params.id);
		machine.machineImage = buffer;
		await machine.save();
		res.send("Image uploaded");
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.delete(
	"/machines/:id/machineImage",
	auth,
	permit(),
	async (req, res) => {
		const machine = await Machine.findById(req.params.id);
		machine.machineImage = undefined;
		await machine.save();
		res.send();
	}
);

router.patch("/machines/:id", auth, permit(""), async (req, res) => {
	const updates = Object.keys(req.body);

	try {
		const machine = await Machine.findOne({ _id: req.params.id });

		if (!machine) {
			return res.status(404).send();
		}

		updates.forEach((update) => (machine[update] = req.body[update]));
		await machine.save();

		res.send(machine);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get("/machines/:id/machineImage", async (req, res) => {
	try {
		const machine = await Machine.findById(req.params.id);

		if (!machine || !machine.machineImage) {
			throw new Error();
		}

		res.set("Content-Type", "image/png");
		res.send(machine.machineImage);
	} catch (e) {
		res.status(404).send();
	}
});

module.exports = router;
