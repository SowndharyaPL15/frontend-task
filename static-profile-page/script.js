/* =========================================
   SOWNDHARYA P.L. — PORTFOLIO JAVASCRIPT
   ========================================= */

// Ensure clean light theme state
document.documentElement.removeAttribute("data-theme");
try {
    localStorage.removeItem("portfolio_theme");
} catch (e) {}

// 1. Highlight the navigation link for the current section
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${entry.target.id}`;

                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            }
        });
    },
    {
        rootMargin: "-25% 0px -65% 0px"
    }
);

sections.forEach((section) => {
    observer.observe(section);
});


// 2. Add a subtle reveal effect when sections enter the screen
const revealItems = document.querySelectorAll(
    ".section-heading, .about-copy, .about-note, " +
    ".skill-card, .project-card, .education-item, " +
    ".recognition-item, .contact-content"
);

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    revealItems.forEach((item) => {
        item.classList.add("reveal-pending");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach((item) => {
        item.classList.add("is-visible");
    });
}


// 3. Display the current year in the browser console
console.log(
    `Portfolio loaded successfully — ${new Date().getFullYear()}`
);
