'use strict';

import {favControl} from './Fav.js';
const books = document.querySelector('.books');

// Delegate event listener to parent element

books.addEventListener('click', (e) => {
	if (e.target.classList.contains('heart')) {
		e.preventDefault();
		favControl(e);
	}
});