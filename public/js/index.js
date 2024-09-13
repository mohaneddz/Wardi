'use strict';

// DOM Elements --------------------------------
const in_username = document.querySelector('#username');
const in_email = document.querySelector('#email');
const in_password = document.querySelector('#password');
const in_newPassword = document.querySelector('#newPassword');
const in_photo = document.querySelector('#photoInput');

const hiddenElements = document.querySelectorAll('.hidden');
const form = document.querySelector('.form');
const savebtn = document.querySelector('#save');
const logoutbtn = document.querySelector('#logout');

var bookmarks = document.querySelector('.Bookmark__Sections');

const Signupform = document.querySelector('.form__signup');

// search
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

// ---

const Loginform = document.querySelector('.form__login');

// Selectors -------------------------
const sidesbtn = document.querySelector('.toggle');
const lsidebar = document.querySelector('.Lsidebar');
const rsidebar = document.querySelector('.Rsidebar');
const layout = document.querySelector('main');
const quranReader = document.querySelector('.quran');
const hadithReader = document.querySelector('.hadith');
const tafsirReader = document.querySelector('.tafsir');

const lsearchbtn = document.querySelector('.LsearchButton');
const rsearchbtn = document.querySelector('.RsearchButton');
const lsearch = document.querySelector('.Lsearch');
const rsearch = document.querySelector('.Rsearch');

const RightUl = document.querySelector('.Rsidebar ul');
const LeftUl = document.querySelector('.Lsidebar ul');

const readingbtn = document.querySelector('.readingMod');
const popupContent = document.querySelector('.Popup__Content');

const popup = document.querySelector('.Popup');
// temporary using this to store the favorite verses
const favoriteVerses = new Set();

const menubtn = document.querySelector('.header__menu a i');
const menu = document.querySelector('.Menusidebar');

const Logform = document.querySelector('.form__login');
const forgotPasswordForm = document.getElementById('forgotten');

const cards = document.querySelector('.cards');

// Functions --------------------------------------------------------------

export async function removeBookmarkFromServer(type, object) {
	try {
		const response = await axios.delete('/user/bookmarks', {
			data: {
				type,
				object,
			},
		});

		if (response.status !== 201) {
			throw new Error('Failed to remove bookmark');
		}

		return response.data;
	} catch (error) {
		showAlert('error', error.response.data.message);
	}
}

export async function addBookmarkToServer(type, object) {
	try {
		const response = await axios.post('/user/bookmarks', {
			type,
			object,
		});

		if (response.status !== 200) {
			throw new Error('Failed to add bookmark');
		}

		showAlert('error', error.response.data.message);
		return response.data;
	} catch (error) {
		console.error('Error adding bookmark:', error);
	}
}

export async function favControl(event) {
	if (event.target.classList.contains('heart')) {
		event.preventDefault();
		// DOM elements
		const heart = event.target;
		const btn = heart.parentElement;

		// Attributes...
		const type = btn.getAttribute('data-type');

		const verse = btn.getAttribute('data-verse');
		const chapter = btn.getAttribute('data-chapter');
		const page = btn.getAttribute('data-page');
		const section = btn.getAttribute('data-section');

		const book = btn.getAttribute('data-book');
		const hadith = btn.getAttribute('data-hadith');
		const name = btn.getAttribute('data-name');
		const slug = btn.getAttribute('data-slug');
		// let metadata = {};
		const metadata_name = btn.getAttribute('data-metadata_name');

		// All Bookmarks
		const bookmark = { verse, chapter, page, section, book, hadith, name, slug, metadata_name };
		const filteredBookmark = Object.fromEntries(
			Object.entries(bookmark).filter(([key, value]) => value !== null && value !== undefined)
		);

		if (heart.classList.contains('fi-sr-heart')) {
			heart.classList.remove('fi-sr-heart', 'favorite');
			heart.classList.add('fi-rs-heart');
			removeBookmarkFromServer(type, filteredBookmark);
		} else {
			heart.classList.remove('fi-rs-heart');
			heart.classList.add('fi-sr-heart');
			addBookmarkToServer(type, filteredBookmark);
		}
	}
}

export const login = async (email, password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: `/user/login`,
			data: {
				email,
				password,
			},
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Logged in successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err);
	}
};

