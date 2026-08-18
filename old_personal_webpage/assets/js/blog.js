// Blog page functionality
let blogData = [];
let currentFilter = 'all';

// Load blog data
async function loadBlog() {
    try {
        const response = await fetch('data/blog.json');
        blogData = await response.json();
        renderBlogPosts();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('blogPosts').innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary);">Error loading blog posts. Please check the data file.</p>';
    }
}

// Render blog posts based on current filter
function renderBlogPosts() {
    const blogPosts = document.getElementById('blogPosts');
    if (!blogPosts) return;

    const filteredPosts = currentFilter === 'all' 
        ? blogData 
        : blogData.filter(post => post.category === currentFilter);

    if (filteredPosts.length === 0) {
        blogPosts.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No blog posts found in this category.</p>';
        return;
    }

    blogPosts.innerHTML = filteredPosts.map(post => `
        <div class="blog-card">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-image">` : ''}
            <h3 class="blog-title">${post.title}</h3>
            <div class="blog-meta">
                <span>${formatDate(post.date)}</span>
                ${post.readingTime ? `<span>${post.readingTime} min read</span>` : ''}
            </div>
            <p class="blog-excerpt">${post.excerpt}</p>
            ${post.tags ? `
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <a href="${post.url || '#'}" class="blog-link" ${post.url ? 'target="_blank" rel="noopener noreferrer"' : ''}>Read More</a>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
            // Re-render blog posts
            renderBlogPosts();
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBlog();
    initFilters();
});

