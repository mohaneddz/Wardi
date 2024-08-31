import Chapter from '../models/Quran/quranChaptersModel.js';
import Page from './../models/quranPageModel.js';
import Juz from './../models/quranJuzModel.js';
import Info from '../models/Quran/quranInfoModel.js';

import catchAsync from './../utils/catchAsync';
import * as factory from './handlerFactory';
import AppError from './../utils/appError';

// Getters --------------------------------------------
export const getChapter = factory.getOne(Chapter);
export const getPage = factory.getOne(Page);
export const getJuz = factory.getOne(Juz);
export const getInfo = factory.getOne(Info);

// Get all
// exports.getAllChapters = factory.getAll(Chapter);
export const getAllPages = factory.getAll(Page);
export const getAllJuzs = factory.getAll(Juz);
export const getAllInfos = factory.getAll(Info);

// |.....|---------------------------------------------

