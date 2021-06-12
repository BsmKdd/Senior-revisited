const express = require("express");
// const multer = require('multer')
// const shapr = require('sharp')
const User = require("../models/user/user");
const {
	Admin,
	Member,
	Coach,
	Bartender,
} = require("../models/user/user_types");
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");
const router = new express.Router();

// Create new admin
router.post("/admins", async (req, res) => {
	const user = new User(req.body);
	user.userType = "Admin";
	const admin = new Admin({
		user,
	});
	try {
		await user.save();
		await admin.save();
		// Send welcome email goes here
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

// Create new member
router.post("/members", async (req, res) => {
	const user = new User(req.body);
	user.userType = "Member";
	const member = new Member({
		status: req.body.status,
		user,
	});
	try {
		await user.save();
		await member.save();
		// Send welcome email goes here
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

// Create new coach
router.post("/coaches", async (req, res) => {
	const user = new User(req.body);
	user.userType = "Coach";
	const coach = new Coach({
		salary: req.body.salary,
		expertises: req.body.expertises,
		user,
	});
	try {
		await user.save();
		await coach.save();
		// Send welcome email goes here
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token, coach });
	} catch (e) {
		res.status(400).send(e);
	}
});

// Create new bartender
router.post("/bartenders", async (req, res) => {
	const user = new User(req.body);
	user.userType = "Bartender";
	const bartender = new Bartender({
		salary: req.body.salary,
		user,
	});
	try {
		await user.save();
		await bartender.save();
		// Send welcome email goes here
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

// Login
router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send("Invalid credentials");
	}
});

router.get("/users/me", auth, async (req, res) => {
	res.send(req.user);
});

// Logout
router.post("/users/logout/", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});

		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

// Logout from all sessions
router.post("/users/logoutAll/", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();

		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

// User update
router.patch("/users/me", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		"firstName",
		"lastName",
		"email",
		"password",
		"phone",
		"address",
	];
	const isValidOperation = updates.every((update) => {
		return allowedUpdates.includes(update);
	});

	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid updates!" });
	}

	try {
		updates.forEach((update) => {
			return (req.user[update] = req.body[update]);
		});

		await req.user.save();
		res.send(req.user);
	} catch (e) {
		res.status(400).send(express);
	}
});

// User delete
router.delete("/users/me", auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});

// Admin delete [Admin]
router.delete("/users/:id", auth, permit(), async (req, res) => {
	try {
		user = await User.findOneAndDelete({ _id: req.params.id });

		if (!user) {
			return res.status(404).send();
		}

		res.send(user);
	} catch (e) {
		res.status(500).send(e);
	}
});

// Get all the users [Admin]
router.get("/users", auth, permit(), async (req, res) => {
	try {
		users = await User.find({}).limit();
		res.send(users);
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

module.exports = router;
