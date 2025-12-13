// Main JavaScript for loading data and populating pages
let siteData = {};

// Helper function to format affiliation and date consistently
function formatAffiliationDate(affiliation, date) {
    if (!date) return affiliation;
    return `${affiliation} • <span style="color: var(--text-secondary);">${date}</span>`;
}

// Load configuration and data
async function loadSiteData() {
    try {
        const cacheBuster = `?v=${Date.now()}`;
        const [config, experience, projects] = await Promise.all([
            fetch(`data/config.json${cacheBuster}`).then(r => r.json()),
            fetch(`data/experience.json${cacheBuster}`).then(r => r.json()),
            fetch(`data/projects.json${cacheBuster}`).then(r => r.json())
        ]);

        siteData = { config, experience, projects };
        
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            populateHomePage();
        }
        
        if (window.location.pathname.includes('experience.html')) {
            populateExperiencePage();
        }
    } catch (error) {
        console.error('Error loading site data:', error);
    }
}

// Populate home page
function populateHomePage() {
    const { config, experience } = siteData;

    // Update intro text
    const introText = document.getElementById('introText');
    if (introText && config.intro) {
        introText.textContent = config.intro;
    }

    // Populate education
    const educationContainer = document.getElementById('educationContainer');
    if (educationContainer && experience.education) {
        educationContainer.innerHTML = experience.education.map(edu => `
            <div class="education-item">
                <h3 class="education-title">${edu.degree}</h3>
                <p class="education-institution">${formatAffiliationDate(edu.institution, edu.duration)}</p>
                ${edu.gpa ? `<p class="education-gpa">GPA: ${edu.gpa}</p>` : ''}
            </div>
        `).join('');
    }

    // Populate skills
    const skillsContainer = document.getElementById('skillsContainer');
    if (skillsContainer && config.skills?.categories) {
        skillsContainer.innerHTML = config.skills.categories.map(category => {
            const skillNames = Array.isArray(category.skills) 
                ? category.skills.map(skill => typeof skill === 'string' ? skill : skill.name)
                : [];
            return `<div class="skills-inline-category">
                <span class="skills-inline-label">${category.name}:</span>
                ${skillNames.join(', ')}
            </div>`;
        }).join('');
    }

    // Populate contact icons
    const contactIcons = document.getElementById('contactIcons');
    if (contactIcons && config.contact) {
        const iconMap = {
            'email': 'fas fa-envelope',
            'github': 'fab fa-github',
            'linkedin': 'fab fa-linkedin',
            'google scholar': 'fas fa-graduation-cap'
        };
        contactIcons.innerHTML = config.contact.map(contact => {
            const nameLower = contact.name.toLowerCase();
            const iconClass = iconMap[nameLower] || 'fas fa-link';
            return `<a href="${contact.url}" class="contact-icon" target="_blank" rel="noopener noreferrer" aria-label="${contact.name}">
                <i class="${iconClass}"></i>
            </a>`;
        }).join('');
    }

    // Populate work experience highlights
    const workExperienceHighlight = document.getElementById('workExperienceHighlight');
    if (workExperienceHighlight && experience.work) {
        workExperienceHighlight.innerHTML = experience.work.slice(0, 2).map(work => `
            <div class="highlight-item">
                <h3 class="highlight-title">${work.title}</h3>
                <p class="highlight-company">${formatAffiliationDate(work.company, work.duration)}</p>
                <p class="highlight-description">${work.description}</p>
            </div>
        `).join('');
    }

    // Populate projects highlights
    const projectsHighlight = document.getElementById('projectsHighlight');
    if (projectsHighlight && siteData.projects) {
        projectsHighlight.innerHTML = siteData.projects.slice(0, 2).map(project => {
            const affiliation = project.supervisor ? `Supervised by ${project.supervisor}` : project.category;
            return `
            <div class="highlight-item">
                <h3 class="highlight-title">${project.title}</h3>
                <p class="highlight-meta">${formatAffiliationDate(affiliation, project.date)}</p>
                <p class="highlight-description">${project.description}</p>
                ${project.technologies ? `
                    <div class="highlight-tech">
                        ${project.technologies.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        }).join('');
    }

    // Populate research highlights (SAGE and CITADEL)
    const researchHighlight = document.getElementById('researchHighlight');
    if (researchHighlight && siteData.projects) {
        const sageCitadelProjects = siteData.projects.filter(project => 
            project.title.includes('SAGE') || project.title.includes('CITADEL')
        );
        researchHighlight.innerHTML = sageCitadelProjects.map(project => {
            const affiliation = project.supervisor ? `Supervised by ${project.supervisor}` : project.category;
            return `
            <div class="highlight-item">
                <h3 class="highlight-title">${project.title}</h3>
                <p class="highlight-meta">${formatAffiliationDate(affiliation, project.date)}</p>
                <p class="highlight-description">${project.description}</p>
                ${project.technologies ? `
                    <div class="highlight-tech">
                        ${project.technologies.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        }).join('');
    }

    // Update hero section
    if (config.name) {
        const heroName = document.querySelector('.hero-name');
        if (heroName) heroName.textContent = config.name;
        document.title = `About | ${config.name}`;
    }
    if (config.role) {
        const heroRole = document.querySelector('.hero-role');
        if (heroRole) heroRole.textContent = config.role;
    }
    if (config.tagline) {
        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline) heroTagline.textContent = config.tagline;
    }
}

// Populate experience page
function populateExperiencePage() {
    const { experience } = siteData;

    // Populate work experience
    const workExperience = document.getElementById('workExperience');
    if (workExperience && experience.work) {
        workExperience.innerHTML = experience.work.map(work => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h3 class="timeline-title">${work.title}</h3>
                    <p class="timeline-company">${formatAffiliationDate(work.company, work.duration)}</p>
                    <div class="timeline-description">
                        ${work.description ? `<p>${work.description}</p>` : ''}
                        ${work.responsibilities ? `
                            <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                                ${work.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                    ${work.technologies ? `
                        <div class="timeline-tech">
                            ${work.technologies.map(tech => `<span class="timeline-tech-tag">${tech}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Populate education
    const education = document.getElementById('education');
    if (education && experience.education) {
        education.innerHTML = experience.education.map(edu => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h3 class="timeline-title">${edu.degree}</h3>
                    <p class="timeline-company">${formatAffiliationDate(edu.institution, edu.duration)}</p>
                    ${edu.gpa ? `<p style="color: var(--text-primary);">GPA: ${edu.gpa}</p>` : ''}
                    ${edu.coursework ? `
                        <div style="margin-top: 1rem;">
                            <strong>Relevant Coursework:</strong>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                                ${edu.coursework.map(course => `<span class="timeline-tech-tag">${course}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Populate research experience
    if (experience.research?.length > 0) {
        const researchSection = document.getElementById('researchSection');
        const researchExperience = document.getElementById('researchExperience');
        if (researchSection) researchSection.style.display = 'block';
        if (researchExperience) {
            researchExperience.innerHTML = experience.research.map(research => `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3 class="timeline-title">${research.title}</h3>
                        <p class="timeline-company">${formatAffiliationDate(research.institution, research.duration)}</p>
                        <div class="timeline-description">
                            ${research.description ? `<p>${research.description}</p>` : ''}
                            ${research.projects?.length > 0 ? `
                                <ul style="margin-top: 1rem; padding-left: 1.5rem; list-style-type: disc;">
                                    ${research.projects.map(project => `
                                        <li style="margin-bottom: 0.5rem;">${typeof project === 'string' ? project : project.name}</li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                            ${research.projectsLink ? `
                                <p style="margin-top: 1rem;">
                                    <a href="${research.projectsLink}" style="color: var(--accent-color); text-decoration: none; font-weight: 500;">
                                        View all research projects →
                                    </a>
                                </p>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Populate teaching experience
    if (experience.teaching?.length > 0) {
        const teachingSection = document.getElementById('teachingSection');
        const teachingExperience = document.getElementById('teachingExperience');
        if (teachingSection) teachingSection.style.display = 'block';
        if (teachingExperience) {
            const affiliation = teaching => `${teaching.course} - ${teaching.institution}`;
            teachingExperience.innerHTML = experience.teaching.map(teaching => `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3 class="timeline-title">${teaching.role}</h3>
                        <p class="timeline-company">${formatAffiliationDate(affiliation(teaching), teaching.duration)}</p>
                        <div class="timeline-description">
                            ${teaching.description ? `<p>${teaching.description}</p>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Populate certifications
    if (experience.certifications?.length > 0) {
        const certificationsSection = document.getElementById('certificationsSection');
        const certifications = document.getElementById('certifications');
        if (certificationsSection) certificationsSection.style.display = 'block';
        if (certifications) {
            certifications.innerHTML = experience.certifications.map(cert => `
                <div class="certification-item">
                    <h3 class="timeline-title">${cert.name}</h3>
                    <p class="timeline-company">${formatAffiliationDate(cert.issuer, cert.date)}</p>
                    ${cert.credentialId ? `<p style="color: var(--text-secondary); font-size: 0.9rem;">Credential ID: ${cert.credentialId}</p>` : ''}
                </div>
            `).join('');
        }
    }
}

// Initialize on page load
loadSiteData();
