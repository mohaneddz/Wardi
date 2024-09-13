'use strict';
import { showAlert } from './Alert.js';

// DOM elements --------------------------------------------------------------

const searchbtn = document.getElementById('searchButton');
const searchInput = document.getElementById('searchField');
const loading = document.querySelector('.spinner-box');

// options -------------------------

const quranSubOptions = document.querySelector('.options__sub--quran');
const quranCheckbox = document.querySelector('input[name="quran"]');

const hadithSubOptions = document.querySelector('.options__sub--hadith');
const hadithCollectionSubOptions = document.querySelector('.options__sub--hadith--collection');

const tafsirSubOptions = document.querySelector('.options__sub--tafsir');
const tafsirCollectionSubOptions = document.querySelector('.options__sub--tafsir--collection');

let selectedValues = getAllSelectedRadioValues();

const arab_tafsirs = document.querySelectorAll('label[language="ara"]');
const english_tafsirs = document.querySelectorAll('label[language="eng"]');

// results -------------------------

const resultsContainer = document.querySelector('.results__item');
const results = document.querySelector('.results');

// Function -----------------------------------------------------------------

function search() {
	const { searchType, quran_language, hadith_language, tafsir_language, hadith_collection, tafsir_collection } =
		selectedValues;
	const query = searchInput.value;

	if (!query) return;
	let url = '';
	let book = '';

	switch (searchType) {
		case 'Quran': {
			url = `/search/quran`;
			book = quran_language
			break;
		}
		case 'Hadith': {
			url = `/search/hadith`;
			book =
				hadith_language === 'ara'
					? hadith_language + '-' + hadith_collection + '1'
					: hadith_language + '-' + hadith_collection;
			break;
		}
		case 'Tafsir': {
			url = `/search/tafsir`;
			book =
				tafsir_language === 'ara'
					? tafsir_language + '-' + tafsir_collection + '1'
					: tafsir_language + '-' + tafsir_collection;
			break;
		}
	}
	loading.classList.remove('invisible');
	resultsContainer.innerHTML = '<div class="results__item--counter">Searching In Progress..</div>';
	// axios post request to search
	axios.post(url, {
		query,
		book,
	})
		.then((res) => {
			switch (searchType) {
				case 'Quran':
					displayQuranResults(res.data.data, res.data.results, query, book);
					break;
				case 'Hadith':
					displayHadithResults(res.data.data, res.data.results, query);
					break;
				case 'Tafsir':
					displayTafsirResults(res.data.data, res.data.results, book, query);
			}
			loading.classList.add('invisible');
		})
		.catch((err) => {
			loading.classList.add('invisible');
			showAlert('error', err.message);
			resultsContainer.innerHTML =
				'<div class="results__item--counter">Please Try Again with different parameters</div>';
		});
}

function getAllSelectedRadioValues() {
	const optionsContainer = document.querySelector('.options');
	const selectedRadios = optionsContainer.querySelectorAll('input[type="radio"]:checked');
	const selectedValues = {};

	selectedRadios.forEach((radio) => {
		selectedValues[radio.name] = radio.value;
	});

	return selectedValues;
}

function toggleOptions(type) {
	switch (type) {
		case 'Quran': {
			quranSubOptions.classList.remove('invisible');
			hadithSubOptions.classList.add('invisible');
			tafsirSubOptions.classList.add('invisible');
			hadithCollectionSubOptions.classList.add('invisible');
			tafsirCollectionSubOptions.classList.add('invisible');
			break;
		}
		case 'Hadith': {
			hadithSubOptions.classList.remove('invisible');
			hadithCollectionSubOptions.classList.remove('invisible');
			quranSubOptions.classList.add('invisible');
			tafsirSubOptions.classList.add('invisible');
			tafsirCollectionSubOptions.classList.add('invisible');
			break;
		}
		case 'Tafsir': {
			tafsirSubOptions.classList.remove('invisible');
			tafsirCollectionSubOptions.classList.remove('invisible');
			quranSubOptions.classList.add('invisible');
			hadithSubOptions.classList.add('invisible');
			hadithCollectionSubOptions.classList.add('invisible');
			if (selectedValues.tafsir_language === 'ara') {
				arab_tafsirs.forEach((tafsir) => tafsir.classList.remove('invisible'));
				english_tafsirs.forEach((tafsir) => tafsir.classList.add('invisible'));
			} else {
				english_tafsirs.forEach((tafsir) => tafsir.classList.remove('invisible'));
				arab_tafsirs.forEach((tafsir) => tafsir.classList.add('invisible'));
			}
			break;
		}
	}
}

function Init() {
	resultsContainer.innerHTML = '<div class="results__item--counter">Search for something</div>';
	selectedValues = getAllSelectedRadioValues();
	toggleOptions(selectedValues.searchType);
	loading.classList.add('invisible');
}

// Display results ---------------

