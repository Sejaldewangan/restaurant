// =========================================
// ÉCLAT - Main Interaction Logic
// =========================================

// Initialize Lucide Icons
lucide.createIcons();

// --- DOM Elements ---
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const openStatus = document.getElementById('open-status');
const statusIndicator = document.querySelector('.status-indicator');
const menuContainer = document.getElementById('menu-container');
const tabBtns = document.querySelectorAll('.tab-btn');
const mobileStickyCta = document.querySelector('.mobile-sticky-cta');

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show mobile sticky CTA after scrolling past hero
  if (window.innerWidth <= 768 && mobileStickyCta) {
    if (window.scrollY > window.innerHeight * 0.5) {
      mobileStickyCta.classList.add('visible');
    } else {
      mobileStickyCta.classList.remove('visible');
    }
  }
});

// --- Mobile Menu Toggle ---
function toggleMenu() {
  mobileMenuOverlay.classList.toggle('active');
  document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);

mobileNavLinks.forEach(link => {
  link.addEventListener('click', toggleMenu);
});

// --- Real-time Open/Closed Status ---
function updateStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = now.getHours();
  
  // Hours: Mon Closed. Tue-Thu 17-22. Fri-Sat 17-23. Sun 17-21.
  let isOpen = false;
  let text = '';
  
  if (day === 1) { // Monday
    text = "Closed Today";
  } else if (day >= 2 && day <= 4) { // Tue-Thu
    if (hour >= 17 && hour < 22) { isOpen = true; text = "Open Now - Closes at 10 PM"; }
    else if (hour < 17) text = "Opening Today at 5:00 PM";
    else text = "Closed - Opens Tomorrow at 5:00 PM";
  } else if (day === 5 || day === 6) { // Fri-Sat
    if (hour >= 17 && hour < 23) { isOpen = true; text = "Open Now - Closes at 11 PM"; }
    else if (hour < 17) text = "Opening Today at 5:00 PM";
    else text = "Closed - Opens Tomorrow at 5:00 PM";
  } else if (day === 0) { // Sunday
    if (hour >= 17 && hour < 21) { isOpen = true; text = "Open Now - Closes at 9:30 PM"; }
    else if (hour < 17) text = "Opening Today at 5:00 PM";
    else text = "Closed - Opens Tuesday at 5:00 PM";
  }

  openStatus.textContent = text;
  if (isOpen) {
    statusIndicator.classList.add('open');
    statusIndicator.classList.remove('closed');
  } else {
    statusIndicator.classList.add('closed');
    statusIndicator.classList.remove('open');
  }
}

updateStatus();
setInterval(updateStatus, 60000); // Check every minute

// --- Menu Data & Rendering ---
const menuData = {
  appetizers: [
    { name: "Tuna Tartare", desc: "Avocado mousse, crispy wonton, ponzu glaze", price: "$28", tags: ["GF"] },
    { name: "Wagyu Carpaccio", desc: "Black truffle, parmigiano reggiano, capers", price: "$34", tags: ["GF"] },
    { name: "Seared Scallops", desc: "Cauliflower purée, golden raisin caper emulsion", price: "$32", tags: ["GF"] },
    { name: "Burrata & Heirloom", desc: "Aged balsamic, basil oil, micro greens", price: "$24", tags: ["V", "GF"] }
  ],
  mains: [
    { name: "A5 Japanese Wagyu", desc: "Charred broccolini, pomme purée, bone marrow jus", price: "$120", tags: ["GF"] },
    { name: "Miso Glazed Black Cod", desc: "Bok choy, dashi broth, lotus root crisp", price: "$52", tags: [] },
    { name: "Duck Breast", desc: "Parsnip silk, cherry gastrique, pistachio crumb", price: "$48", tags: ["GF"] },
    { name: "Wild Mushroom Risotto", desc: "Acquerello rice, shaved black truffle, mascarpone", price: "$42", tags: ["V", "GF"] }
  ],
  desserts: [
    { name: "Dark Chocolate Sphere", desc: "Valrhona chocolate, raspberry coulis, gold leaf", price: "$22", tags: ["V"] },
    { name: "Lemon Basil Tart", desc: "Meyer lemon curd, torched meringue, basil syrup", price: "$18", tags: ["V"] },
    { name: "Vanilla Bean Panna Cotta", desc: "Roasted strawberries, aged balsamic, micro mint", price: "$16", tags: ["GF", "V"] }
  ],
  sommelier: [
    { name: "Opus One 2018", desc: "Napa Valley, Cabernet Blend - Glass", price: "$85", tags: [] },
    { name: "Domaine de la Romanée-Conti", desc: "Burgundy, Pinot Noir - Bottle", price: "$Market", tags: [] },
    { name: "Krug Grande Cuvée", desc: "Champagne - Glass", price: "$65", tags: [] }
  ]
};

function renderMenu(category) {
  const items = menuData[category];
  menuContainer.innerHTML = '';
  
  // Fade out effect
  menuContainer.style.opacity = '0';
  
  setTimeout(() => {
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    
    items.forEach(item => {
      const tagHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      grid.innerHTML += `
        <div class="menu-item">
          <div class="menu-item-header">
            <h3 class="menu-item-title">${item.name} ${item.tags.length ? `<span class="dietary-tags">${tagHtml}</span>` : ''}</h3>
            <span class="menu-item-price">${item.price}</span>
          </div>
          <p class="menu-item-desc">${item.desc}</p>
        </div>
      `;
    });
    
    menuContainer.appendChild(grid);
    // Fade in
    menuContainer.style.transition = 'opacity 0.4s ease';
    menuContainer.style.opacity = '1';
  }, 200);
}

// Initialize Menu
renderMenu('appetizers');

tabBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Remove active class
    tabBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked
    e.target.classList.add('active');
    // Render new category
    renderMenu(e.target.dataset.category);
  });
});

// --- Scroll Animations (Intersection Observer) ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Run once
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});



// For Instagram Grid (Footer)
const instaGrid = document.getElementById('insta-grid');
const instaSources = [
  '/assets/images/food-appetizer.png',
  '/assets/images/food-main.png',
  '/assets/images/food-dessert.png',
  'https://images.unsplash.com/photo-1544025162-8706d911b329?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=400&q=80'
];

instaSources.forEach(src => {
  instaGrid.innerHTML += `
    <a href="#" class="insta-item">
      <img src="${src}" alt="Instagram post" loading="lazy">
      <div class="insta-overlay">
        <i data-lucide="instagram"></i>
      </div>
    </a>
  `;
});
lucide.createIcons(); // Re-init for injected icons

// --- Leaflet Map Init (Dark Mode) ---
const mapContainer = document.getElementById('map');
if (mapContainer && typeof L !== 'undefined') {
  // Manhattan coordinates
  const map = L.map('map', {
    scrollWheelZoom: false
  }).setView([40.725, -74.000], 14);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Custom marker
  L.marker([40.725, -74.000]).addTo(map)
    .bindPopup('<b>ÉCLAT</b><br>42 Rue de la Lumière.')
    .openPopup();
}

// Form submissions (prevent default for demo)
document.getElementById('quick-book-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Redirecting to full reservation system...');
  window.location.href = '#reservations';
});

document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you for your inquiry. Our event team will contact you shortly.');
  e.target.reset();
});
