// Show/hide loader
function showLoader() {
    const loader = document.querySelector('.loader-overlay');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

function hideLoader() {
    const loader = document.querySelector('.loader-overlay');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// Component loader utility
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Navigation slide functionality
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav && navLinks) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }
}


// JSON data loader utility
async function loadJSON(dataPath) {
    try {
        const response = await fetch(dataPath);
        if (!response.ok) throw new Error(`Failed to load ${dataPath}`);
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

// Render featured content
async function renderFeatured() {
    const data = await loadJSON('/data/featured.json');
    if (!data) return;

    const container = document.querySelector('.grid');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <a href="${item.url}" class="card featured-card" target="_blank">
            <img src="${item.thumbnail}" alt="${item.title}" class="thumbnail" loading="lazy">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </a>
    `).join('');
}

// Render announcements
async function renderAnnouncements() {
    const data = await loadJSON('/data/announcements.json');
    if (!data) return;

    const container = document.querySelector('.announcements-container');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="card announcement-card">
            <div class="announcement-date">${item.date}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${item.link}" class="announcement-link">${item.linkText} <i class="fa-solid fa-arrow-right"></i></a>
        </div>
    `).join('');
}

// Render roadmap
async function renderRoadmap() {
    const data = await loadJSON('/data/roadmap.json');
    if (!data) return;

    const container = document.querySelector('.roadmap-timeline');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="milestone milestone-${item.position}">
            <div class="card milestone-card">
                <div class="milestone-number">${item.number}</div>
                <h3>${item.title}</h3>
                <div class="milestone-date">${item.date}</div>
                <p>${item.description}</p>
            </div>
            <div class="milestone-dot"></div>
        </div>
    `).join('');
}

// Render resources
async function renderResources() {
    const data = await loadJSON('/data/resources.json');
    if (!data) return;

    const tbody = document.querySelector('.resources-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.notes}</td>
            <td><a href="${item.link}" target="_blank">Visit <i class="fa-solid fa-arrow-up-right-from-square"></i></a></td>
        </tr>
    `).join('');
}

// Render FAQs
async function renderFaqs() {
    const data = await loadJSON('/data/faq.json');
    if (!data) return;

    const container = document.querySelector('.faq-container');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="card faq-card">
            <h3>${item.question}</h3>
            <p>${item.answer}</p>
        </div>
    `).join('');
}

// Render Features
async function renderFeatures() {
    const data = await loadJSON('/data/features.json');
    if (!data) return;

    const container = document.querySelector('.features-grid');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="card feature-card">
            <img src="${item.thumbnail}" alt="${item.gameTitle}" class="feature-thumbnail" loading="lazy">
            <div class="feature-content">
                <h3>${item.gameTitle}</h3>
                <p class="feature-developer">by ${item.developer}</p>
                <p class="feature-category">${item.category}</p>
                <p class="feature-description">${item.description}</p>
                <div class="feature-links">
                    ${item.playLink ? `<a href="${item.playLink}" class="btn" target="_blank">Play Now</a>` : ''}
                    ${item.downloadLink ? `<a href="${item.downloadLink}" class="btn secondary" target="_blank">Download</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Render Categories
async function renderCategories() {
    const data = await loadJSON('/data/categories.json');
    if (!data) return;

    const container = document.querySelector('.categories-grid');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="card category-card">
            <div class="category-icon">
                <i class="fa-solid ${item.icon}"></i>
            </div>
            <h3>${item.categoryName}</h3>
            <p>${item.description}</p>
        </div>
    `).join('');
}

// Main initialization
document.addEventListener('DOMContentLoaded', async function() {
    try {
        showLoader();

        // Initialize navigation
        navSlide();

        // Load non-essential components
        await loadComponent('footer-container', '/components/footer.html');

        // Render dynamic content based on page
        if (document.querySelector('.grid')) {
            await renderFeatured();
        }
        if (document.querySelector('.announcements-container')) {
            await renderAnnouncements();
        }
        if (document.querySelector('.roadmap-timeline')) {
            await renderRoadmap();
        }
        if (document.querySelector('.resources-tbody')) {
            await renderResources();
        }
        if (document.querySelector('.faq-container')) {
            await renderFaqs();
        }
        if (document.querySelector('.features-grid')) {
            await renderFeatures();
        }
        if (document.querySelector('.categories-grid')) {
            await renderCategories();
        }
    } catch (error) {
        console.error('Error loading page:', error);
    } finally {
        // Hide loader after everything is loaded
        hideLoader();
    }
});