import mongoose from "mongoose";

const url = "mongodb://localhost:27017/amazonCrawler";

export const connect = (
	url = options.dbUrl,
	opts = { useFindAndModify: false }
) => {
	return mongoose.connect(url, { ...opts, useNewUrlParser: true });
};
