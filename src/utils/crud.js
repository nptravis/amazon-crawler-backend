export const getOne = model => async (req, res) => {
	try {
		const doc = await model
			.findOne({ _id: req.params.id })
			.lean()
			.exec();

		if (!doc) {
			return res.status(400).send({ error: "Could not find this resource." });
		}
		res.status(200).json({ data: doc });
	} catch (err) {
		console.error(err);
		res.status(400).send({ error: err.toString() });
	}
};

export const getMany = model => async (req, res) => {
	try {
		const docs = await model
			.find(req.query)
			.lean()
			.exec();

		if (!docs) {
			return res.status(400).send({ error: "Could not find these resources." });
		}

		res.status(200).json({ data: docs });
	} catch (err) {
		console.error(err);
		res.status(400).send({ error: err.toString() });
	}
};

export const createOne = model => async (req, res) => {
	try {
		const doc = await model.create({
			...req.body
		});

		if (!doc) {
			return res.status(400).send({ error: "Could not create this resource." });
		}

		res.status(201).json({ data: doc });
	} catch (err) {
		console.error(err);
		res.status(400).send({ error: err.toString() });
	}
};

export const updateOne = model => async (req, res) => {
	try {
		const updatedDoc = await model
			.findOneAndUpdate(
				{
					_id: req.params.id
				},
				{ ...req.body },
				{ new: true }
			)
			.lean()
			.exec();

		if (!updatedDoc) {
			return res.status(400).send({ error: "Could not update this resource." });
		}

		res.status(200).json({ data: updatedDoc });
	} catch (err) {
		console.error(err);
		res.status(400).send({ error: err.toString() });
	}
};

export const removeOne = model => async (req, res) => {
	try {
		const removed = await model.findOneAndRemove({
			_id: req.params.id
		});

		if (!removed) {
			return res.status(400).send({ error: "Could not remove this resource." });
		}

		return res.status(200).json({ data: removed });
	} catch (err) {
		console.error(err);
		res.status(400).send({ error: err.toString() });
	}
};

export const crudControllers = model => ({
	removeOne: removeOne(model),
	updateOne: updateOne(model),
	getMany: getMany(model),
	getOne: getOne(model),
	createOne: createOne(model)
});
