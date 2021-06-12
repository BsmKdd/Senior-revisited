const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		subject: {
			type: String,
			required: true,
			trim: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		userType: {
			type: String,
			enum: ["Admin", "Bartender", "Coach", "Member", "Guest"],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{
		timestamps: {
			updatedAt: false,
		},
	}
);

messageSchema.virtual("user_", {
	ref: "User",
	localField: "user",
	foreignField: "_id",
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
