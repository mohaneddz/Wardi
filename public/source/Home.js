'use strict';

const menubtn = document.querySelector('.header__menu a i');
const menu = document.querySelector('.Menusidebar');

menubtn.addEventListener('click', (e) => {
	
	e.preventDefault(); // Prevent the default anchor behavior
    const parent = menubtn.parentElement;

    menu.classList.toggle('open');
	menubtn.classList.toggle('active');

    if (parent.classList.contains('active')) {
        parent.classList.remove('active');
        menubtn.className = 'fi fi-rr-menu-burger';
    } else {
        parent.classList.add('active');
        menubtn.className = 'fi fi-rr-cross';
    }
});
