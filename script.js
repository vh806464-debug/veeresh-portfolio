/**
 * VEERESH H. - PORTFOLIO INTERACTIVE SCRIPT
 * Handles Canvas Particle Simulation, Custom Cursor, Smooth Scrolling,
 * Intersection Observer Animations, Metric Counters, and CMS Hydration.
 */

// ==========================================================================
// 1. CONSTANTS & DEFAULT CMS CONFIGURATION
// ==========================================================================
const CMS_STORAGE_KEY = 'vh_portfolio_cms';
const INDEXED_DB_NAME = 'VeereshPortfolioDB';
const INDEXED_DB_STORE = 'uploadedMedia';

// Default initial state matching Veeresh H's portfolio requirements
const DEFAULT_PORTFOLIO_DATA = {
  hero: {
    badge: 'âœ¦ Available for Freelance & Creative Collaborations',
    name: 'Veeresh H.',
    heading: 'AI Edits & Designs',
    subheading: 'Motion Graphic Designer',
    description: 'Fusing cinematic motion graphics, pulse-pounding video edits, and state-of-the-art AI workflows to engineer visually unforgettable digital experiences.'
  },
  services: [
    {
      id: 1,
      title: 'Motion Graphic Design',
      desc: 'High-impact 2D/3D kinetic motion graphics, title sequences, brand logo animations, and futuristic interface designs tailored for maximum visual retention.',
      tools: ['All AI Tools (AI Tool Handling)', 'After Effects', 'DaVinci Resolve'],
      icon: 'fa-solid fa-wand-magic-sparkles'
    },
    {
      id: 2,
      title: 'Video Editing',
      desc: 'Cinematic pacing, rhythm-driven cuts, audio design harmonization, and color grading that transforms raw footage into compelling, high-converting visual stories.',
      tools: ['All AI Tools (AI Tool Handling)', 'Premiere Pro', 'Final Cut Pro'],
      icon: 'fa-solid fa-film'
    },
    {
      id: 3,
      title: 'Graphic Design',
      desc: 'Striking visual brand identities, digital posters, social media campaign creative kits, vector illustrations, and sleek UI mockups engineered with precision.',
      tools: ['All AI Tools (AI Tool Handling)', 'Adobe Illustrator', 'Photoshop', 'InDesign', 'Affinity Designer', 'Figma'],
      icon: 'fa-solid fa-bezier-curve'
    },
    {
      id: 4,
      title: 'AI Tool Handling',
      desc: 'Pioneering generative video synthesis, high-fidelity voice cloning, neural upscaling, and generative design pipelines that amplify production speed tenfold.',
      tools: ['Claude Design & Coding', 'ChatGPT Codex', 'Higgsfield', 'HeyGen', 'ElevenLabs', 'Magnific AI', 'VidRush'],
      icon: 'fa-solid fa-brain'
    }
  ],
  works: [
    {
      id: 'work-1',
      title: 'Kinetic AI Motion Reel #1',
      desc: 'High-tempo dynamic motion graphics sequence with AI-assisted visual transitions.',
      url: 'https://www.youtube.com/embed/t2kL22G4Z1g',
      type: 'shorts', // 9:16
      tag: 'Motion & AI'
    },
    {
      id: 'work-2',
      title: 'Visual Rhythm Edit #2',
      desc: 'Sound-synchronized visual edits, beat matching, and seamless speed ramping.',
      url: 'https://www.youtube.com/embed/Pc0n1SQzsi0',
      type: 'shorts', // 9:16
      tag: 'Video Editing'
    },
    {
      id: 'work-3',
      title: 'Commercial Brand Motion Sequence',
      desc: 'Full 16:9 motion design title package, atmospheric effects, and sound design.',
      url: 'https://www.youtube.com/embed/vjitVW2mbmk',
      type: 'cinematic', // 16:9
      tag: 'Motion Design'
    },
    {
      id: 'work-4',
      title: 'AI Powered Concept Film',
      desc: 'Exploration of neural video generation, generative typography, and precision pacing.',
      url: 'https://www.youtube.com/embed/4WeALTZICSw',
      type: 'cinematic', // 16:9
      tag: 'AI Visuals'
    },
    {
      id: 'work-5',
      title: 'High-Retention Narrative Cut',
      desc: 'Color graded visual narrative cut with multi-layered audio scoring and motion titles.',
      url: 'https://www.youtube.com/embed/1UDdGg8cG2w',
      type: 'cinematic', // 16:9
      tag: 'Video Editing'
    },
    {
      id: 'work-6',
      title: 'Futuristic Cybernetic Title Package',
      desc: 'Complex keyframe choreography, particle simulations, and 3D visual hierarchy.',
      url: 'https://www.youtube.com/embed/wS95p0QDxzI',
      type: 'cinematic', // 16:9
      tag: 'After Effects'
    }
  ],
  contact: {
    email: 'vh806464@gmail.com',
    phone: '8660641045',
    phoneFormatted: '+91 8660641045',
    whatsappUrl: 'https://wa.me/918660641045',
    instagram: 'sumne__shokige',
    instagramUrl: 'https://instagram.com/sumne__shokige',
    copyright: 'Â© 2024 Veeresh H. All Rights Reserved.'
  }
};