const displayQuranResults = (surahs, number, query, book) => {
	// Clear previous results if any
	if (number > 1)
		resultsContainer.innerHTML = `<div class="results__item--counter"> ${number} Results Found</div>`;
	else if (number === 1) resultsContainer.innerHTML = `<div class="results__item--counter"> 1 Result Found</div>`;
	else resultsContainer.innerHTML = `<div class="results__item--counter--error"> No Results Found</div>`;

	// Check if surahs is an array and iterate if valid
	if (Array.isArray(surahs) && surahs.length > 0) {
		surahs.forEach((surah) => {
			// Check if verses exist and is an array
			if (Array.isArray(surah.verses) && surah.verses.length > 0) {
				surah.verses.forEach((verse) => {
					// Create a container for each verse
					const verseContainer = document.createElement('div');
					verseContainer.classList.add('results__item--quran');

					const hadithLink = document.createElement('a');
					hadithLink.href = `/quran/book/${book === 'ara' ? 'hafs' : 'mustafakhattaba'}/chapter/${surah.chapter}`;

					// Display surah details
					const surahInfo = document.createElement('div');
					surahInfo.classList.add('results__item--quran--ayah');
					surahInfo.textContent = `Chapter ${surah.chapter || ''} - Ayah ${verse.verse || ''} : ${surah.name || ''}`;
					verseContainer.appendChild(surahInfo);

					// Display verse text with query highlighted
					const verseTextContainer = document.createElement('div');
					verseTextContainer.classList.add('results__item--quran--text');
					const highlightedText = verse.text.replace(
						new RegExp(query, 'gi'),
						(match) => `<span class="match">${match}</span>`
					);
					verseTextContainer.innerHTML = highlightedText;
					verseContainer.appendChild(verseTextContainer);

					// Append the individual verse container to the results
					verseContainer.appendChild(hadithLink);
					resultsContainer.appendChild(verseContainer);
				});
			} else {
				// console.warn(`No verses found for surah: ${surah.name || ''}`);
			}
		});
	} else {
		// console.warn('No surahs found or surahs is not an array.');
	}
};

const displayHadithResults = (hadiths, number, query) => {
	// // Clear previous results if any
	if (number > 1)
		resultsContainer.innerHTML = `<div class="results__item--counter"> ${number} Results Found</div>`;
	else if (number === 1) resultsContainer.innerHTML = `<div class="results__item--counter"> 1 Result Found</div>`;
	else resultsContainer.innerHTML = `<div class="results__item--counter--error"> No Results Found</div>`;

	// Check if hadiths is an array and iterate if valid
	if (Array.isArray(hadiths.hadiths) && hadiths.hadiths.length > 0) {
		hadiths.hadiths.forEach((hadith) => {
			// Check if hadiths exist and is an array
			// Create a container for each hadith
			const hadithContainer = document.createElement('div');
			hadithContainer.classList.add('results__item--hadith');

			const hadithLink = document.createElement('a');
			hadithLink.href = `/hadith/book/${hadiths.name.endsWith('1') ? hadiths.name.slice(0, -1) : hadiths.name}/hadith/${hadith.hadithnumber}`;

			// Display hadith details
			const hadithInfo = document.createElement('div');
			hadithInfo.classList.add('results__item--hadith--collection');
			hadithInfo.textContent = `Hadith Number #${hadith.hadithnumber || ''}`;
			hadithContainer.appendChild(hadithInfo);

			// Display hadith text
			const hadithTextContainer = document.createElement('div');
			hadithTextContainer.classList.add('results__item--hadith--text');
			hadithTextContainer.textContent = hadith.text || '';
			const highlightedText = hadith.text.replace(
				new RegExp(query, 'gi'),
				(match) => `<span class="match">${match}</span>`
			);
			hadithTextContainer.innerHTML = highlightedText;
			hadithContainer.appendChild(hadithTextContainer);

			// Append the individual hadith container to the results
			hadithContainer.appendChild(hadithLink);
			resultsContainer.appendChild(hadithContainer);
		});
	} else {
		// console.warn('No hadiths found or hadiths is not an array.');
	}
};

const displayTafsirResults = (tafsirs, number, book, query) => {
	// Clear previous results if any
	if (number > 1)
		resultsContainer.innerHTML = `<div class="results__item--counter"> ${number} Results Found</div>`;
	else if (number === 1) resultsContainer.innerHTML = `<div class="results__item--counter"> 1 Result Found</div>`;
	else resultsContainer.innerHTML = `<div class="results__item--counter--error"> No Results Found</div>`;

	// Check if tafsirs is an array and iterate if valid
	if (Array.isArray(tafsirs) && tafsirs.length > 0) {
		tafsirs.forEach((surah) => {
			// Check if the surah object has necessary data
			surah.ayahs.forEach((ayah) => {
				// Create a container for each surah
				const surahContainer = document.createElement('div');
				surahContainer.classList.add('results__item--tafsir');

				const tafsirLink = document.createElement('a');
				tafsirLink.href = `/tafsir/book/${book}/chapter/${ayah.surah}`;

				// Display tafsir details
				const tafsirInfo = document.createElement('div');
				tafsirInfo.classList.add('results__item--tafsir--ayah');
				tafsirInfo.textContent = `Chapter ${ayah.surah} - Ayah ${ayah.ayah}`;
				surahContainer.appendChild(tafsirInfo);

				// Display tafsir text
				const tafsirTextContainer = document.createElement('div');
				tafsirTextContainer.classList.add('results__item--tafsir--text');
				const highlightedText = ayah.text.replace(
					new RegExp(query, 'gi'),
					(match) => `<span class="match">${match}</span>`
				);
				tafsirTextContainer.textContent = highlightedText;
				surahContainer.appendChild(tafsirTextContainer);

				// Append the link and the tafsir container to the results
				surahContainer.appendChild(tafsirLink);
				resultsContainer.appendChild(surahContainer);
				// console.warn(`Missing tafsir data for surah: ${tafsir.surah}, ayah: ${tafsir.ayah}`);
			});
		});
	} else {
		// console.warn('No tafsirs found or tafsirs is not an array.');
	}
};

// Event listeners -----------------------------------------------------------

document?.querySelector('.options').addEventListener('change', () => {
	selectedValues = getAllSelectedRadioValues();
	toggleOptions(selectedValues.searchType);
});

searchbtn?.addEventListener('click', (e) => {
	e.preventDefault();
	search();
});

// Init ---------------------------------------------------------------------

Init();