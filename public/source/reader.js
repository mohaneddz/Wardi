'use strict';

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

// // Functions -------------------------
function highlighter(event) {
	// Check if the clicked element is a sidebar entry
	if (event.target && event.target.matches('.RsideEntry')) {
		event.preventDefault();

		// remove highlight from any previously highlighted sidebar entry
		document.querySelectorAll('.RsideEntry').forEach((entry) => {
			entry.classList.remove('selectedEntry');
		});
		event.target.classList.toggle('selectedEntry');
		// Remove highlight from any previously highlighted verse
		document.querySelectorAll('.quran__verse span').forEach((span) => {
			span.classList.remove('selected'); // Reset highlight
		});

		// Get the verse number from the clicked link's id
		const verseNumber = event.target.id;

		// Find the verse element in the Quran reader
		const verseElement = document.getElementById(`verse-${verseNumber}`);

		if (verseElement) {
			// Scroll the Quran reader to the verse within the .quran container
			const readerContainer = document.querySelector('.quran');
			const versePosition = verseElement.offsetTop;
			readerContainer.scrollTo({
				top: versePosition - readerContainer.offsetTop,
				behavior: 'smooth',
			});

			// Highlight the verse by adding the 'selected' class
			verseElement.classList.add('selected');
		}
	}
}

function toggleSides() {
	lsidebar.classList.toggle('active');
	rsidebar.classList.toggle('active');
	sidesbtn.classList.toggle('on');
	layout.classList.toggle('active');

	quranReader && quranReader.classList.toggle('active');
	hadithReader && quranReader.classList.toggle('active');
	tafsirReader && quranReader.classList.toggle('active');

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
			surah.style.display = 'flex';
		} else {
			surah.style.display = 'none';
		}
	});
}

function searchAyah() {
	const searchValue = rsearch.value;
	const ayat = document.querySelectorAll('.RsideEntry');

	ayat.forEach((aya) => {
		const ayaNum = aya.textContent.toLowerCase();
		if (ayaNum.includes(searchValue.toLowerCase())) {
			aya.style.display = 'flex';
		} else {
			aya.style.display = 'none';
		}
	});
}

function favControl(event) {
	if (event.target.classList.contains('heart')) {
		console.log('Clicked on heart icon');
		const heart = event.target;
		const verseId = heart.getAttribute('data-finder');
		if (favoriteVerses.has(verseId)) {
			favoriteVerses.delete(verseId);
			heart.classList.remove('fi-sr-heart', 'favorite', 'heart');
			heart.classList.add('fi-rs-heart', 'heart');
		} else {
			favoriteVerses.add(verseId);

			heart.classList.remove('fi-rs-heart', 'favorite', 'heart');
			heart.classList.add('fi-sr-heart', 'favorite', 'heart');
		}
		console.log('Favorite Verses:', Array.from(favoriteVerses));
	}
}

// Event Listeners -------------------------
sidesbtn.addEventListener('click', toggleSides);
lsearch.addEventListener('input', searchSurah);
rsearch.addEventListener('input', searchAyah);
// document.addEventListener('DOMContentLoaded', favCreate);
document.querySelector('.Rsidebar ul').addEventListener('click', favControl);
document.querySelector('.Rsidebar ul').addEventListener('click', highlighter);
