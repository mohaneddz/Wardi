'use strict';
import { showAlert } from './Alert.js'; 

// DOM Elements --------------------------------------------------------------

const form = document.querySelector('.form__login');

// Functions --------------------------------------------------------------

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/user/login`, // TODO: Change this to /user/login
            data: {
                email,
                password,
            }, 
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err);
    }
};


// Event Listeners --------------------------------------------------------------

form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});