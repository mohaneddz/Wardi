'use strict';
import { favControl } from './Reader.js';
const hearts = document.querySelectorAll('.heart');
const cards = document.querySelector('.cards');

cards.addEventListener('click', (e) => {
	if (e.target.classList.contains('heart')) {
		favControl(e);
	}
});
