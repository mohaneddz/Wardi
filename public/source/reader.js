'use strict';

const sidesbtn = document.querySelector('.toggle');
const lsidebar = document.querySelector('.Lsidebar');
const rsidebar = document.querySelector('.Rsidebar');
const layout = document.querySelector('main');
const quranReader = document.querySelector('.quran');
const hadithReader = document.querySelector('.hadith');
const tafsirReader = document.querySelector('.tafsir');

sidesbtn.addEventListener('click', function () {
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
});