export const forgottenPassword = async (email) => {
	try {
		const res = await axios({
			method: 'POST',
			url: `/user/forgotPassword`,
			data: {
				email,
			},
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Email sent successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};

const options = {
	root: null,
	rootMargin: '300px',
	threshold: 0.1,
};

// Initialize Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		// Check if the element is intersecting with the viewport at the threshold
		if (entry.isIntersecting) {
			// Add 'animate' class to trigger animations
			entry.target.classList.add('animate');
			// Stop observing the current target once it's animated
			observer.unobserve(entry.target);
		}
	});
}, options);

// Select all elements with the class 'hidden'

function toggleMenu(e) {
	e.preventDefault(); // Prevent the default anchor behavior
	const parent = menubtn.parentElement;

	menu.classList.toggle('open');
	menubtn.classList.toggle('active');

	if (parent.classList.contains('active')) {
		parent.classList.remove('active');
		menubtn.className = 'fi fi-rr-menu-burger';
	} else {
		parent.classList.add('active');
		menubtn.className = 'fi fi-rr-cross';
	}
}

function highlighter(event) {
	if (event.target && event.target.classList.contains('nosearch')) return;

	// Step 1: Remove highlights from previously highlighted sidebar entries and verses
	document.querySelectorAll('.RsideEntry').forEach((entry) => {
		entry.classList.remove('selectedEntry');
	});

	if (!event.target || !event.target.matches('.RsideEntry')) return;
	event.preventDefault();

	// Step 2: Highlight the clicked sidebar entry
	if (event.target && event.target.classList.contains('Hadith__Section')) hadithSectionHighlighter(event);
	else if (event.target && event.target.classList.contains('quranChapterSearch')) quranHighlighter(event);
	else if (event.target && event.target.classList.contains('tafsirChapterSearch')) tafsirHighlighter(event);
}

function quranHighlighter(event) {
	document.querySelectorAll('span').forEach((span) => {
		span.classList.remove('selected'); // Reset verse highlight
	});

	event.target.classList.add('selectedEntry');

	// Step 3: Get the verse number and chapter from the clicked sidebar entry's data attributes
	const verseNumber = event.target.getAttribute('data-verse');
	const chapter = event.target.getAttribute('data-chapter');

	// Step 4: Locate the verse element in the Quran reader
	const verseElement = document.querySelector(`[data-verse='${verseNumber}'][data-chapter='${chapter}']`);

	// Check if the verse element exists
	if (verseElement) {
		// Step 5: Scroll the Quran reader to the verse within the .quran container
		const readerContainer = document.querySelector('.quran');

		// Scroll to the verse's position
		readerContainer.scrollTo({
			top: verseElement.offsetTop - readerContainer.offsetTop,
			behavior: 'smooth',
		});

		// Step 6: Highlight the verse by adding the 'selected' class
		verseElement.classList.add('selected');
	}
}

function hadithSectionHighlighter(event) {
	document.querySelectorAll('.hadith__title').forEach((section) => {
		section.classList.remove('selected');
	});
	document.querySelectorAll('.line__divider').forEach((section) => {
		section.classList.remove('selected');
	});

	event.target.classList.add('selectedEntry');

	const hadithNumber = event.target.getAttribute('data-hadith');
	const bookName = event.target.getAttribute('data-book');

	const sectionElement = document.querySelector(
		`.hadith__title[data-hadith='${hadithNumber}'][data-book='${bookName}']`
	);
	const sectionUnder = document.querySelector(`.line__divider[data-hadith-under='${hadithNumber}']`);

	if (sectionElement) {
		const readerContainer = document.querySelector('.hadith');
		sectionElement.classList.add('selected');
		readerContainer.scrollTo({
			top: sectionElement.offsetTop - readerContainer.offsetTop,
			behavior: 'smooth',
		});
		sectionUnder.classList.add('selected');
		sectionElement.classList.add('selected');
	}
}

function tafsirHighlighter(event) {
	document.querySelectorAll('span').forEach((span) => {
		span.classList.remove('selected'); // Reset verse highlight
	});

	event.target.classList.add('selectedEntry');

	// Step 3: Get the verse number and chapter from the clicked sidebar entry's data attributes
	const verseNumber = event.target.getAttribute('data-verse');
	const chapter = event.target.getAttribute('data-chapter');

	// Step 4: Locate the verse element in the Quran reader
	const verseElement = document.querySelector(`[data-verse='${verseNumber}'][data-chapter='${chapter}']`);

	// Check if the verse element exists
	if (verseElement) {
		// Step 5: Scroll the Quran reader to the verse within the .quran container
		const readerContainer = document.querySelector('.tafsir');

		// Scroll to the verse's position
		readerContainer.scrollTo({
			top: verseElement.offsetTop - readerContainer.offsetTop,
			behavior: 'smooth',
		});

		// Step 6: Highlight the verse by adding the 'selected' class
		verseElement.classList.add('selected');
	}
}

