# Personal Webpage

A professional personal webpage for showcasing profile, projects, experience, publications, and blog posts to potential employers.

## Design Philosophy
- Creative but professional (not too academic, not too informal)
- Dynamic and easy to update with new projects/info
- Clean, modern, and engaging

## Navigation Structure

All pages include a navigation bar at the top right with links to: About, Projects, Experience, Publications, Blog

## Pages

### 1. About/Home (`index.html`)
- Hero section with name, role, and tagline
- Professional headshot
- Intro paragraph
- Education
- Technical skills (inline, after tagline)
- Work experience highlights
- Project highlights
- Research highlights
- Contact icons (Email, GitHub, LinkedIn, Google Scholar)

### 2. Projects (`projects.html`)
- Horizontal layout (one entry per line)
- Project details with features, technologies, and links
- Filterable by category

### 3. Experience (`experience.html`)
- Work experience timeline
- Education timeline
- Research experience timeline
- Teaching experience (if applicable)
- Certifications (if applicable)

### 4. Publications (`publications.html`)
- Citation-style format
- Organized by category (Journal Articles, Conference Proceedings, Workshop Papers)
- Links to PDFs, arXiv, DOI

### 5. Blog (`blog.html`)
- Blog posts with categories and tags

## File Structure

```
Personal_Pages/
├── index.html
├── projects.html
├── experience.html
├── publications.html
├── blog.html
├── data/
│   ├── config.json        # Site-wide settings and skills
│   ├── experience.json    # Work/education/research history
│   ├── projects.json      # Project data
│   ├── publications.json  # Publications data
│   └── blog.json          # Blog posts data
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js           # Home page content loading
│   │   ├── navigation.js     # Navigation bar functionality
│   │   ├── projects.js       # Projects page content loading
│   │   ├── publications.js   # Publications page content loading
│   │   └── blog.js           # Blog page content loading
│   ├── images/
│   │   └── headshot.jpg      # Profile image
│   └── fonts/
└── README.md
```

## Data Files

All content is stored in JSON files in the `data/` directory for easy updates:

- **`config.json`**: Personal info, intro text, skills, contact links
- **`experience.json`**: Work experience, education, research, teaching, certifications
- **`projects.json`**: Project details (title, description, features, technologies, links)
- **`publications.json`**: Publication citations with links
- **`blog.json`**: Blog post data

## Key Features

- Dynamic content loading from JSON files
- Responsive design (mobile-friendly)
- Consistent styling across all pages
- Easy to maintain and update
- Fast loading times

## Notes

- No comment sections
- Focus on professional presentation
- Modern, clean design
- SEO-friendly structure

## TODO

- Add coursework projects to projects.json
- Organize projects in temporal order: most recent being the top. Then order by project name
- Update blog page