// ==========================================================================
// 2. PRELOADER & INITIALIZATION
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initHeroCanvas();
  initMouseGlow();
  initNavbarScroll();
  initMobileMenu();
  initScrollAnimations();
  initWorksFilter();
  initMetricCounters();
  initAdminShortcuts();
  loadCMSData();
  loadCustomUploads();

  // Listen for storage changes from admin panel
  window.addEventListener('storage', (e) => {
    if (e.key === CMS_STORAGE_KEY) {
      loadCMSData();
      showToast('Portfolio content updated from Admin Panel', 'info');
    }
  });
});

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const counter = document.getElementById('preloaderCounter');
  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;
    
    if (fill) fill.style.width = progress + '%';
    if (counter) counter.textContent = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('loading');
      }, 350);
    }
  }, 35);
}

// ==========================================================================
// 3. CUSTOM CURSOR
// ==========================================================================
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderCursor() {
    // Smooth lerp following
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Add hover effect on interactive elements
  const interactiveTargets = 'a, button, input, textarea, .service-card, .work-card, .contact-info-card, .filter-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

// ==========================================================================
// 4. HERO CANVAS (INTERACTIVE 3D PARTICLES & GEOMETRIC NODES)
// ==========================================================================
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouse = { x: width / 2, y: height / 2, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.size = Math.random() * 2.5 + 1.2;
      this.color = Math.random() > 0.4 ? '#00f0ff' : '#9d4edd';
      this.alpha = Math.random() * 0.6 + 0.2;
      this.shape = Math.random() > 0.7 ? 'square' : 'circle';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off boundaries
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/gravitation
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const dirX = (dx / distance) * force * 1.5;
        const dirY = (dy / distance) * force * 1.5;
        this.x -= dirX;
        this.y -= dirY;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
      }
      ctx.restore();
    }
  }

  // Floating wireframe geometric shapes
  class FloatingPolyhedron {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 30 + 20;
      this.rotation = Math.random() * Math.PI;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.sides = Math.random() > 0.5 ? 3 : 6; // Triangle or Hexagon
      this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.2)' : 'rgba(157, 78, 221, 0.2)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;

      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;
    }

    draw() {
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < this.sides; i++) {
        const angle = this.rotation + (i * 2 * Math.PI) / this.sides;
        const px = this.x + this.radius * Math.cos(angle);
        const py = this.y + this.radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  // Create particles
  const particleCount = Math.min(Math.floor(width / 16), 85);
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const polyhedra = [];
  for (let i = 0; i < 5; i++) {
    polyhedra.push(new FloatingPolyhedron());
  }

  // Connect close particles with neural lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          ctx.save();
          const opacity = (1 - dist / 115) * 0.18;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    polyhedra.forEach((poly) => {
      poly.update();
      poly.draw();
    });

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    drawConnections();

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================================================
// 5. MOUSE-FOLLOWING SPOTLIGHT GRADIENT
// ==========================================================================
function initMouseGlow() {
  const glow = document.getElementById('heroMouseGlow');
  const hero = document.getElementById('hero');
  if (!glow || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
  });
}

// ==========================================================================
// 6. NAVBAR SCROLL EFFECT & ACTIVE LINKS
// ==========================================================================
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ==========================================================================
// 7. MOBILE HAMBURGER MENU
// ==========================================================================
function initMobileMenu() {
  const btn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('closeDrawerBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!btn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  btn.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu();
    });
  });
}

// ==========================================================================
// 8. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ==========================================================================
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-card');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

// ==========================================================================
// 9. WORKS FILTER TABS
// ==========================================================================
function initWorksFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.filter-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });
}

// ==========================================================================
// 10. METRIC COUNTERS ANIMATION
// ==========================================================================
function initMetricCounters() {
  const counters = document.querySelectorAll('.metric-number');
  let animated = false;

  const metricsSection = document.querySelector('.hero-metrics');
  if (!metricsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        counters.forEach((counter) => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000;
          const stepTime = Math.abs(Math.floor(duration / target));
          let current = 0;

          const timer = setInterval(() => {
            current += 1;
            counter.textContent = current;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            }
          }, Math.max(stepTime, 25));
        });
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(metricsSection);
}

