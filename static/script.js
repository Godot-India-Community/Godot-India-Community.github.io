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
    const data = await loadJSON('data/featured.json');
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
    const data = await loadJSON('data/announcements.json');
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
    const data = await loadJSON('data/roadmap.json');
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
    const data = await loadJSON('data/resources.json');
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

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', async function() {
    try {
        showLoader();

        // Load components
        await loadComponent('nav-container', 'components/nav.html');
        await loadComponent('footer-container', 'components/footer.html');

        // Mobile navigation toggle (must be after nav is loaded)
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle) {
            navToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });
        }

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
    } catch (error) {
        console.error('Error loading page:', error);
    } finally {
        // Hide loader after everything is loaded
        hideLoader();
    }
});
