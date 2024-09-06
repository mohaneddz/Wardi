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

// temporary using this to store the favorite verses
const favoriteVerses = new Set();

// Functions ---------------------------------------------------

// Highlighter Function -------------------------
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
	document.querySelectorAll('.hadith__start').forEach((section) => {
		section.classList.remove('selected');
	});

	event.target.classList.add('selectedEntry');

	const hadithNumber = event.target.getAttribute('data-hadith');
	const bookName = event.target.getAttribute('data-book');

	const sectionElement = document.querySelector(
		`.hadith__title[data-hadith='${hadithNumber}'][data-book='${bookName}']`
	);
	const sectionUnder = document.querySelector(`.hadith__start[data-hadith-under='${hadithNumber}']`);

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
	console.log(verseElement, verseNumber, chapter);

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

// ----------------------------------------------

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

// Bookmark Functions -----------------------------------------------------------
async function addBookmarkToServer(type, object) {
	try {
		const response = await axios.post('/user/bookmarks', {
			type,
			object,
		});

		if (response.status !== 200) {
			throw new Error('Failed to add bookmark');
		}

		console.log('Bookmark added:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error adding bookmark:', error);
	}
}

async function removeBookmarkFromServer(type, object) {
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

		console.log('Bookmark removed:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error removing bookmark:', error);
	}
}

async function favControl(event) {
	if (event.target.classList.contains('heart')) {
		event.preventDefault();
		console.log('Clicked on heart icon');
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

		// All Bookmarks
		const bookmark = { verse, chapter, page, section, book, hadith };
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

// Event Listeners -------------------------
sidesbtn.addEventListener('click', toggleSides);
lsearch.addEventListener('input', searchSurah);
rsearch.addEventListener('input', searchAya);
// document.addEventListener('DOMContentLoaded', favCreate);
document.querySelector('.Rsidebar ul').addEventListener('click', favControl);
document.querySelector('.Lsidebar ul').addEventListener('click', favControl);
document.querySelector('.Rsidebar ul').addEventListener('click', highlighter);
