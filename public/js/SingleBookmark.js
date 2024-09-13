'use strict';

var bookmarks = document.querySelector('.Bookmark__Sections');

function deletebookmark(event) {
	// Target the closest .Delete element to get the correct dataset attributes
	const bookmark = event.target.closest('.Delete');
	if (!bookmark) return; // Safety check to ensure the target is found correctly

	const info1 = bookmark.dataset.info1;
	const info2 = bookmark.dataset.info2; // Optional parameter
	const type = bookmark.dataset.type.toLowerCase();
	let url = '';
	if (type != 'quran_book' && type != 'tafsir_book' && type != 'hadith_book')
		info2
			? (url = `/user/bookmarks/${type}/${info1}/${info2}`)
			: (url = `/user/bookmarks/${type}/${info1}`);
    else
        url = `/user/bookmarks/${type}/${info2}`;

	axios.delete(url, {
		data: { info1, info2, type },
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (response.status !== 201) {
				throw new Error('Network response was not ok');
			}
			return response.data;
		})
		.then((data) => {
			if (data.status === 'success') {
				bookmark.parentElement.remove();
				if (bookmarks.children.length === 0) {
					// a.empty No bookmarks yet :)
					const empty = document.createElement('a');
					empty.classList.add('empty');
					empty.textContent = 'No bookmarks yet :)';
					bookmarks.appendChild(empty);
				}
			} else {
				console.error('Failed to delete the bookmark:', data.message);
			}
		})
		.catch((error) => {
			if (error.response) {
				console.error('Server responded with an error:', error.response.data);
			} else if (error.request) {
				console.error('No response received:', error.request);
			} else {
				console.error('Error in setting up the request:', error.message);
			}
		});
}

bookmarks?.addEventListener('click', (e) => {
	if (e.target.classList.contains('trash')) deletebookmark(e);
});
