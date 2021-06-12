const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	item: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "MenuItem",
	},
	count: Number,
});

const orderSchema = new mongoose.Schema(
	{
		memberID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Member",
		},
		bartenderID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Bartender",
		},
		status: {
			type: String,
			default: "ordered",
			enum: ["denied", "served", "unserved"],
			immutable: true,
		},
		items: {
			type: [itemSchema],
			required: true,
		},
		total: Number,
	},
	{
		timestamps: {
			updatedAt: false,
		},
	}
);

orderSchema.virtual("member", {
	ref: "Member",
	localField: "memberID",
	foreignField: "_id",
});

orderSchema.virtual("bartender", {
	ref: "Bartender",
	localField: "bartenderID",
	foreignField: "_id",
});

itemSchema.virtual("menuItem", {
	ref: "MenuItem",
	localField: "orderItem",
	foreignField: "_id",
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
