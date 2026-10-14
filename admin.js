/**
 * VEERESH H. - ADMIN STUDIO JAVASCRIPT
 * Full-featured CMS Controller: Password Gate, Content CRUD,
 * YouTube Video Parser, Unlimited IndexedDB File Manager, and JSON Export/Import.
 */

// ==========================================================================
// 1. CONFIGURATION & STATE
// ==========================================================================
const CMS_STORAGE_KEY = 'vh_portfolio_cms';
const PASSWORD_STORAGE_KEY = 'vh_admin_password';
const AUTH_SESSION_KEY = 'vh_admin_auth';
const DEFAULT_PASSWORD = 'veeresh2024';

const INDEXED_DB_NAME = 'VeereshPortfolioDB';
const INDEXED_DB_VERSION = 1;
const INDEXED_DB_STORE = 'uploadedMedia';

// Default Data Blueprint
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

let currentCMSData = null;
let dbInstance = null;

// ==========================================================================
// 2. LIFECYCLE & AUTHENTICATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  initIndexedDB(() => {
    loadUploadsGallery();
  });
  initTabs();
  initDropzone();
  loadAdminData();
});

function checkAuthentication() {
  const isAuth = sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  const overlay = document.getElementById('authOverlay');
  if (isAuth && overlay) {
    overlay.classList.add('hidden');
  } else if (overlay) {
    overlay.classList.remove('hidden');
  }
}

window.handleAuthSubmit = function (e) {
  e.preventDefault();
  const input = document.getElementById('adminPasswordInput');
  const enteredPass = input.value.trim();
  const storedPass = localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD;

  if (enteredPass === storedPass) {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.classList.add('hidden');
    showAdminToast('Welcome back, Veeresh!', 'success');
  } else {
    showAdminToast('Incorrect password. Please try again.', 'error');
    input.value = '';
    input.focus();
  }
};

window.handleLogout = function () {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.classList.remove('hidden');
  showAdminToast('Admin session locked.', 'info');
};

window.handleChangePassword = function (e) {
  e.preventDefault();
  const input = document.getElementById('newAdminPass');
  const newPass = input.value.trim();
  if (newPass.length < 4) {
    showAdminToast('Password must be at least 4 characters.', 'error');
    return;
  }
  localStorage.setItem(PASSWORD_STORAGE_KEY, newPass);
  input.value = '';
  showAdminToast('Admin password updated successfully!', 'success');
};

// ==========================================================================
// 3. TAB NAVIGATION
// ==========================================================================
function initTabs() {
  const sidebarBtns = document.querySelectorAll('.sidebar-btn');
  sidebarBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });
}

