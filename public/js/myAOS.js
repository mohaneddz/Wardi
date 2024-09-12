'use strict';

// Define Intersection Observer options
const options = {
    root: null,
    rootMargin: '300px',
    threshold: 0.1,
};

// Initialize Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        // Check if the element is intersecting with the viewport at the threshold
        if (entry.isIntersecting) {
            // Add 'animate' class to trigger animations
            entry.target.classList.add('animate');
            // Stop observing the current target once it's animated
            observer.unobserve(entry.target);
        }
    });
}, options);

// Select all elements with the class 'hidden'
const hiddenElements = document.querySelectorAll('.hidden');

// Observe each hidden element
hiddenElements.forEach((element) => observer.observe(element));
