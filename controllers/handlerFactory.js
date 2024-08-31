import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';
import APIFeatures from './../utils/apiFeatures';

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true, // return the new updated document
			runValidators: true,
		});

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
	});

// TODO : Implement the advanced getAll Query -----

// exports.getAll = (Model) =>
// 	catchAsync(async (req, res, next) => {
// 		// To allow for nested GET reviews on tour (hack)
// 		let filter = {};
// 		if (req.params.tourId) filter = { tour: req.params.tourId };

// 		const features = new APIFeatures(Model.find(filter), req.query)
// 			.filter()
// 			.sort()
// 			.limitFields()
// 			.paginate();
// 		// const doc = await features.query.explain();
// 		const doc = await features.query;

// 		// SEND RESPONSE
// 		res.status(200).json({
// 			status: 'success',
// 			results: doc.length,
// 			data: {
// 				data: doc,
// 			},
// 		});
// 	});

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {

		const chapters = await Model.find();
		
    res.status(200).json({
			status: 'success',
			results: chapters.length,
			data: {
				chapters,
			},
		});
	});
