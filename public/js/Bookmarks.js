'use strict';
import { showAlert } from './Alert.js';

const trash = document.querySelector('.DeleteAll');
const popup = document.querySelector('.Popup');
const popupContent = document.querySelector('.Popup__Content');
const Yes = document.getElementById('Yes');
const No = document.getElementById('No');

function DeleteAll(event) {

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
			showAlert('success', 'All bookmarks removed successfully');
			window.setTimeout(() => {
				location.reload();
			}, 1500);
		})
		.catch((error) => {
			showAlert('error', error.response.data.message);
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
