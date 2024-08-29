'use strict';

const menubtn = document.querySelector('.header__menu');
const menu = document.querySelector('.Menusidebar');

menubtn.addEventListener('click', () => {
	
    console.log('clicked');
    
    menu.classList.toggle('open');
	menubtn.classList.toggle('active');

	if (menubtn.classList.contains('active')) {
		menubtn.innerHTML = '<i class="fi fi-rr-cross"></i>';
	} else {
		menubtn.innerHTML = '<i class="fi fi-rr-menu-burger"></i>';
	}
});
