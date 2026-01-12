// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('is-active');
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (mobileMenu && !menuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
      mobileMenu.classList.remove('is-active');
    }
  });
  
  // Scroll Animation
  initScrollAnimation();
});

// Scroll Animation - Fade in elements when they come into view
function initScrollAnimation() {
  const elements = document.querySelectorAll('.js_effect');
  
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      }
    });
  }, observerOptions);
  
  elements.forEach(function(element) {
    observer.observe(element);
  });
}
