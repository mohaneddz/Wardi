'use strict';

var bookmarks = document.querySelector('.Bookmark__Sections');

function deletebookmark(event) {
	const bookmark = event.target.parentElement;
	const info1 = bookmark.dataset.info1;
	const info2 = bookmark.dataset.info2;
	const type = bookmark.dataset.type;

	// Construct the URL for the DELETE request
	const url = `/user/bookmarks/:type`;

	// Send the DELETE request to the server
	fetch(url, {
		method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ info1, info2, type }),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			if (data.success) {
				// Remove the bookmark element from the DOM
				bookmark.remove();
			} else {
				console.error('Failed to delete the bookmark:', data.message);
			}
		})
		.catch((error) => {
			console.error('There was a problem with the fetch operation:', error);
		});
}

bookmarks.addEventListener('click', (e) => {
	if (e.target.classList.contains('Delete')) deletebookmark(e);
});
