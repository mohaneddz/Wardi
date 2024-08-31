import Chapter from './../models/quranChaptersModel.js';
import Page from './../models/quranPageModel.js';
import Juz from './../models/quranJuzModel.js';
import Info from './../models/quranInfoModel.js';

import catchAsync from './../utils/catchAsync';
import * as factory from './handlerFactory';
import AppError from './../utils/appError';

// Getters --------------------------------------------
exports.getChapter = factory.getOne(Chapter);
exports.getPage = factory.getOne(Page);
exports.getJuz = factory.getOne(Juz);
exports.getInfo = factory.getOne(Info);

// Get all
exports.getAllChapters = factory.getAll(Chapter);
exports.getAllPages = factory.getAll(Page);
exports.getAllJuzs = factory.getAll(Juz);
exports.getAllInfos = factory.getAll(Info);

// |.....|---------------------------------------------