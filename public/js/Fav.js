'use strict';

import { showAlert } from "./Alert";

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

		showAlert('success', 'Bookmark added successfully');
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
		const bookmark = { verse, chapter, page, section, book, hadith, name, slug , metadata_name};
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
