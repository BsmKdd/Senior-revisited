const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const Workout = require("../../models/workout/workout");
const Move = require("../../models/move");
const { PremadeWorkout } = require("../../models/workout/workout_types");
const auth = require("../../middleware/auth");
const permit = require("../../middleware/permit");
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
	"/premadeWorkouts",
	auth,
	permit("Coach"),
	upload.single("premadeImage"),
	async (req, res) => {
		const workout = new Workout(req.body);
		workout.workoutType = "Premade";
		const premade = new PremadeWorkout({
			workoutName: req.body.workoutName,
			workout,
		});

		if (req.file) {
			const buffer = await sharp(req.file.buffer)
				.resize({ width: 250, height: 250 })
				.png()
				.toBuffer();
			premade.pic = buffer;
		}

		try {
			await workout.save();
			await premade.save();
			res.status(201).send({ workout, premade });
		} catch (e) {
			res.status(400).send(e);
		}
	}
);
router.get("/premadeWorkouts/:id", auth, async (req, res) => {
	try {
		const premade = await PremadeWorkout.findOne({ _id: req.params.id });

		if (!premade) {
			return res.status(404).send();
		}

		await premade.populate("workout_").execPopulate();
		// await order.populate('bartender').execPopulate()
		var move_ids = [];
		try {
			premade.workout_[0].moves.forEach((move) => {
				move_ids.push(move.move);
			});

			const moves = await Move.find().where("_id").in(move_ids).exec();
			console.log();
			res.send(moves);
		} catch (e) {
			console.log(e.message);
		}
		// const member = await User.findById(order.member[0].user)
		// const bartender = await User.findById(order.bartender[0].user)
		// const items = await User.findById(order.menuItem)
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});

router.get("/premadeWorkouts", auth, async (req, res) => {
	try {
		premades = await PremadeWorkout.find({}).limit();

		res.send(premades);
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

router.delete(
	"/premadeWorkouts/:id",
	auth,
	permit("Coach"),
	async (req, res) => {
		try {
			const premade = await PremadeWorkout.findOne({ _id: req.params.id });
			await PremadeWorkout.deleteOne({
				_id: premade._id,
				workout: premade.workout,
			});

			if (!premade) {
				return res.status(404).send();
			}

			res.send(premade);
		} catch (e) {
			res.status(500).send({ error: e.message });
		}
	}
);

router.patch(
	"/premadeWorkouts/:id",
	auth,
	permit("Coach"),
	async (req, res) => {
		const updates = Object.keys(req.body);

		try {
			const premade = await PremadeWorkout.findOne({ _id: req.params.id });

			if (!premade) {
				return res.status(404).send();
			}

			updates.forEach((update) => (premade[update] = req.body[update]));
			await premade.save();

			res.send(premade);
		} catch (e) {
			res.status(400).send(e);
		}
	}
);

module.exports = router;
