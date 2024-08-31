import Chapter from '../../models/Content/Quran/quranChaptersModel.js';
import Page from '../../models/Content/Quran/quranPagesModel.js';
import Juz from '../../models/Content/Quran/quranJuzsModel.js';
import Info from '../../models/Content/Quran/quranInfoModel.js';

import catchAsync from '../../utils/catchAsync.js';
import * as factory from '../handlerFactory.js';
import AppError from '../../utils/appError.js';

// Getters --------------------------------------------
export const getInfo = factory.getOne(Info);

export const getChapter = factory.getOne(Chapter);
export const getPage = factory.getOne(Page);
export const getJuz = factory.getOne(Juz);

// Get all
export const getAllChapters = factory.getAll(Chapter);
export const getAllPages = factory.getAll(Page);
export const getAllJuzs = factory.getAll(Juz);
export const getAllInfos = factory.getAll(Info);

// |.....|---------------------------------------------
