// Publications page functionality
let publicationsData = [];

// Category labels
const categoryLabels = {
    'journal': 'Journal Articles',
    'conference': 'Conference Proceedings',
    'workshop': 'Workshop Papers',
    'preprint': 'Preprints',
    'poster': 'Posters/Demos/Abstracts',
    'thesis': 'Thesis'
};

// Load publications data
async function loadPublications() {
    try {
        const cacheBuster = `?v=${Date.now()}`;
        const response = await fetch(`data/publications.json${cacheBuster}`);
        publicationsData = await response.json();
        console.log('Loaded publications:', publicationsData.length, 'entries');
        renderPublications();
    } catch (error) {
        console.error('Error loading publications:', error);
        document.getElementById('publicationsList').innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary);">Error loading publications. Please check the data file.</p>';
    }
}

// Format year from date
function formatYear(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear().toString();
}

// Render publications in citation format, grouped by category
function renderPublications() {
    const publicationsList = document.getElementById('publicationsList');
    if (!publicationsList) return;

    if (publicationsData.length === 0) {
        publicationsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No publications found.</p>';
        return;
    }

    // Group publications by category
    const grouped = {};
    publicationsData.forEach(pub => {
        const category = pub.category || 'other';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(pub);
    });

    // Sort categories: journal, conference, workshop, etc.
    const categoryOrder = ['journal', 'conference', 'workshop', 'preprint', 'poster', 'thesis'];
    const sortedCategories = categoryOrder.filter(cat => grouped[cat]);

    // Render each category section
    let html = '';
    sortedCategories.forEach(category => {
        const pubs = grouped[category];
        const label = categoryLabels[category] || category;
        
        html += `<section class="publication-section">
            <h2 class="publication-section-title">${label}</h2>`;
        
        pubs.forEach(pub => {
            const year = formatYear(pub.date);
            const statusText = pub.status ? ` (${pub.status})` : '';
            const links = [];
            
            if (pub.pdf) links.push(`<a href="${pub.pdf}" class="publication-link" target="_blank" rel="noopener noreferrer">PDF</a>`);
            if (pub.arxiv) links.push(`<a href="${pub.arxiv}" class="publication-link" target="_blank" rel="noopener noreferrer">PDF</a>`);
            if (pub.doi) links.push(`<a href="https://doi.org/${pub.doi}" class="publication-link" target="_blank" rel="noopener noreferrer">PDF</a>`);
            
            const linksHtml = links.length > 0 ? ` ${links.join(' ')}` : '';
            
            // Bold the author name (Zhengli Shang) and the title
            const boldName = pub.authors.replace(/Zhengli Shang/g, '<strong>Zhengli Shang</strong>');
            const boldTitle = `<strong>${pub.title}</strong>`;
            
            html += `
            <p class="publication-citation">
                ${boldName}. ${boldTitle}. ${pub.venue}. ${year}.${statusText}${linksHtml}
            </p>`;
        });
        
        html += `</section>`;
    });

    publicationsList.innerHTML = html;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPublications();
});
