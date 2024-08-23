// Toggle Mobile Menu
function toggleMenu() {
    document.querySelector('.header nav').classList.toggle('active');
}

// Theme Switcher Logic
const themeSwitcher = document.getElementById('theme-switcher');
const savedTheme = localStorage.getItem('theme');

if (savedTheme) document.body.classList.add(savedTheme);

themeSwitcher.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark-theme' : '');
    updateThemeIcon();
});

function updateThemeIcon() {
    themeSwitcher.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
}

// Section Toggle
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    localStorage.setItem('activeSection', sectionId);
}

// Load Active Section from Storage
showSection(localStorage.getItem('activeSection') || 'section2');

// Handling iframe loading
const iframe = document.getElementById('products-list');
const loadingOverlay = document.getElementById('loading-overlay');

iframe.addEventListener('load', () => {
    setTimeout(() => loadingOverlay.classList.add('hidden'), 6000); // Hide overlay after 3 seconds
});

// Initialize the theme icon
updateThemeIcon();