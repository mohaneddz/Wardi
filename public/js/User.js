'use strict';

// DOM Elements --------------------------------
const in_username = document.querySelector('#username');
const in_email = document.querySelector('#email');
const in_password = document.querySelector('#password');
const in_passwordConfirm = document.querySelector('#passwordConfirm');
const in_image = document.querySelector('#image');

const form = document.querySelector('.form');
const savebtn = document.querySelector('#save');
const logoutbtn = document.querySelector('#logout');

// Functions --------------------------------

function updateUser(e) {
	e.preventDefault();

	const username = in_username?.value;
	const email = in_email?.value;
	const password = in_password?.value;
	const passwordConfirm = in_passwordConfirm?.value;
	const image = in_image?.files[0];

	// using axios
	axios({
		method: 'PATCH',
		url: '/user/me',
		data: {
			username,
			email,
			password,
			passwordConfirm,
			image,
		},
	})
		.then((res) => {
			if (res.data.status === 'success') {
				alert('User updated successfully');
				location.assign('/user/me');
			}
		})
		.catch((err) => {
			alert('Error updating user');
			console.log(err);
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
				alert('Logged out successfully');
				location.assign('/user/login');
			}
		})
		.catch((err) => {
			alert('Error logging out');
			console.log(err);
		});
}

// Event Listeners --------------------------------
savebtn?.addEventListener('click', updateUser);
logoutbtn?.addEventListener('click', logout);