// ==========================================================================
// 11. CONTACT FORM HANDLER
// ==========================================================================
window.handleContactSubmit = function (e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('formSubmitBtn');
  const status = document.getElementById('formStatus');

  const name = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const subject = document.getElementById('formSubject').value.trim();
  const message = document.getElementById('formMessage').value.trim();

  if (!name || !email || !message) {
    status.className = 'form-status error';
    status.textContent = 'Please fill out all required fields.';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
    status.className = 'form-status success';
    status.textContent = 'Thank you! Your message has been prepared. Opening your mail client...';

    // Construct mailto link as fallback
    const mailtoUri = `mailto:vh806464@gmail.com?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${subject}`
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    window.location.href = mailtoUri;
    showToast('Inquiry drafted! Mail client opened.', 'success');
    form.reset();
  }, 1000);
};

// ==========================================================================
// 12. CMS HYDRATION (LIVE JSON + LOCAL STORAGE FALLBACK)
// ==========================================================================
async function loadCMSData() {
  try {
    let cms = null;

    // Check if running on HTTP/HTTPS to load live portfolio-data.json
    if (window.location.protocol.startsWith('http')) {
      try {
        const response = await fetch('./portfolio-data.json', { cache: 'no-cache' });
        if (response.ok) {
          cms = await response.json();
        }
      } catch (fetchErr) {
        console.info('Using local cache or default data');
      }
    }

    // If local changes exist in localStorage and user is editing locally, honor them
    const localData = localStorage.getItem(CMS_STORAGE_KEY);
    if (!cms && localData) {
      cms = JSON.parse(localData);
    }

    // Default fallback
    if (!cms) {
      cms = DEFAULT_PORTFOLIO_DATA;
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    }

    // Hydrate Hero
    if (cms.hero) {
      const badge = document.getElementById('cms-hero-badge');
      const name = document.getElementById('cms-hero-name');
      const navName = document.getElementById('cms-nav-name');
      const heading = document.getElementById('cms-hero-heading');
      const subheading = document.getElementById('cms-hero-subheading');
      const desc = document.getElementById('cms-hero-description');

      if (badge && cms.hero.badge) badge.textContent = cms.hero.badge;
      if (name && cms.hero.name) name.textContent = cms.hero.name;
      if (navName && cms.hero.name) navName.textContent = cms.hero.name.toUpperCase();
      if (heading && cms.hero.heading) heading.textContent = cms.hero.heading;
      if (subheading && cms.hero.subheading) subheading.textContent = cms.hero.subheading;
      if (desc && cms.hero.description) desc.textContent = cms.hero.description;
    }

    // Hydrate Services
    if (cms.services && Array.isArray(cms.services)) {
      cms.services.forEach((service, index) => {
        const id = index + 1;
        const titleEl = document.getElementById(`cms-service-${id}-title`);
        const descEl = document.getElementById(`cms-service-${id}-desc`);
        const toolsEl = document.getElementById(`cms-service-${id}-tools`);

        if (titleEl && service.title) titleEl.textContent = service.title;
        if (descEl && service.desc) descEl.textContent = service.desc;

        if (toolsEl && service.tools) {
          toolsEl.innerHTML = '';
          service.tools.forEach((tool) => {
            const span = document.createElement('span');
            span.className = 'tool-tag';
            if (tool.toLowerCase().includes('ai')) span.classList.add('ai-tag');
            span.innerHTML = `<i class="fa-solid fa-microchip"></i> ${tool}`;
            toolsEl.appendChild(span);
          });
        }
      });
    }

    // Hydrate Works Grid
    if (cms.works && Array.isArray(cms.works) && cms.works.length > 0) {
      renderWorksGrid(cms.works);
    }

    // Hydrate Contact & Footer
    if (cms.contact) {
      const email = document.getElementById('cms-contact-email');
      const drawerEmail = document.getElementById('cms-drawer-email');
      const phone = document.getElementById('cms-contact-phone');
      const ig = document.getElementById('cms-contact-instagram');
      const copyright = document.getElementById('cms-footer-copyright');

      const emailCard = document.getElementById('cms-contact-email-card');
      const waCard = document.getElementById('cms-contact-wa-card');
      const igCard = document.getElementById('cms-contact-ig-card');

      if (email && cms.contact.email) email.textContent = cms.contact.email;
      if (drawerEmail && cms.contact.email) drawerEmail.textContent = cms.contact.email;
      if (phone && cms.contact.phoneFormatted) phone.textContent = cms.contact.phoneFormatted;
      if (ig && cms.contact.instagram) ig.textContent = `@${cms.contact.instagram.replace('@', '')}`;
      if (copyright && cms.contact.copyright) copyright.textContent = cms.contact.copyright;

      if (emailCard && cms.contact.email) emailCard.href = `mailto:${cms.contact.email}`;
      if (waCard && (cms.contact.whatsappUrl || cms.contact.phone)) {
        waCard.href = cms.contact.whatsappUrl || `https://wa.me/91${cms.contact.phone}`;
      }
      if (igCard && (cms.contact.instagramUrl || cms.contact.instagram)) {
        igCard.href = cms.contact.instagramUrl || `https://instagram.com/${cms.contact.instagram.replace('@', '')}`;
      }
    }
  } catch (err) {
    console.warn('Error loading CMS data:', err);
  }
}

