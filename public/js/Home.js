'use strict';
import {favControl} from './Fav.js';

const cards = document.querySelector('.cards');

cards.addEventListener('click', (e) => {
	if (e.target.classList.contains('heart')) {
		favControl(e);
	}
});
