document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.floating-image');
  
    // Function to apply scroll-based bounce
    const applyScrollEffect = () => {
      images.forEach((image) => {
        const rect = image.getBoundingClientRect();
        const windowHeight = window.innerHeight;
  
        // Check if the image is visible in the viewport
        if (rect.top >= 0 && rect.bottom <= windowHeight) {
          const scrollAmount = window.scrollY / 10; // Adjust the divisor for sensitivity
          image.style.transform = `translateY(${scrollAmount}px)`;
        }
      });
    };
  
    // Listen to scroll events
    window?.addEventListener('scroll', applyScrollEffect);
  });
  