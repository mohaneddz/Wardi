'use strict';
import { showAlert } from './Alert.js'; 

// DOM Elements --------------------------------------------------------------

const Loginform = document.querySelector('.form__login');
const forgotPasswordForm = document.getElementById('forgotten');

// Functions --------------------------------------------------------------

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/user/login`, 
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

export const forgottenPassword = async (email) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/user/forgotPassword`, 
            data: {
                email,
            }, 
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Email sent successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}


// Event Listeners --------------------------------------------------------------

Loginform?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

forgotPasswordForm?.addEventListener('click', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (!email)
        showAlert('error', 'Please provide an email address!');
    else
        forgottenPassword(email);
});