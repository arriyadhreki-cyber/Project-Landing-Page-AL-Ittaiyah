/**
 * Yayasan Pendidikan Islam Al Mukhlisin
 * External JavaScript for index.html
 * File: src/js/main.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainMenu = document.getElementById('mainMenu');

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mainMenu.classList.toggle('is-open');
    });

    // Menutup menu jika klik di luar area menu
    document.addEventListener('click', (e) => {
      if (!mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mainMenu.classList.remove('is-open');
      }
    });
  }

  // Smooth scroll untuk link jangkar (in-page anchor)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          if (mainMenu) {
            mainMenu.classList.remove('is-open');
          }
        }
      }
    });
  });
});
