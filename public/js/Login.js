import { showAlert } from '../js/Alert.js'; 

// DOM Elements --------------------------------------------------------------

const form = document.querySelector('.form--login');

// Functions --------------------------------------------------------------

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/user/login',
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

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};

// Event Listeners --------------------------------------------------------------

form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});