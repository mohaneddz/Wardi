'use strict';

const trash = document.querySelector('.DeleteAll');
const popup = document.querySelector('.Popup');
const popupContent = document.querySelector('.Popup__Content');
const Yes = document.getElementById('Yes');
const No = document.getElementById('No');

function DeleteAll(event) {
	console.log('Delete All');

	event.preventDefault();
	const type = 'All';
	//axios request to delete all bookmarks & pass the type in request
	axios.delete('/user/bookmarks', {
		data: {
			type,
		},
	})
		.then((response) => {
			if (response.status !== 201) {
				throw new Error('Failed to remove bookmarks');
			}
			console.log('All bookmarks removed:', response.data);
			//reload the page to show the changes
			location.reload();
		})
		.catch((error) => {
			console.error('Error removing bookmarks:', error);
		});
}

function showPopup(e) {
	popup.classList.toggle('invisible');
}

function closePopupFromOutside(e, btn) {
	if(!popupContent.contains(e.target) && !btn.contains(e.target)) {
		popup.classList.add('invisible');
	}
}

trash?.addEventListener('click', showPopup);
Yes?.addEventListener('click', DeleteAll);
No?.addEventListener('click', showPopup);
document.addEventListener('click', (e) => closePopupFromOutside(e, trash));
