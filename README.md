# Frontend Development Tasks

A showcase of modern, responsive frontend web applications built with semantic HTML5, modern CSS3 (Grid & Flexbox), vanilla JavaScript, Tailwind CSS, and Bootstrap 5. Deployed live via GitHub Pages.

---

## 🚀 Live Demos

| Project | Description | Live Demo | Source Code |
| :--- | :--- | :--- | :--- |
| **01. Responsive Card Layout** | Clean, accessible project showcase card grid built with CSS Grid, Flexbox, and mobile-first responsive breakpoints. | [🌐 View Live](https://sowndharyapl15.github.io/frontend-task/responsive-card-layout/) | [📂 Explore](./responsive-card-layout/) |
| **02. Static Profile Page** | Personal developer portfolio and profile page featuring dynamic scroll reveals, active nav tracking, and modern design. | [🌐 View Live](https://sowndharyapl15.github.io/frontend-task/static-profile-page/) | [📂 Explore](./static-profile-page/) |
| **03. DOM Campus Lost & Found** | Interactive campus lost & found reporting portal with live search, category filtering, status updates, and localStorage persistence. | [🌐 View Live](https://sowndharyapl15.github.io/frontend-task/dom-campus-lost-found/) | [📂 Explore](./dom-campus-lost-found/) |
| **04. Cosmic Window (Async JS)** | Real-time space exploration portal querying NASA's Astronomy Picture of the Day API with date traveling, loading/error states, and offline fallback. | [🌐 View Live](https://sowndharyapl15.github.io/frontend-task/Async%20JS-cosmic-window/) | [📂 Explore](./Async%20JS-cosmic-window/) |
| **05. Tailwind Nova Studio Landing** | Minimalist, high-conversion creative studio landing page built with pure Tailwind CSS utility classes and custom theme tokens. | [🌐 View Live](https://sowndharyapl15.github.io/frontend-task/Tailwind-nova-landing/) | [📂 Explore](./Tailwind-nova-landing/) |
| **06. Bootstrap Nova Studio Landing** | Modern agency landing page leveraging native Bootstrap 5.3 components, responsive grid, modal inquiry form, and utility-driven styling. | [🌐 View Live](https://sowndharyapl15.github.io/frontend-task/Bootstrap-nova-landing/) | [📂 Explore](./Bootstrap-nova-landing/) |

---

## 📁 Repository Structure

```text
frontend-task/
├── Async JS-cosmic-window/
│   ├── index.html          # Space explorer UI, date travel bar & NASA card
│   ├── style.css           # Cosmic dark mode, glassmorphism & typography
│   └── script.js           # Async API fetching, error handling & states
├── Bootstrap-nova-landing/
│   └── index.html          # Native Bootstrap 5 studio landing page & modal
├── Tailwind-nova-landing/
│   └── index.html          # Pure Tailwind CSS studio landing page & theme config
├── dom-campus-lost-found/
│   ├── index.html          # Semantic HTML markup for lost & found portal
│   ├── style.css           # Modern styling, typography & responsive layout
│   └── script.js           # Dynamic DOM manipulation, filtering & storage
├── responsive-card-layout/
│   ├── index.html          # Semantic HTML markup for project cards
│   └── style.css           # CSS Grid, Flexbox & responsive styling
├── static-profile-page/
│   ├── index.html          # Developer profile structure and content
│   ├── style.css           # Premium styling, typography & layout
│   ├── script.js           # Scroll animations & nav tracking
│   └── photo.png           # Profile image asset
└── README.md               # Project documentation & live links
```

---

## 🛠️ Project Overviews

### 1. [Responsive Card Layout](./responsive-card-layout/)
- **Live URL**: [https://sowndharyapl15.github.io/frontend-task/responsive-card-layout/](https://sowndharyapl15.github.io/frontend-task/responsive-card-layout/)
- **Tech Stack**: HTML5, CSS3 (CSS Grid, Flexbox, Custom Properties)
- **Key Features**:
  - Fully responsive layout adapting across mobile, tablet, and desktop screens
  - CSS Grid with `auto-fit` and `minmax()` for fluid responsiveness
  - Interactive hover effects with smooth micro-transitions and lift effects
  - Accessible link tags, badges, and clean typography with Google Font *Plus Jakarta Sans*

### 2. [Static Profile Page](./static-profile-page/)
- **Live URL**: [https://sowndharyapl15.github.io/frontend-task/static-profile-page/](https://sowndharyapl15.github.io/frontend-task/static-profile-page/)
- **Tech Stack**: Semantic HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Key Features**:
  - **Hero Section**: Personal introduction with headline, status indicator, and profile image
  - **About & Education**: Academic background in Computer Science & Engineering
  - **Skills Matrix**: Categorized technical proficiencies, development tools, and frameworks
  - **Interactive Features**: 
    - Active navigation tracking powered by `IntersectionObserver`
    - Staggered scroll-reveal animations with reduced-motion accessibility support
  - 100% responsive across all device viewports

### 3. [DOM Campus Lost & Found](./dom-campus-lost-found/)
- **Live URL**: [https://sowndharyapl15.github.io/frontend-task/dom-campus-lost-found/](https://sowndharyapl15.github.io/frontend-task/dom-campus-lost-found/)
- **Tech Stack**: Semantic HTML5, Vanilla CSS3, Vanilla JavaScript (DOM Manipulation & Storage APIs)
- **Key Features**:
  - **Dynamic Feed**: Real-time rendering of lost and found report cards with status badges
  - **Instant Search & Filter**: Real-time text searching across titles, locations, and descriptions, paired with category/status filters (All, Lost, Found, Returned)
  - **Interactive Reporting**: Form validation, new report submission, status toggling ("Mark Returned"), and deletion
  - **Live Statistics**: Auto-updating summary cards counting Total Reports, Lost Items, Found Items, and Returned Items
  - **Persistence**: Safe `localStorage` integration preserving user reports across browser reloads
  - **Responsive Design**: Collapsible mobile report panel, fluid CSS Grid, and custom typography (*Plus Jakarta Sans*)

### 4. [Cosmic Window — Space Discovery Explorer](./Async%20JS-cosmic-window/)
- **Live URL**: [https://sowndharyapl15.github.io/frontend-task/Async%20JS-cosmic-window/](https://sowndharyapl15.github.io/frontend-task/Async%20JS-cosmic-window/)
- **Tech Stack**: Semantic HTML5, Vanilla CSS3 (Cosmic Dark Theme), Asynchronous JavaScript (Fetch API, Promises, Async/Await)
- **Key Features**:
  - **NASA APOD Integration**: Live asynchronous fetching from NASA's Astronomy Picture of the Day public API
  - **Date Travel Search**: Historical space exploration dating back to the first APOD (June 16, 1995) through today with strict boundary validation
  - **Complete UI States**:
    - **Loading State**: Orbiting cosmic ring loader with animated transmission messaging
    - **Error State**: Styled error diagnostics for rate limits (429), server downtime (500), and offline connections
    - **Retry State**: Active "Try Again" trigger and "View Archived Discovery" fallback
  - **Curated Discoveries & Presets**: One-click quick exploration for iconic milestones (James Webb Deep Field, Pillars of Creation, Carina Nebula, Andromeda) and a random discovery picker
  - **Rich Media & Video Support**: Automatic handling of high-resolution imagery with external HD viewing links and responsive video iframe player embeds
  - **API Key Configuration**: Built-in settings toggle allowing users to supply their personal NASA API key to bypass default `DEMO_KEY` limits

### 5. [Tailwind Nova Studio Landing](./Tailwind-nova-landing/)
- **Live URL**: [https://sowndharyapl15.github.io/frontend-task/Tailwind-nova-landing/](https://sowndharyapl15.github.io/frontend-task/Tailwind-nova-landing/)
- **Tech Stack**: Semantic HTML5, Tailwind CSS (Play CDN & Config), Modern Typography (*Plus Jakarta Sans* & *Space Grotesk*)
- **Key Features**:
  - **100% Pure Tailwind Architecture**: Built without monolithic custom CSS sheets, utilizing idiomatic Tailwind utility classes throughout
  - **Custom Theme Configuration**: Extended studio color palette (`#f8f7f4` studio background, `#20211f` charcoal, `#7c5c43` warm accent, `#e8e2d9` sand) and typography stacks
  - **Sticky Backdrop Navigation**: Semi-transparent frosted-glass header with anchor link navigation and CTA button
  - **Asymmetric Project Showcase Grid**: Responsive 12-column grid (`md:col-span-7` and `md:col-span-5`) with subtle card lift transitions and metadata badges
  - **Interactive Call-to-Action**: Mailto integration with one-click clipboard email copy feedback
  - **Full Mobile Responsiveness**: Seamless scaling across mobile phones, tablets, and wide desktop displays

### 6. [Bootstrap Nova Studio Landing](./Bootstrap-nova-landing/)
- **Live URL**: [https://sowndharyapl15.github.io/frontend-task/Bootstrap-nova-landing/](https://sowndharyapl15.github.io/frontend-task/Bootstrap-nova-landing/)
- **Tech Stack**: Semantic HTML5, Bootstrap 5.3.3 CSS & Bundle JS, Custom CSS Variables
- **Key Features**:
  - **Native Bootstrap 5 Components**: Responsive `navbar-expand-lg`, grid system (`row g-4`, `col-12 col-md-7`), cards (`card rounded-4`), and badges
  - **Interactive Inquiry Modal**: Bootstrap 5 JavaScript modal dialog (`#inquiryModal`) with form validation for project inquiries
  - **Design System Tokens**: Harmonized with NOVA brand aesthetics via CSS custom properties and contextual color utilities
  - **Responsive Layout & Grid**: Mobile-first fluid scaling with responsive gap utilities and typography
  - **Accessible Interactions**: Keyboard navigation, focus states, and aria attributes configured out-of-the-box

---

## 💻 How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SowndharyaPL15/frontend-task.git
   cd frontend-task
   ```

2. **Run any project**:
   - Simply open `index.html` from any task folder directly in your browser:
     - Open `Async JS-cosmic-window/index.html`
     - Open `Bootstrap-nova-landing/index.html`
     - Open `dom-campus-lost-found/index.html`
     - Open `responsive-card-layout/index.html`
     - Open `static-profile-page/index.html`
     - Open `Tailwind-nova-landing/index.html`
   - Or launch using VS Code's **Live Server** extension.

---

## 👤 Author

**Sowndharya P.L.**
- GitHub: [@SowndharyaPL15](https://github.com/SowndharyaPL15)