// Reading Functions ----------------------------------------------

function toggleSides() {
	lsidebar.classList.toggle('active');
	rsidebar.classList.toggle('active');
	sidesbtn.classList.toggle('on');

	layout.classList.toggle('active');

	quranReader && quranReader.classList.toggle('active');
	hadithReader && hadithReader.classList.toggle('active');
	tafsirReader && tafsirReader.classList.toggle('active');

	if (sidesbtn.classList.contains('on')) {
		sidesbtn.innerHTML = '<i class="fi fi-rr-cross"></i>';
	} else {
		sidesbtn.innerHTML = '<i class="fi fi-rr-menu-burger"></i>';
	}
}

function searchSurah() {
	const searchValue = lsearch.value;
	const surahs = document.querySelectorAll('.LsideEntry');

	surahs.forEach((surah) => {
		const surahName = surah.textContent.toLowerCase();
		if (surahName.includes(searchValue.toLowerCase())) {
			surah.parentElement.style.display = 'flex';
		} else {
			surah.parentElement.style.display = 'none';
		}
	});
}

function searchAya() {
	const searchValue = rsearch.value;
	const ayat = document.querySelectorAll('.RsideEntry');

	ayat.forEach((aya) => {
		const ayaNum = aya.textContent.toLowerCase();
		// will apply to the parent element of the aya ( li )
		if (ayaNum.includes(searchValue.toLowerCase())) {
			aya.parentElement.style.display = 'flex';
		} else {
			aya.parentElement.style.display = 'none';
		}
	});
}

export function closePopupFromOutside(e) {
	if (!popupContent.contains(e.target) && !readingbtn.contains(e.target)) {
		popup.classList.add('invisible');
	}
}

export const reset = async (password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: `/user/resetPassword`,
			data: {
				password,
			},
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Password Changed Successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.message);
	}
};

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
			book = quran_language;
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

