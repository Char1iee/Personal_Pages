// Projects page functionality
let projectsData = [];
let currentFilter = 'all';

// Load projects data
async function loadProjects() {
    try {
        const cacheBuster = `?v=${Date.now()}`;
        const response = await fetch(`data/projects.json${cacheBuster}`);
        projectsData = await response.json();
        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projectsGrid').innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary);">Error loading projects. Please check the data file.</p>';
    }
}

// Render projects based on current filter
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const filteredProjects = currentFilter === 'all' 
        ? projectsData 
        : projectsData.filter(project => project.category === currentFilter);

    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No projects found in this category.</p>';
        return;
    }

    projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <div>
                    <h3 class="project-title">
                        ${project.link ? `<a href="${project.link}" class="project-title-link" target="_blank" rel="noopener noreferrer">${project.title}</a>` : project.title}
                    </h3>
                    <p class="project-meta">
                        ${project.supervisor ? `Supervised by ${project.supervisor}` : project.category || ''}${project.date ? ` • <span style="color: var(--text-secondary);">${project.date}</span>` : ''}
                    </p>
                </div>
                ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-image-horizontal">` : ''}
            </div>
            <p class="project-description">${project.description}</p>
            ${project.features && project.features.length > 0 ? `
                <ul class="project-features">
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            ` : ''}
            ${project.technologies ? `
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="project-tech-tag">${tech}</span>`).join('')}
                </div>
            ` : ''}
            <div class="project-links">
                ${project.github ? `<a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                ${project.demo ? `<a href="${project.demo}" class="project-link secondary" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
                ${project.caseStudy ? `<a href="${project.caseStudy}" class="project-link secondary" target="_blank" rel="noopener noreferrer">Case Study</a>` : ''}
            </div>
        </div>
    `).join('');
}

// Initialize filter buttons
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update current filter
            currentFilter = this.getAttribute('data-filter');
            // Re-render projects
            renderProjects();
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initFilters();
});

