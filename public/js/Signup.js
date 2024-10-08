'use strict';
import { showAlert } from './Alert.js';

// DOM Elements --------------------------------------------------------------

const form = document.querySelector('.form__signup');

// Functions --------------------------------------------------------------

const signup = async (username, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/user/signup', // Relative URL
            data: {
                username,
                email,
                password,
                passwordConfirm,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Check your inbox to finish registration');
            window.setTimeout(() => {
                location.assign('/user/login');
            }, 1500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

// Event Listeners --------------------------------------------------------------

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
    const passwordConfirm = document.querySelector('#passwordConfirm').value.trim();
    signup(username, email, password, passwordConfirm);
});