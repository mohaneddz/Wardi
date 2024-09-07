'use strict';

import { favControl } from './Reader.js';
const hearts = document.querySelectorAll('.heart');

hearts.forEach((heart) => {
	heart.addEventListener('click', (e) => {
		e.preventDefault();
		favControl(e);
	});
});