window.switchTab = function (tabId) {
  document.querySelectorAll('.sidebar-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });
};

// ==========================================================================
// 4. CMS DATA LOADING & POPULATION
// ==========================================================================
function loadAdminData() {
  let raw = localStorage.getItem(CMS_STORAGE_KEY);
  if (!raw) {
    currentCMSData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(currentCMSData));
  } else {
    try {
      currentCMSData = JSON.parse(raw);
    } catch (e) {
      currentCMSData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    }
  }

  // Populate Hero
  if (currentCMSData.hero) {
    setVal('adminName', currentCMSData.hero.name || '');
    setVal('adminHeroBadge', currentCMSData.hero.badge || '');
    setVal('adminHeading', currentCMSData.hero.heading || '');
    setVal('adminSubheading', currentCMSData.hero.subheading || '');
    setVal('adminDescription', currentCMSData.hero.description || '');
  }

  // Populate Services
  if (currentCMSData.services && Array.isArray(currentCMSData.services)) {
    currentCMSData.services.forEach((s, idx) => {
      const i = idx + 1;
      setVal(`service${i}Title`, s.title || '');
      setVal(`service${i}Tools`, Array.isArray(s.tools) ? s.tools.join(', ') : '');
      setVal(`service${i}Desc`, s.desc || '');
    });
  }

  // Populate Contact
  if (currentCMSData.contact) {
    setVal('adminEmail', currentCMSData.contact.email || '');
    setVal('adminPhone', currentCMSData.contact.phone || '');
    setVal('adminInstagram', currentCMSData.contact.instagram || '');
    setVal('adminCopyright', currentCMSData.contact.copyright || '');
  }

  // Populate GitHub settings if remembered
  const savedRepo = localStorage.getItem('vh_gh_repo');
  if (savedRepo) setVal('ghRepoInput', savedRepo);

  // Render Works List
  renderAdminWorks();
  updateOverviewStats();
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function updateOverviewStats() {
  const worksCount = currentCMSData.works ? currentCMSData.works.length : 0;
  const count1 = document.getElementById('statWorksCount');
  const count2 = document.getElementById('activeWorksCount');
  if (count1) count1.textContent = worksCount;
  if (count2) count2.textContent = worksCount;
}

// ==========================================================================
// 5. SAVING CONTENT SECTIONS
// ==========================================================================
window.saveHeroSection = function () {
  if (!currentCMSData.hero) currentCMSData.hero = {};
  currentCMSData.hero.name = getVal('adminName');
  currentCMSData.hero.badge = getVal('adminHeroBadge');
  currentCMSData.hero.heading = getVal('adminHeading');
  currentCMSData.hero.subheading = getVal('adminSubheading');
  currentCMSData.hero.description = getVal('adminDescription');

  saveCMS();
  showAdminToast('Hero section saved successfully!', 'success');
};

window.saveServicesSection = function () {
  if (!currentCMSData.services) currentCMSData.services = [];

  for (let i = 1; i <= 4; i++) {
    const title = getVal(`service${i}Title`);
    const toolsStr = getVal(`service${i}Tools`);
    const desc = getVal(`service${i}Desc`);

    const toolsArr = toolsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (currentCMSData.services[i - 1]) {
      currentCMSData.services[i - 1].title = title;
      currentCMSData.services[i - 1].tools = toolsArr;
      currentCMSData.services[i - 1].desc = desc;
    } else {
      currentCMSData.services.push({
        id: i,
        title,
        tools: toolsArr,
        desc,
        icon: 'fa-solid fa-star'
      });
    }
  }

  saveCMS();
  showAdminToast('All 4 services updated successfully!', 'success');
};

window.saveContactSection = function () {
  if (!currentCMSData.contact) currentCMSData.contact = {};
  const email = getVal('adminEmail');
  const phone = getVal('adminPhone').replace(/[^0-9]/g, '');
  const ig = getVal('adminInstagram').replace('@', '');
  const copyright = getVal('adminCopyright');

  currentCMSData.contact.email = email;
  currentCMSData.contact.phone = phone;
  currentCMSData.contact.phoneFormatted = phone ? `+91 ${phone}` : '';
  currentCMSData.contact.whatsappUrl = phone ? `https://wa.me/91${phone}` : '';
  currentCMSData.contact.instagram = ig;
  currentCMSData.contact.instagramUrl = ig ? `https://instagram.com/${ig}` : '';
  currentCMSData.contact.copyright = copyright;

  saveCMS();
  showAdminToast('Contact information saved successfully!', 'success');
};

window.saveAllChanges = function () {
  saveHeroSection();
  saveServicesSection();
  saveContactSection();
  showAdminToast('All portfolio changes synchronized!', 'success');
};

function saveCMS() {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(currentCMSData));
}

// ==========================================================================
// 6. WORKS & YOUTUBE VIDEO MANAGEMENT
// ==========================================================================
// Converts YouTube URL (Shorts, share link, watch URL) to embed format
function parseYouTubeEmbedUrl(url) {
  if (!url) return '';
  url = url.trim();

  // If already embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  // Handle YouTube Shorts: https://youtube.com/shorts/{id} or https://www.youtube.com/shorts/{id}
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // Handle youtu.be shortlinks: https://youtu.be/{id}
  const youtuMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuMatch && youtuMatch[1]) {
    return `https://www.youtube.com/embed/${youtuMatch[1]}`;
  }

  // Handle standard watch links: https://www.youtube.com/watch?v={id}
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // Fallback: return as provided
  return url;
}