// Dynamically Render Works Grid (Handles YouTube embeds, Vimeo, Direct Video, and Images)
function renderWorksGrid(works) {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;

  grid.innerHTML = '';

  works.forEach((work) => {
    const isShort = work.type === 'shorts';
    const wrapper = document.createElement('div');
    wrapper.className = `work-item-wrapper filter-item ${isShort ? 'shorts-item' : 'cinematic-item'} is-revealed`;
    wrapper.setAttribute('data-category', isShort ? 'shorts' : 'cinematic');

    const badgeIcon = isShort ? 'fa-mobile-screen' : 'fa-display';
    const badgeText = isShort ? 'Vertical Short (9:16)' : 'Cinematic (16:9)';
    const badgeClass = isShort ? 'badge-short' : 'badge-video';
    const ratioClass = isShort ? 'ratio-9-16' : 'ratio-16-9';

    // Determine media rendering
    let mediaHtml = '';
    const url = (work.url || '').trim();
    const isDirectVideo = work.mediaFormat === 'video' || /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
    const isDirectImage = work.mediaFormat === 'image' || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url);

    if (isDirectVideo) {
      mediaHtml = `
        <video 
          src="${escapeHtml(url)}" 
          ${work.thumbnail ? `poster="${escapeHtml(work.thumbnail)}"` : ''}
          controls 
          playsinline 
          preload="metadata"
          style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">
        </video>
      `;
    } else if (isDirectImage) {
      mediaHtml = `
        <img 
          src="${escapeHtml(url)}" 
          alt="${escapeHtml(work.title)}" 
          loading="lazy"
          style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" />
      `;
    } else {
      // Standard embed (YouTube or Vimeo)
      mediaHtml = `
        <iframe 
          src="${escapeHtml(url)}" 
          title="${escapeHtml(work.title)}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen 
          loading="lazy">
        </iframe>
      `;
    }

    wrapper.innerHTML = `
      <div class="work-card ${isShort ? 'short-card' : 'standard-card'}">
        <div class="aspect-container ${ratioClass}">
          ${mediaHtml}
        </div>
        <div class="work-card-info">
          <div class="work-meta">
            <span class="badge ${badgeClass}"><i class="fa-solid ${badgeIcon}"></i> ${badgeText}</span>
            <span class="work-tag">${escapeHtml(work.tag || 'Project')}</span>
          </div>
          <h4 class="work-title">${escapeHtml(work.title)}</h4>
          <p class="work-desc">${escapeHtml(work.desc || '')}</p>
        </div>
      </div>
    `;

    grid.appendChild(wrapper);
  });
}

// ==========================================================================
// 13. CUSTOM UPLOADS HYDRATION FROM INDEXEDDB
// ==========================================================================
function loadCustomUploads() {
  const section = document.getElementById('customUploadsSection');
  const grid = document.getElementById('customUploadsGrid');
  if (!section || !grid) return;

  const request = indexedDB.open(INDEXED_DB_NAME, 1);
  request.onerror = () => {};
  request.onsuccess = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(INDEXED_DB_STORE)) return;

    const tx = db.transaction(INDEXED_DB_STORE, 'readonly');
    const store = tx.objectStore(INDEXED_DB_STORE);
    const getAllReq = store.getAll();

    getAllReq.onsuccess = () => {
      const items = getAllReq.result || [];
      if (items.length === 0) {
        section.style.display = 'none';
        return;
      }

      section.style.display = 'block';
      grid.innerHTML = '';

      items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'custom-upload-card';

        let mediaEl = '';
        if (item.type.startsWith('video/')) {
          mediaEl = `<video class="custom-media-preview" src="${item.data}" controls playsinline preload="metadata"></video>`;
        } else if (item.type.startsWith('image/')) {
          mediaEl = `<img class="custom-media-preview" src="${item.data}" alt="${escapeHtml(item.name)}" loading="lazy">`;
        } else {
          mediaEl = `<div class="custom-media-preview" style="display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--accent-cyan);"><i class="fa-solid fa-file"></i></div>`;
        }

        card.innerHTML = `
          ${mediaEl}
          <div class="custom-media-info">
            <div class="custom-media-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">
              ${(item.size / 1024 / 1024).toFixed(2)} MB â€¢ ${escapeHtml(item.type.split('/')[1] || 'media')}
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    };
  };
}

// ==========================================================================
// 14. ADMIN SHORTCUT (Ctrl+Alt+A)
// ==========================================================================
function initAdminShortcuts() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });
}

// ==========================================================================
// 15. UTILITIES & TOASTS
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
