import User from '../../models/userModel.js';

import catchAsync from '../../utils/catchAsync.js';
import * as factory from '../handlerFactory.js';
import AppError from '../../utils/appError.js';

// // Getters -------------------------------------------- [ Factory Functions  | If turn it into an API ]

// // export const getUser = factory.getOne(User);
// // export const getAllUsers = factory.getAll(User);
// // export const createUser = factory.createOne(User);
// // export const updateUser = factory.updateOne(User);
// // export const deleteUser = factory.deleteOne(User);

// // |.....|---------------------------------------------

export const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};