window.handleMediaFormatChange = function (format) {
  const label = document.getElementById('workUrlLabel');
  const urlInput = document.getElementById('newWorkUrl');
  if (!label || !urlInput) return;

  if (format === 'youtube') {
    label.textContent = 'YouTube Link or Embed URL *';
    urlInput.placeholder = 'https://youtube.com/shorts/... or https://youtu.be/...';
  } else if (format === 'vimeo') {
    label.textContent = 'Vimeo Video URL *';
    urlInput.placeholder = 'https://vimeo.com/... or https://player.vimeo.com/video/...';
  } else if (format === 'video') {
    label.textContent = 'Direct Video File URL (MP4, WebM) *';
    urlInput.placeholder = 'https://res.cloudinary.com/... or https://.../reel.mp4';
  } else if (format === 'image') {
    label.textContent = 'High-Res Image / Artwork URL (JPG, PNG, WebP, GIF) *';
    urlInput.placeholder = 'https://i.ibb.co/... or https://res.cloudinary.com/.../artwork.png';
  }
};

window.handleAddWork = function (e) {
  e.preventDefault();
  const title = getVal('newWorkTitle');
  const tag = getVal('newWorkTag');
  const mediaFormat = getVal('newWorkMediaFormat') || 'youtube';
  const rawUrl = getVal('newWorkUrl');
  const type = getVal('newWorkType') || 'cinematic';
  const thumbnail = getVal('newWorkThumbnail');
  const desc = getVal('newWorkDesc');

  if (!title || !rawUrl) {
    showAdminToast('Please provide both a Title and Media link.', 'error');
    return;
  }

  let finalUrl = rawUrl.trim();
  if (mediaFormat === 'youtube') {
    finalUrl = parseYouTubeEmbedUrl(finalUrl);
  } else if (mediaFormat === 'vimeo') {
    const vimeoMatch = finalUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[3]) {
      finalUrl = `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }
  }

  const newWork = {
    id: `work-${Date.now()}`,
    title,
    tag: tag || 'Project',
    mediaFormat,
    url: finalUrl,
    type,
    thumbnail: thumbnail.trim(),
    desc: desc.trim()
  };

  if (!currentCMSData.works) currentCMSData.works = [];
  currentCMSData.works.unshift(newWork);

  saveCMS();
  renderAdminWorks();
  updateOverviewStats();

  // Reset form
  document.getElementById('addWorkForm').reset();
  showAdminToast(`Added "${title}" to portfolio!`, 'success');
};

window.handleDeleteWork = function (workId) {
  if (!confirm('Are you sure you want to remove this project from your portfolio?')) {
    return;
  }

  currentCMSData.works = currentCMSData.works.filter((w) => w.id !== workId);
  saveCMS();
  renderAdminWorks();
  updateOverviewStats();
  showAdminToast('Project removed successfully.', 'info');
};

// Reorder Works: Move Up
window.moveWorkUp = function (workId) {
  const index = currentCMSData.works.findIndex((w) => w.id === workId);
  if (index <= 0) return; // already at top

  const temp = currentCMSData.works[index];
  currentCMSData.works[index] = currentCMSData.works[index - 1];
  currentCMSData.works[index - 1] = temp;

  saveCMS();
  renderAdminWorks();
  showAdminToast(`Moved "${temp.title}" up.`, 'info');
};

// Reorder Works: Move Down
window.moveWorkDown = function (workId) {
  const index = currentCMSData.works.findIndex((w) => w.id === workId);
  if (index < 0 || index >= currentCMSData.works.length - 1) return; // already at bottom

  const temp = currentCMSData.works[index];
  currentCMSData.works[index] = currentCMSData.works[index + 1];
  currentCMSData.works[index + 1] = temp;

  saveCMS();
  renderAdminWorks();
  showAdminToast(`Moved "${temp.title}" down.`, 'info');
};

// Open Edit Modal
window.openEditModal = function (workId) {
  const work = currentCMSData.works.find((w) => w.id === workId);
  if (!work) return;

  document.getElementById('editWorkId').value = work.id;
  document.getElementById('editWorkTitle').value = work.title || '';
  document.getElementById('editWorkTag').value = work.tag || '';
  document.getElementById('editWorkMediaFormat').value = work.mediaFormat || 'youtube';
  document.getElementById('editWorkType').value = work.type || 'cinematic';
  document.getElementById('editWorkUrl').value = work.url || '';
  document.getElementById('editWorkThumbnail').value = work.thumbnail || '';
  document.getElementById('editWorkDesc').value = work.desc || '';

  const modal = document.getElementById('editModalOverlay');
  if (modal) modal.classList.remove('hidden');
};

window.closeEditModal = function () {
  const modal = document.getElementById('editModalOverlay');
  if (modal) modal.classList.add('hidden');
};

window.handleSaveEditWork = function (e) {
  e.preventDefault();
  const workId = document.getElementById('editWorkId').value;
  const work = currentCMSData.works.find((w) => w.id === workId);
  if (!work) return;

  const title = getVal('editWorkTitle');
  const tag = getVal('editWorkTag');
  const mediaFormat = getVal('editWorkMediaFormat') || 'youtube';
  const rawUrl = getVal('editWorkUrl');
  const type = getVal('editWorkType') || 'cinematic';
  const thumbnail = getVal('editWorkThumbnail');
  const desc = getVal('editWorkDesc');

  let finalUrl = rawUrl.trim();
  if (mediaFormat === 'youtube') {
    finalUrl = parseYouTubeEmbedUrl(finalUrl);
  }

  work.title = title;
  work.tag = tag;
  work.mediaFormat = mediaFormat;
  work.url = finalUrl;
  work.type = type;
  work.thumbnail = thumbnail.trim();
  work.desc = desc.trim();

  saveCMS();
  renderAdminWorks();
  closeEditModal();
  showAdminToast(`Updated "${title}" successfully!`, 'success');
};

function renderAdminWorks() {
  const container = document.getElementById('adminWorksList');
  if (!container) return;

  container.innerHTML = '';
  const works = currentCMSData.works || [];

  if (works.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted); text-align: center; padding: 2rem;">No projects added yet. Add your first above!</p>`;
    return;
  }

  works.forEach((work, index) => {
    const card = document.createElement('div');
    card.className = 'work-mgmt-card';

    const isShort = work.type === 'shorts';
    const typeLabel = isShort ? '9:16 Short' : '16:9 Video';

    const isFirst = index === 0;
    const isLast = index === works.length - 1;

    // Preview markup based on format
    let previewHtml = '';
    const url = (work.url || '').trim();
    const isDirectVideo = work.mediaFormat === 'video' || /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
    const isDirectImage = work.mediaFormat === 'image' || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url);

    if (isDirectVideo) {
      previewHtml = `<video src="${escapeHtml(url)}" ${work.thumbnail ? `poster="${escapeHtml(work.thumbnail)}"` : ''} style="width:100%;height:100%;object-fit:cover;" controls preload="metadata"></video>`;
    } else if (isDirectImage) {
      previewHtml = `<img src="${escapeHtml(url)}" alt="${escapeHtml(work.title)}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">`;
    } else {
      previewHtml = `<iframe src="${escapeHtml(url)}" loading="lazy"></iframe>`;
    }

    card.innerHTML = `
      <div class="work-mgmt-preview">
        ${previewHtml}
      </div>
      <div class="work-mgmt-body">
        <div class="work-mgmt-meta">
          <span><i class="fa-solid ${isShort ? 'fa-mobile-screen' : 'fa-display'}"></i> ${typeLabel}</span>
          <span style="color:var(--accent-cyan); font-weight: 600;">#${index + 1} &bull; ${escapeHtml(work.tag || '')}</span>
        </div>
        <h4 class="work-mgmt-title">${escapeHtml(work.title)}</h4>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.8rem;line-height:1.4;">${escapeHtml(work.desc || '')}</p>
        <div class="work-mgmt-actions">
          <button class="btn-icon" title="Move Up in Order" onclick="moveWorkUp('${work.id}')" ${isFirst ? 'disabled' : ''}>
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button class="btn-icon" title="Move Down in Order" onclick="moveWorkDown('${work.id}')" ${isLast ? 'disabled' : ''}>
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <button class="btn-icon" title="Edit Project Details" onclick="openEditModal('${work.id}')" style="margin-left: auto;">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-icon" title="Delete Project" onclick="handleDeleteWork('${work.id}')" style="color: #ff4757; border-color: rgba(255, 71, 87, 0.3);">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ==========================================================================
// 6B. GITHUB LIVE WEBSITE SYNC (CONTINUOUS DEPLOYMENT)
// ==========================================================================
window.publishChangesToGitHub = async function () {
  const repoInput = document.getElementById('ghRepoInput');
  const tokenInput = document.getElementById('ghTokenInput');
  const btn = document.getElementById('btnPublishGithub');

  const repo = (repoInput ? repoInput.value : '').trim();
  const token = (tokenInput ? tokenInput.value : '').trim();

  if (!repo || !token) {
    showAdminToast('Please provide both your GitHub Repo (owner/repo) and Personal Access Token.', 'error');
    return;
  }

  // Save repo to localStorage for convenience
  localStorage.setItem('vh_gh_repo', repo);

  try {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing to GitHub...';

    // 1. Get current portfolio-data.json SHA
    const apiUrl = `https://api.github.com/repos/${repo}/contents/portfolio-data.json`;
    const getRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let sha = '';
    if (getRes.ok) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    }

    // 2. Prepare payload
    const updatedContent = JSON.stringify(currentCMSData, null, 2);
    // Base64 encode UTF-8 string
    const encodedContent = btoa(unescape(encodeURIComponent(updatedContent)));

    const bodyPayload = {
      message: `CMS Update: Portfolio content published by Admin (${new Date().toLocaleString()})`,
      content: encodedContent,
      branch: 'main'
    };
    if (sha) bodyPayload.sha = sha;

    // 3. Commit to GitHub
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyPayload)
    });

    if (putRes.ok) {
      showAdminToast('ðŸš€ Published to GitHub! Vercel is now building and deploying your live site.', 'success');
    } else {
      const errData = await putRes.json();
      throw new Error(errData.message || 'GitHub API error');
    }
  } catch (err) {
    console.error('Publish error:', err);
    showAdminToast(`Publish failed: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-rocket"></i> Publish All Changes to Live Website';
  }
};

window.downloadPortfolioDataJson = function () {
  const jsonStr = JSON.stringify(currentCMSData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showAdminToast('Downloaded portfolio-data.json! Replace this file in your GitHub repo to deploy.', 'success');
};

// ==========================================================================
// 7. UNLIMITED FILE UPLOADS (INDEXEDDB STORAGE ENGINE)
// ==========================================================================
function initIndexedDB(callback) {
  const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);

  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(INDEXED_DB_STORE)) {
      db.createObjectStore(INDEXED_DB_STORE, { keyPath: 'id' });
    }
  };

  request.onsuccess = (e) => {
    dbInstance = e.target.result;
    if (callback) callback();
  };

  request.onerror = (e) => {
    console.error('IndexedDB error:', e);
    showAdminToast('Could not open high-capacity storage database.', 'error');
  };
}

function initDropzone() {
  const dropzone = document.getElementById('dropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processSelectedFiles(files);
    }
  });
}

window.handleFileSelect = function (e) {
  const files = e.target.files;
  if (files.length > 0) {
    processSelectedFiles(files);
  }
};

function processSelectedFiles(files) {
  if (!dbInstance) {
    showAdminToast('Storage database is initializing. Please retry in a moment.', 'error');
    return;
  }

  let processed = 0;
  showAdminToast(`Processing ${files.length} file(s)...`, 'info');

  Array.from(files).forEach((file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Data = e.target.result;
      const record = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64Data,
        uploadedAt: new Date().toISOString()
      };

      const tx = dbInstance.transaction(INDEXED_DB_STORE, 'readwrite');
      const store = tx.objectStore(INDEXED_DB_STORE);
      store.add(record);

      tx.oncomplete = () => {
        processed++;
        if (processed === files.length) {
          showAdminToast(`Successfully saved ${files.length} file(s) into local storage!`, 'success');
          loadUploadsGallery();
        }
      };

      tx.onerror = () => {
        showAdminToast(`Failed to store "${file.name}".`, 'error');
      };
    };

    reader.readAsDataURL(file);
  });
}

function loadUploadsGallery() {
  const gallery = document.getElementById('uploadsGallery');
  const summary = document.getElementById('uploadsSizeSummary');
  const statCount = document.getElementById('statUploadsCount');
  if (!gallery || !dbInstance) return;

  const tx = dbInstance.transaction(INDEXED_DB_STORE, 'readonly');
  const store = tx.objectStore(INDEXED_DB_STORE);
  const req = store.getAll();

  req.onsuccess = () => {
    const items = req.result || [];
    gallery.innerHTML = '';

    let totalBytes = 0;
    items.forEach((item) => (totalBytes += item.size));

    if (summary) {
      const mb = (totalBytes / (1024 * 1024)).toFixed(2);
      summary.textContent = `${items.length} Files (${mb} MB)`;
    }
    if (statCount) statCount.textContent = items.length;

    if (items.length === 0) {
      gallery.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted); text-align: center; padding: 2rem;">No media files uploaded yet. Drag and drop any image or video above!</p>`;
      return;
    }

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'upload-item-card';

      let mediaHtml = '';
      if (item.type.startsWith('video/')) {
        mediaHtml = `<video class="upload-thumb" src="${item.data}" controls preload="metadata"></video>`;
      } else if (item.type.startsWith('image/')) {
        mediaHtml = `<img class="upload-thumb" src="${item.data}" alt="${escapeHtml(item.name)}">`;
      } else {
        mediaHtml = `<div class="upload-thumb" style="font-size:2rem;color:var(--accent-cyan);"><i class="fa-solid fa-file"></i></div>`;
      }

      const sizeStr = (item.size / 1024 / 1024).toFixed(2) + ' MB';

      card.innerHTML = `
        ${mediaHtml}
        <div class="upload-details">
          <div class="upload-filename" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
          <div class="upload-meta">${sizeStr} â€¢ ${escapeHtml(item.type || 'file')}</div>
          <div class="upload-btn-group">
            <button class="btn-sm-action btn-secondary" onclick="copyDataUrl('${item.id}')">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
            <button class="btn-sm-action btn-danger" onclick="deleteUpload('${item.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;

      gallery.appendChild(card);
    });
  };
}

window.copyDataUrl = function (fileId) {
  if (!dbInstance) return;
  const tx = dbInstance.transaction(INDEXED_DB_STORE, 'readonly');
  const store = tx.objectStore(INDEXED_DB_STORE);
  const req = store.get(fileId);

  req.onsuccess = () => {
    if (req.result && req.result.data) {
      navigator.clipboard
        .writeText(req.result.data)
        .then(() => {
          showAdminToast('File data URL copied to clipboard!', 'success');
        })
        .catch(() => {
          showAdminToast('Could not copy automatically. Check permissions.', 'error');
        });
    }
  };
};

window.deleteUpload = function (fileId) {
  if (!confirm('Are you sure you want to delete this media file?')) return;
  if (!dbInstance) return;

  const tx = dbInstance.transaction(INDEXED_DB_STORE, 'readwrite');
  const store = tx.objectStore(INDEXED_DB_STORE);
  store.delete(fileId);

  tx.oncomplete = () => {
    showAdminToast('Media file deleted.', 'info');
    loadUploadsGallery();
  };
};

window.clearAllUploads = function () {
  if (!confirm('Warning: This will delete ALL uploaded local files. Proceed?')) return;
  if (!dbInstance) return;

  const tx = dbInstance.transaction(INDEXED_DB_STORE, 'readwrite');
  const store = tx.objectStore(INDEXED_DB_STORE);
  store.clear();

  tx.oncomplete = () => {
    showAdminToast('All uploaded media cleared.', 'info');
    loadUploadsGallery();
  };
};

// ==========================================================================
// 8. BACKUP, RESTORE & JSON EXPORT/IMPORT
// ==========================================================================
window.exportJSONBackup = function () {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentCMSData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `veeresh_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showAdminToast('Settings JSON exported successfully!', 'success');
  } catch (err) {
    showAdminToast('Export failed: ' + err.message, 'error');
  }
};

window.handleImportJSON = function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!parsed.hero || !parsed.services || !parsed.works) {
        throw new Error('Invalid portfolio structure in JSON.');
      }
      currentCMSData = parsed;
      saveCMS();
      loadAdminData();
      showAdminToast('Portfolio configuration imported & restored!', 'success');
    } catch (err) {
      showAdminToast('Import error: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
};

window.resetToFactoryDefaults = function () {
  if (
    !confirm('Reset ALL portfolio contents back to original template defaults? Any customizations will be replaced.')
  ) {
    return;
  }
  currentCMSData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  saveCMS();
  loadAdminData();
  showAdminToast('Portfolio restored to initial defaults.', 'info');
};

// ==========================================================================
// 9. TOAST NOTIFICATION UTILITY
// ==========================================================================
function showAdminToast(message, type = 'info') {
  const container = document.getElementById('adminToastBox');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
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
