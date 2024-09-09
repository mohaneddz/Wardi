'use strict';

import { favControl } from './Reader.js';
const hearts = document.querySelectorAll('.heart');
const books = document.querySelector('.books');

// Delegate event listener to parent element

books.addEventListener('click', (e) => {
	if (e.target.classList.contains('heart')) {
		e.preventDefault();
		favControl(e);
	}
});