const signup = async (username, email, password, passwordConfirm) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/user/signup', // Relative URL
			data: {
				username,
				email,
				password,
				passwordConfirm,
			},
		});
		if (res.data.status === 'success') {
			showAlert('success', 'Check your inbox to finish registration');
			window.setTimeout(() => {
				location.assign('/user/login');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};

function deletebookmark(event) {
	// Target the closest .Delete element to get the correct dataset attributes
	const bookmark = event.target.closest('.Delete');
	if (!bookmark) return; // Safety check to ensure the target is found correctly

	const info1 = bookmark.dataset.info1;
	const info2 = bookmark.dataset.info2; // Optional parameter
	const type = bookmark.dataset.type.toLowerCase();
	let url = '';
	if (type != 'quran_book' && type != 'tafsir_book' && type != 'hadith_book')
		info2
			? (url = `/user/bookmarks/${type}/${info1}/${info2}`)
			: (url = `/user/bookmarks/${type}/${info1}`);
	else url = `/user/bookmarks/${type}/${info2}`;

	axios.delete(url, {
		data: { info1, info2, type },
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (response.status !== 201) {
				throw new Error('Network response was not ok');
			}
			return response.data;
		})
		.then((data) => {
			if (data.status === 'success') {
				bookmark.parentElement.remove();
				if (bookmarks.children.length === 0) {
					// a.empty No bookmarks yet :)
					const empty = document.createElement('a');
					empty.classList.add('empty');
					empty.textContent = 'No bookmarks yet :)';
					bookmarks.appendChild(empty);
				}
			} else {
				console.error('Failed to delete the bookmark:', data.message);
			}
		})
		.catch((error) => {
			if (error.response) {
				console.error('Server responded with an error:', error.response.data);
			} else if (error.request) {
				console.error('No response received:', error.request);
			} else {
				console.error('Error in setting up the request:', error.message);
			}
		});
}

function updateUser(e) {
	e.preventDefault();

	const username = in_username?.value;
	const email = in_email?.value;
	const password = in_password?.value;
	const newPassword = in_newPassword?.value;
	const image = in_photo?.files[0];

	// Create a FormData object to handle the file upload
	const formData = new FormData();

	// Append form fields to FormData
	if (username) formData.append('username', username);
	if (email) formData.append('email', email);
	if (password) formData.append('password', password);
	if (newPassword) formData.append('newPassword', newPassword);
	if (image) formData.append('photo', image); // Append the file with the correct key 'photo'

	// Make the request using Axios
	axios({
		method: 'PATCH',
		url: '/user/me',
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data', // Set the appropriate headers
		},
	})
		.then((res) => {
			if (res.data.status === 'success') {
				showAlert('success', 'User updated successfully');
				window.setTimeout(() => {
					location.assign('/user/me');
				}, 500);
			}
		})
		.catch((err) => {
			showAlert('error', err.message);
		});
}

function logout(e) {
	e.preventDefault();
	axios({
		method: 'GET',
		url: '/user/logout',
	})
		.then((res) => {
			if (res.data.status === 'success') {
				showAlert('success', 'Logged out successfully');
				window.setTimeout(() => {
					location.assign('/user/login');
				}, 500);
			}
		})
		.catch((err) => {
			showAlert(`error', 'Error, ${err.message}`);
		});
}
export const showAlert = (type, msg, time = 7) => {
	hideAlert();
	const markup = `<div class="alert alert--${type}">${msg}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hideAlert, time * 1000);
};
// Event Listeners ----------------------------------

savebtn?.addEventListener('click', updateUser);
logoutbtn?.addEventListener('click', logout);

bookmarks?.addEventListener('click', (e) => {
	if (e.target.classList.contains('trash')) deletebookmark(e);
});
Signupform?.addEventListener('submit', (e) => {
	e.preventDefault();
	const username = document.querySelector('#username').value.trim();
	const email = document.querySelector('#email').value.trim();
	const password = document.querySelector('#password').value.trim();
	const passwordConfirm = document.querySelector('#passwordConfirm').value.trim();
	signup(username, email, password, passwordConfirm);
});
document?.querySelector('.options').addEventListener('change', () => {
	selectedValues = getAllSelectedRadioValues();
	toggleOptions(selectedValues.searchType);
});

searchbtn?.addEventListener('click', (e) => {
	e.preventDefault();
	search();
});

Loginform?.addEventListener('submit', (e) => {
	e.preventDefault();
	const password = document.getElementById('password').value;
	const passwordConfirm = document.getElementById('passwordConfirm').value;
	if (password !== passwordConfirm) {
		showAlert('error', 'Passwords do not match!');
		return;
	}
	reset(password);
});

sidesbtn?.addEventListener('click', toggleSides);
lsearch?.addEventListener('input', searchSurah);
rsearch?.addEventListener('input', searchAya);
// document?.addEventListener('DOMContentLoaded', favCreate);
RightUl?.addEventListener('click', favControl);
RightUl?.addEventListener('click', highlighter);
LeftUl?.addEventListener('click', favControl);
readingbtn?.addEventListener('click', () => {
	popup.classList.toggle('invisible');
});
document?.addEventListener('click', closePopupFromOutside);

menubtn?.addEventListener('click', toggleMenu);

hiddenElements?.forEach((element) => observer.observe(element));

Loginform?.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	login(email, password);
});

forgotPasswordForm?.addEventListener('click', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	if (!email) showAlert('error', 'Please provide an email address!');
	else forgottenPassword(email);
});
cards?.addEventListener('click', (e) => {
	if (e.target.classList.contains('heart')) {
		favControl(e);
	}
});
books?.addEventListener('click', (e) => {
	if (e.target.classList.contains('heart')) {
		e.preventDefault();
		favControl(e);
	}
});

trash?.addEventListener('click', showPopup);
Yes?.addEventListener('click', DeleteAll);
No?.addEventListener('click', showPopup);
document?.addEventListener('click', (e) => closePopupFromOutside(e, trash));
books?.addEventListener('click', (e) => {
	if (e.target.classList.contains('heart')) {
		e.preventDefault();
		favControl(e);
	}
});
document.addEventListener('DOMContentLoaded', () => {
	const images = document.querySelectorAll('.floating-image');

	// Function to apply scroll-based bounce
	const applyScrollEffect = () => {
		images.forEach((image) => {
			const rect = image.getBoundingClientRect();
			const windowHeight = window.innerHeight;

			// Check if the image is visible in the viewport
			if (rect.top >= 0 && rect.bottom <= windowHeight) {
				const scrollAmount = window.scrollY / 10; // Adjust the divisor for sensitivity
				image.style.transform = `translateY(${scrollAmount}px)`;
			}
		});
	};

	// Listen to scroll events
	window?.addEventListener('scroll', applyScrollEffect);
});

// Init ---------------------------------------------------------------------

Init();
