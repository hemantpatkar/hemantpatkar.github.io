// Wanderlust Tours & Travels — shared interactivity

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Mobile menu toggle ---- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'))
    );
  }

  /* ---- Navbar background on scroll ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('bg-slate-900/95', 'shadow-lg', 'backdrop-blur');
        navbar.classList.remove('bg-transparent');
      } else if (navbar.dataset.transparent === 'true') {
        navbar.classList.remove('bg-slate-900/95', 'shadow-lg', 'backdrop-blur');
        navbar.classList.add('bg-transparent');
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  /* ---- Scroll reveal animations ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Contact form (demo only — no backend) ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      if (status) {
        status.classList.remove('hidden');
        contactForm.reset();
        setTimeout(() => status.classList.add('hidden'), 5000);
      }
    });
  }
});
