import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		numberOfReviews: {
			type: Number,
			required: true
		},
		averageRating: {
			type: Number,
			required: true
		},
		dateFirstListed: {
			type: Date,
			required: true
		}
	},
	{ timestamps: true }
);

export const Product = mongoose.model("product", productSchema);

// title, price, # reviews, avg. rating, date first listed on Amazon.
