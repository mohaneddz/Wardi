'use strict';
import { showAlert } from './Alert.js'; 

// DOM Elements --------------------------------------------------------------

const Loginform = document.querySelector('.form__login');

// Functions --------------------------------------------------------------

export const reset = async (password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/user/resetPassword`, 
            data: {
                password,
            }, 
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Password Changed Successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.message);
    }
};


// Event Listeners --------------------------------------------------------------

Loginform?.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    if(password !== passwordConfirm) {
        showAlert('error', 'Passwords do not match!');
        return;
    }
    reset(password);
});