'use strict';
import { showAlert } from './Alert.js';

// DOM Elements --------------------------------
const in_username = document.querySelector('#username');
const in_email = document.querySelector('#email');
const in_password = document.querySelector('#password');
const in_newPassword = document.querySelector('#newPassword');
const in_photo = document.querySelector('#photoInput');

const form = document.querySelector('.form');
const savebtn = document.querySelector('#save');
const logoutbtn = document.querySelector('#logout');

// Functions --------------------------------

function updateUser(e) {
	e.preventDefault();

	const username = in_username?.value;
	const email = in_email?.value;
	const password = in_password?.value;
	const newPassword = in_newPassword?.value;
	const image = in_photo?.files[0];

	// Create a FormData object to handle the file upload
	const formData = new FormData();

	// Append form fields to FormData
	if (username) formData.append('username', username);
	if (email) formData.append('email', email);
	if (password) formData.append('password', password);
	if (newPassword) formData.append('newPassword', newPassword);
	if (image) formData.append('photo', image); // Append the file with the correct key 'photo'

	// Make the request using Axios
	axios({
		method: 'PATCH',
		url: '/user/me',
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data', // Set the appropriate headers
		},
	})
		.then((res) => {
			if (res.data.status === 'success') {
				showAlert('success', 'User updated successfully');
				window.setTimeout(() => {
					location.assign('/user/me');
				}, 500);
			}
		})
		.catch((err) => {
			showAlert('error', err.message);
		});
}

function logout(e) {
	e.preventDefault();
	axios({
		method: 'GET',
		url: '/user/logout',
	})
		.then((res) => {
			if (res.data.status === 'success') {
				showAlert('success', 'Logged out successfully');
				window.setTimeout(() => {
					location.assign('/user/login');
				}, 500);
			}
		})
		.catch((err) => {
			showAlert(`error', 'Error, ${err.message}`);
		});
}

// Event Listeners --------------------------------
savebtn?.addEventListener('click', updateUser);
logoutbtn?.addEventListener('click', logout);
