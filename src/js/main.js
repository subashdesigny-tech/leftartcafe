import { triggerConfetti } from './confetti.js';
import { initCanvasSketch } from './canvas-sketch.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize canvas sketch scroll coloring
  initCanvasSketch();

  // Initialize cursor follower
  initCursorFollower();

  // Scroll reveals (Progressive Disclosure)
  initScrollReveals();

  // Header sticky scroll & active indicators
  initHeaderScroll();

  // Demographics expanding modals
  initDemographicsDetails();

  // Experience tabs selection
  initExperienceTabs();

  // Featured experiences & details drawer
  initFeaturedExperiences();

  // E-commerce Shop & Cart system
  initShopCart();

  // Happy Coloring sheet downloads
  initHappyColoring();

  // Masonry gallery lightbox
  initGalleryLightbox();

  // Reviews slider
  initReviewsSlider();

  // FAQ Accordion
  initFaqAccordion();

  // Booking Flow modal wizard
  initBookingWizard();
});

/* 1. Custom Wax Crayon Cursor & Texture Hover Trail */
function initCursorFollower() {
  // Only initialize custom cursor on devices that support hover (desktops)
  const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasPointer) return;

  // Create Custom Crayon Cursor
  const cursorContainer = document.createElement('div');
  cursorContainer.classList.add('crayon-cursor');
  // Tip is pointing down-left to (0, 40)
  cursorContainer.innerHTML = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Crayon wax tip (Triangle) -->
      <path d="M 0 40 L 6 26 L 14 34 Z" class="crayon-tip-fill" fill="#FF8A65" />
      <!-- Crayon body (Rectangle) -->
      <path d="M 8 24 L 22 10 L 30 18 L 16 32 Z" class="crayon-body-fill" fill="#FF4081" />
      <!-- Crayon cap (Rounded Cap) -->
      <path d="M 24 8 L 28 4 A 5.65 5.65 0 0 1 36 12 L 32 16 Z" class="crayon-cap-fill" fill="#FF4081" />
    </svg>
  `;
  document.body.appendChild(cursorContainer);

  // Create Crayon Trail Drawing Canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'crayon-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9998'; // Just below header/cursor, above regular content
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Rainbow Palette of Crayon Colors (matches brand theme colors)
  const colors = [
    { main: '#FF4081', tip: '#FF8A65' }, // Pink
    { main: '#6D5B97', tip: '#8A7BB3' }, // Purple
    { main: '#FF8A65', tip: '#FFAB91' }, // Orange
    { main: '#4FC3F7', tip: '#81D4FA' }, // Blue
    { main: '#81C784', tip: '#A5D6A7' }, // Green
    { main: '#FFD54F', tip: '#FFE082' }  // Yellow
  ];
  let currentColorIndex = 0;

  // Track state
  let mouseX = 0, mouseY = 0;
  let prevMouseX = 0, prevMouseY = 0;
  let active = false;
  let isHovering = false;
  const trailSegments = [];

  // Cycle crayon color and update SVG fills
  function cycleCrayonColor() {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    const current = colors[currentColorIndex];
    
    const bodyPath = cursorContainer.querySelector('.crayon-body-fill');
    const tipPath = cursorContainer.querySelector('.crayon-tip-fill');
    const capPath = cursorContainer.querySelector('.crayon-cap-fill');
    if (bodyPath) bodyPath.setAttribute('fill', current.main);
    if (tipPath) tipPath.setAttribute('fill', current.tip);
    if (capPath) capPath.setAttribute('fill', current.main);
  }

  // Mouse Move Event Listener
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!active) {
      cursorContainer.classList.add('active');
      active = true;
    }

    // Set position directly for snappy cursor feel
    cursorContainer.style.left = `${mouseX}px`;
    cursorContainer.style.top = `${mouseY}px`;

    // Draw textured crayon line only when hovering over interactive elements
    if (isHovering && prevMouseX !== 0 && prevMouseY !== 0) {
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1.5) {
        trailSegments.push({
          x1: prevMouseX,
          y1: prevMouseY,
          x2: mouseX,
          y2: mouseY,
          color: colors[currentColorIndex].main,
          life: 100,
          maxLife: 100,
          width: Math.random() * 2 + 5 // Brush thickness
        });
      }
    }

    prevMouseX = mouseX;
    prevMouseY = mouseY;
  });

  // Hide custom cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursorContainer.classList.remove('active');
    active = false;
    prevMouseX = 0;
    prevMouseY = 0;
  });

  // Event Delegation for hover status
  const hoverSelector = 'a, button, .demo-card, .product-card, .gallery-item, .faq-header, .wizard-option-card, .sheet-option, .social-links a, .btn-cart, .btn-book-workshop';
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverSelector);
    if (target) {
      if (!isHovering) {
        isHovering = true;
        cursorContainer.classList.add('hovering');
        cycleCrayonColor(); // change color on each hover
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverSelector);
    if (target) {
      if (!e.relatedTarget || !target.contains(e.relatedTarget)) {
        isHovering = false;
        cursorContainer.classList.remove('hovering');
      }
    }
  });

  // Clicking Animation
  document.addEventListener('mousedown', () => {
    cursorContainer.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    cursorContainer.classList.remove('clicking');
  });

  // Crayon texture rendering helper
  function drawCrayonSegment(ctx, x1, y1, x2, y2, color, size, alpha) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(len / 1.5));
    
    // Parse hex color into RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = x1 + dx * t;
      const cy = y1 + dy * t;

      // Create grainy texture by scattering semi-transparent tiny dots
      const particleCount = Math.floor(size * 1.5);
      for (let j = 0; j < particleCount; j++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * (size / 2);
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;

        ctx.beginPath();
        // Tiny grainy waxy dot
        ctx.arc(px, py, Math.random() * 0.7 + 0.3, 0, Math.PI * 2);
        
        // Crayon texture transparency variation
        const randAlpha = alpha * (Math.random() * 0.45 + 0.25);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${randAlpha})`;
        ctx.fill();
      }
    }
  }

  // Main Canvas Render Loop
  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = trailSegments.length - 1; i >= 0; i--) {
      const seg = trailSegments[i];
      seg.life -= 1.2; // Slow fade out

      if (seg.life <= 0) {
        trailSegments.splice(i, 1);
        continue;
      }

      const alpha = seg.life / seg.maxLife;
      drawCrayonSegment(ctx, seg.x1, seg.y1, seg.x2, seg.y2, seg.color, seg.width, alpha);
    }

    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

/* 2. Scroll Reveals (Progressive Disclosure) */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* 3. Header Sticky Scroll */
function initHeaderScroll() {
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Nav active tab highlight on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

/* 4. Demographics modal detail expansions */
const demoDetailsData = {
  kids: {
    title: "Art Experiences for Kids",
    subtitle: "Ages 4-12 | Playful, messy, and creative learning",
    content: "Our kids workshops focus on letting children explore colors, shapes, and textures without boundaries. We promote hand-eye coordination, emotional expression, and cognitive growth using non-toxic premium paints and recycled media.",
    list: [
      "Paint & Play messy sensory zones",
      "Fridge magnet and wooden canvas paintings",
      "Take-home certificates and 'Creative Champion' medals",
      "Weekend parent-and-child collaborative paint jams"
    ]
  },
  adults: {
    title: "Creative Sessions for Adults",
    subtitle: "Unwind, reconnect, and paint your mind",
    content: "No prior experience needed. We provide premium canvases, easels, and guidance to help you escape the digital noise. Learn acrylic blending, texture pasting, and fluid pouring in a relaxed social environment.",
    list: [
      "Weekend Paint & Sip evenings",
      "Palette knife texture painting workshops",
      "Canvas portrait painting for beginners",
      "Mindful water-coloring stress relief sessions"
    ]
  },
  families: {
    title: "Family Art Collaborations",
    subtitle: "Make memories together, one brush stroke at a time",
    content: "Bond with your loved ones through shared artistic projects. Work on large modular canvases where every family member paints a section, creating a singular beautiful artwork for your living room wall.",
    list: [
      "Modular family canvas painting",
      "Clay plate decoration and painting",
      "Handprint tree memory canvases",
      "Festive and holiday themed workshops"
    ]
  },
  corporate: {
    title: "Corporate Team Experiences",
    subtitle: "Stress relief and collaborative team building through art",
    content: "Boost employee morale and reduce screen fatigue with hands-on painting. We organize large-scale collective murals, team building challenges, and relaxing individual canvas sessions designed for corporate environments.",
    list: [
      "Big picture giant collective canvas puzzles",
      "Desktop planter painting and team bonding",
      "De-stress fluid art therapy workshops",
      "Custom gifting cards and premium stationery packages"
    ]
  },
  schools: {
    title: "School Creative Partnerships",
    subtitle: "Enriching curriculum with premium tactile art days",
    content: "We bring Left Art Cafe directly to schools, holiday camps, and creative clubs. Our structured activities fit into art education curriculums and promote collaborative design thinking, self-confidence, and teamwork.",
    list: [
      "Art Competition curation and setup",
      "School Annual Day themed decorations and banners",
      "Creative holiday camp modules",
      "Teacher training creative workshops"
    ]
  },
  seniors: {
    title: "Art For Senior Citizens",
    subtitle: "Gentle, mindful, and rewarding creative interactions",
    content: "We focus on tactile coordination and joyful engagement in a warm social format. Painting offers tremendous therapeutic benefits, improves cognitive focus, and provides a platform to socialize and share stories.",
    list: [
      "Gentle water-colors and color blending",
      "Easy MDF and wood coaster painting",
      "Memory jar and nostalgic journaling",
      "Relaxing afternoon social paint cafe sessions"
    ]
  }
};

function initDemographicsDetails() {
  const cards = document.querySelectorAll('.demo-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-type');
      const data = demoDetailsData[type];
      if (data) {
        openDetailsModal(data);
      }
    });
  });
}

function openDetailsModal(data) {
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  
  const box = document.createElement('div');
  box.classList.add('modal-box', 'details-box');
  
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-close-btn');
  closeBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
  
  let listItemsHTML = '';
  data.list.forEach(item => {
    listItemsHTML += `<li>${item}</li>`;
  });

  box.innerHTML = `
    <h2>${data.title}</h2>
    <div class="details-box-meta">${data.subtitle}</div>
    <div class="details-box-content">
      <p style="margin-bottom: 20px;">${data.content}</p>
      <h4 style="font-family: var(--font-sans); font-size: 1.1rem; margin-bottom: 12px; font-weight: 600;">Highlights:</h4>
      <ul style="list-style: none; margin-bottom: 30px;">
        ${listItemsHTML.replace(/<li>/g, '<li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--color-pink);">✦</span> ')}
      </ul>
      <div style="display: flex; gap: 12px;">
        <button class="btn btn-primary btn-modal-book" data-title="${data.title}">Book This Experience</button>
        <button class="btn btn-secondary btn-modal-close">Close</button>
      </div>
    `;
  
  box.appendChild(closeBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('open');
  }, 10);

  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  };

  closeBtn.addEventListener('click', close);
  box.querySelector('.btn-modal-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  box.querySelector('.btn-modal-book').addEventListener('click', () => {
    close();
    openBookingModal(data.title);
  });
}

/* 5. Experience Tabs Selection */
function initExperienceTabs() {
  const btns = document.querySelectorAll('.experience-tab-btn');
  const contents = document.querySelectorAll('.experience-tab-content');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      
      btns.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`exp-tab-${target}`).classList.add('active');
    });
  });
}

/* 6. Featured Experiences Detail drawer / modals */
const featuredData = {
  coloring: {
    title: "Happy Coloring Kit",
    age: "Ages 3+",
    difficulty: "Easy",
    diffClass: "easy",
    duration: "2-3 Hours",
    included: "Large thematic coloring sheet (paper/canvas), 12 non-toxic crayons/colors, sticker packs, creative medal",
    desc: "A stress-free coloring collection representing cozy themes. Excellent for building finger dexterity and color association in toddlers, or simple relaxing doodles for adults."
  },
  paintplay: {
    title: "Paint & Play Kit",
    age: "Ages 4+",
    difficulty: "Easy",
    diffClass: "easy",
    duration: "1.5 Hours",
    included: "4 eco-friendly wooden toys, 6 primary acrylic pots, 2 brush types, coloring instruction cards",
    desc: "Paint 3D objects! Kids get to color customized wooden cars, houses, and animals, giving them tactile toys they made with their own hands."
  },
  photoframe: {
    title: "Photo Frame Painting Kit",
    age: "Ages 6+",
    difficulty: "Medium",
    diffClass: "medium",
    duration: "2 Hours",
    included: "1 premium MDF photo frame, 8 premium colors, gem sticker sheets, glue tube, texture paste",
    desc: "Create a customized memory. Paint and paste glitters or patterns on an elegant wooden photo frame. Ideal as a birthday or holiday gifting activity."
  },
  fridge: {
    title: "Fridge Magnet Kit",
    age: "Ages 5+",
    difficulty: "Easy",
    diffClass: "easy",
    duration: "1.5 Hours",
    included: "6 mini MDF boards with pre-applied magnets, 8 custom color pots, 2 brushes, storage box",
    desc: "Make your kitchen beautiful. Paint cute illustrations of coffee mugs, cookies, and positive quotes. Stick them proudly on your fridge!"
  },
  canvas: {
    title: "Canvas Portrait Experience",
    age: "Ages 12+",
    difficulty: "Advanced",
    diffClass: "advanced",
    duration: "3-4 Hours",
    included: "1 premium cotton stretched canvas (10x12), 12 rich pigment acrylic tubes, paint palette, 3 brushes, table easel, step-by-step tutorial guide",
    desc: "Learn real painting techniques. Step into the shoes of a studio painter and build an elegant canvas artwork from scratch with our professional guide."
  },
  journal: {
    title: "Journal Kit",
    age: "Ages 10+",
    difficulty: "Medium",
    diffClass: "medium",
    duration: "2-3 Hours",
    included: "1 linen-bound dotted notebook, 3 sticker sheets, 2 rolls of custom tape, 4 dual-tip markers, stamp pad",
    desc: "Start visual scrapbooking. Mix writing, doodle painting, and scrap tape to create stunning aesthetic planners and self-reflection journals."
  }
};

function initFeaturedExperiences() {
  const cards = document.querySelectorAll('.featured-card');
  cards.forEach(card => {
    const btnDetails = card.querySelector('.btn-feat-details');
    const btnBook = card.querySelector('.btn-feat-book');
    const type = card.getAttribute('data-type');
    const data = featuredData[type];

    if (data) {
      if (btnDetails) {
        btnDetails.addEventListener('click', () => {
          openFeaturedDetailsModal(data);
        });
      }
      if (btnBook) {
        btnBook.addEventListener('click', () => {
          openBookingModal(data.title);
        });
      }
    }
  });
}

function openFeaturedDetailsModal(data) {
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  
  const box = document.createElement('div');
  box.classList.add('modal-box', 'details-box');
  
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-close-btn');
  closeBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

  box.innerHTML = `
    <h2>${data.title}</h2>
    <div class="details-box-meta">
      <span class="feat-difficulty ${data.diffClass}" style="position: static; margin-right: 8px;">${data.difficulty}</span>
      <span>${data.age}</span> • <span>${data.duration}</span>
    </div>
    
    <div class="details-tabs">
      <div class="details-tab-nav">
        <button class="details-tab-btn active" data-tab="about">About Experience</button>
        <button class="details-tab-btn" data-tab="included">What's Included</button>
        <button class="details-tab-btn" data-tab="reviews">Reviews</button>
      </div>
      
      <div class="details-tab-pane active" id="feat-tab-about">
        <p>${data.desc}</p>
      </div>
      
      <div class="details-tab-pane" id="feat-tab-included">
        <p style="font-weight: 600; margin-bottom: 8px;">Inside your creative pack:</p>
        <p>${data.included}</p>
      </div>
      
      <div class="details-tab-pane" id="feat-tab-reviews">
        <div style="margin-bottom: 12px; font-weight: 600; color: var(--color-purple);">★★★★★ 5.0 Rating</div>
        <p style="font-style: italic; font-size: 0.9rem;">"My kids and I spent a cozy Saturday afternoon painting the fridge magnets. The packaging and colors are premium and feel very satisfying!" - Sarah M.</p>
      </div>
    </div>
    
    <div style="display: flex; gap: 12px;">
      <button class="btn btn-primary btn-modal-book" data-title="${data.title}">Book Experience</button>
      <button class="btn btn-secondary btn-modal-close">Close</button>
    </div>
  `;

  box.appendChild(closeBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('open');
  }, 10);

  // Tab switching logic inside modal
  const tabBtns = box.querySelectorAll('.details-tab-btn');
  const tabPanes = box.querySelectorAll('.details-tab-pane');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      box.querySelector(`#feat-tab-${tabId}`).classList.add('active');
    });
  });

  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  };

  closeBtn.addEventListener('click', close);
  box.querySelector('.btn-modal-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  box.querySelector('.btn-modal-book').addEventListener('click', () => {
    close();
    openBookingModal(data.title);
  });
}

/* 7. E-commerce Shop & Cart system */
let cart = [];

const shopProducts = {
  kit1: { id: "kit1", title: "Happy Coloring Kit", price: 18.00, imgCode: "coloring" },
  kit2: { id: "kit2", title: "Paint & Play Kit", price: 24.00, imgCode: "paintplay" },
  kit3: { id: "kit3", title: "Fridge Magnet Kit", price: 16.00, imgCode: "fridge" },
  kit4: { id: "kit4", title: "Canvas Portrait Kit", price: 32.00, imgCode: "canvas" }
};

function initShopCart() {
  const cartBtn = document.querySelector('.btn-cart');
  const cartDrawer = document.getElementById('cart-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const closeCartBtn = document.querySelector('.btn-close-cart');
  const checkoutBtn = document.querySelector('.btn-checkout');

  // Toggle Drawer
  const openCart = () => {
    cartDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
  };

  const closeCart = () => {
    cartDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
  };

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeCart);

  // Add to cart listeners
  const addBtns = document.querySelectorAll('.btn-add-cart');
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodId = btn.getAttribute('data-id');
      const product = shopProducts[prodId];
      if (product) {
        addToCart(product);
        openCart();
      }
    });
  });

  // Checkout Success
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      closeCart();
      
      // Simulate success screen
      openCheckoutSuccessModal();
    });
  }
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const cartBadge = document.querySelector('.cart-count');
  const cartItemsList = document.querySelector('.cart-items-list');
  const cartTotalPrice = document.querySelector('.cart-total-price');

  // Calculate totals
  let totalCount = 0;
  let totalPrice = 0;
  let itemsHTML = '';

  cart.forEach(item => {
    totalCount += item.qty;
    totalPrice += item.price * item.qty;

    itemsHTML += `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <svg viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#EAEBF0"/>
            <circle cx="50" cy="50" r="30" fill="var(--color-pink)" opacity="0.3"/>
            <path d="M40 60 L60 60 L50 40 Z" fill="var(--color-purple)" />
          </svg>
        </div>
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `;
  });

  if (cartBadge) {
    cartBadge.textContent = totalCount;
    cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  if (cartItemsList) {
    if (cart.length === 0) {
      cartItemsList.innerHTML = `<div style="text-align:center; padding: 40px 0; color: var(--color-gray);">Your cart is empty. Pick a DIY Kit to start!</div>`;
    } else {
      cartItemsList.innerHTML = itemsHTML;
    }
  }

  if (cartTotalPrice) {
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  }

  // Bind Qty adjusters
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty += 1;
        updateCartUI();
      }
    });
  });

  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const itemIndex = cart.findIndex(i => i.id === id);
      if (itemIndex > -1) {
        if (cart[itemIndex].qty > 1) {
          cart[itemIndex].qty -= 1;
        } else {
          cart.splice(itemIndex, 1);
        }
        updateCartUI();
      }
    });
  });
}

function openCheckoutSuccessModal() {
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  
  const box = document.createElement('div');
  box.classList.add('modal-box', 'details-box');

  box.innerHTML = `
    <div class="success-pane">
      <div class="success-icon-box">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>
      <h2>Creativity Awaits!</h2>
      <p style="margin-bottom: 24px; font-size:1.1rem;">Your DIY Kit order was completed successfully. We are packaging your box with premium materials and custom doodles. Expect delivery details via email!</p>
      <button class="btn btn-primary btn-success-ok">Keep Exploring</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('open');
    triggerConfetti();
  }, 10);

  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => {
      document.body.removeChild(overlay);
      cart = [];
      updateCartUI();
    }, 300);
  };

  box.querySelector('.btn-success-ok').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

/* 8. Happy Coloring sheet downloads */
const coloringSheets = {
  sheet1: `
    <svg viewBox="0 0 100 100">
      <rect width="100" height="100" fill="none" stroke="#2D2A2E" stroke-width="2"/>
      <circle cx="50" cy="40" r="18" fill="none" stroke="#2D2A2E" stroke-width="1.5"/>
      <path d="M20 75 Q40 50 50 62 T80 75" fill="none" stroke="#2D2A2E" stroke-width="1.5"/>
      <path d="M50 40 L50 90" fill="none" stroke="#2D2A2E" stroke-width="1" stroke-dasharray="2 2"/>
    </svg>
  `,
  sheet2: `
    <svg viewBox="0 0 100 100">
      <rect width="100" height="100" fill="none" stroke="#2D2A2E" stroke-width="2"/>
      <path d="M15 80 L85 80" stroke="#2D2A2E" stroke-width="2"/>
      <rect x="35" y="30" width="30" height="40" fill="none" stroke="#2D2A2E" stroke-width="1.5"/>
      <line x1="30" y1="70" x2="35" y2="30" stroke="#2D2A2E" stroke-width="1.5" />
      <line x1="70" y1="70" x2="65" y2="30" stroke="#2D2A2E" stroke-width="1.5" />
      <path d="M40 45 C42 40, 58 40, 60 45 Q50 65 40 45" fill="none" stroke="#2D2A2E" stroke-width="1"/>
    </svg>
  `,
  sheet3: `
    <svg viewBox="0 0 100 100">
      <rect width="100" height="100" fill="none" stroke="#2D2A2E" stroke-width="2"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#2D2A2E" stroke-width="1.5" stroke-dasharray="3 2"/>
      <circle cx="50" cy="50" r="10" fill="none" stroke="#2D2A2E" stroke-width="1.5"/>
      <!-- Petals -->
      <path d="M50 20 C42 20 42 40 50 40 C58 40 58 20 50 20" fill="none" stroke="#2D2A2E" stroke-width="1.2"/>
      <path d="M50 60 C42 60 42 80 50 80 C58 80 58 60 50 60" fill="none" stroke="#2D2A2E" stroke-width="1.2"/>
      <path d="M20 50 C20 42 40 42 40 50 C40 58 20 58 20 50" fill="none" stroke="#2D2A2E" stroke-width="1.2"/>
      <path d="M60 50 C60 42 80 42 80 50 C80 58 60 58 60 50" fill="none" stroke="#2D2A2E" stroke-width="1.2"/>
    </svg>
  `
};

function initHappyColoring() {
  const options = document.querySelectorAll('.sheet-option');
  const previewBox = document.getElementById('sheet-preview-canvas');
  const downloadBtn = document.querySelector('.btn-download-sheet');

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const sheetId = opt.getAttribute('data-id');
      const svgMarkup = coloringSheets[sheetId];
      if (previewBox && svgMarkup) {
        previewBox.innerHTML = svgMarkup;
      }
    });
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Simulate sheet download
      alert("✦ Custom coloring sheet downloaded! Print and start coloring your happiness.");
      triggerConfetti();
    });
  }
}

/* 9. Masonry gallery lightbox */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const imgSvg = item.querySelector('svg').outerHTML;
      const title = item.querySelector('.gallery-hover-overlay p').textContent;
      
      const overlay = document.createElement('div');
      overlay.classList.add('modal-overlay');
      
      const box = document.createElement('div');
      box.classList.add('modal-box');
      box.style.maxWidth = '700px';
      box.style.background = 'transparent';
      box.style.boxShadow = 'none';

      const closeBtn = document.createElement('button');
      closeBtn.classList.add('modal-close-btn');
      closeBtn.style.color = '#fff';
      closeBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

      box.innerHTML = `
        <div style="background:#fff; padding:15px; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
          <div style="aspect-ratio:1.2/1; border-radius: var(--radius-md); overflow:hidden; background:#FAF8F5; margin-bottom:15px;">
            ${imgSvg}
          </div>
          <h3 style="font-family: var(--font-serif); font-size:1.6rem; font-style:italic; text-align:center;">${title}</h3>
        </div>
      `;

      box.appendChild(closeBtn);
      overlay.appendChild(box);
      document.body.appendChild(overlay);

      setTimeout(() => {
        overlay.classList.add('open');
      }, 10);

      const close = () => {
        overlay.classList.remove('open');
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 300);
      };

      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
    });
  });
}

/* 10. Reviews slider */
function initReviewsSlider() {
  const track = document.getElementById('reviews-track');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.querySelector('.review-prev');
  const nextBtn = document.querySelector('.review-next');

  if (!track || slides.length === 0) return;

  let index = 0;

  const updateSlide = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      updateSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      updateSlide();
    });
  }
}

/* 11. FAQ Accordion */
function initFaqAccordion() {
  const headers = document.querySelectorAll('.faq-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      
      const isActive = item.classList.contains('active');

      // Close all faq items first
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* 12. Booking Flow Modal Wizard */
let selectedBookingPackage = "";

function initBookingWizard() {
  // Bind CTA book triggers
  const bookCTAs = document.querySelectorAll('.btn-book-workshop');
  bookCTAs.forEach(cta => {
    cta.addEventListener('click', () => {
      const pkg = cta.getAttribute('data-package') || "";
      openBookingModal(pkg);
    });
  });
}

export function openBookingModal(initialPackage = "") {
  selectedBookingPackage = initialPackage;
  
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  
  const box = document.createElement('div');
  box.classList.add('modal-box');
  
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-close-btn');
  closeBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

  box.innerHTML = `
    <div class="booking-wizard">
      <h2>Book Art Experience</h2>
      <p style="color: var(--color-gray); font-size: 0.95rem; margin-bottom: 20px;">Complete 3 steps to reserve your spot.</p>
      
      <div class="wizard-steps-indicator">
        <div class="wizard-dot active" id="dot-step-1"></div>
        <div class="wizard-dot" id="dot-step-2"></div>
        <div class="wizard-dot" id="dot-step-3"></div>
      </div>

      <!-- STEP 1: Select Experience -->
      <div class="wizard-panel active" id="pane-step-1">
        <h3>1. Select Workshop/Experience</h3>
        <div class="wizard-cards-grid">
          <div class="wizard-option-card ${selectedBookingPackage.includes('Coloring') ? 'selected' : ''}" data-value="Happy Coloring Kit">
            <h4 style="font-family:var(--font-sans); font-weight:600; margin-bottom:8px;">Happy Coloring Kit</h4>
            <p style="font-size:0.8rem; color:var(--color-gray)">Ages 3+ • Mindful coloring sheets and pencils</p>
          </div>
          <div class="wizard-option-card ${selectedBookingPackage.includes('Play') ? 'selected' : ''}" data-value="Paint & Play Kit">
            <h4 style="font-family:var(--font-sans); font-weight:600; margin-bottom:8px;">Paint & Play Kit</h4>
            <p style="font-size:0.8rem; color:var(--color-gray)">Ages 4+ • Painting wooden custom toys</p>
          </div>
          <div class="wizard-option-card ${selectedBookingPackage.includes('Portrait') ? 'selected' : ''}" data-value="Canvas Portrait Experience">
            <h4 style="font-family:var(--font-sans); font-weight:600; margin-bottom:8px;">Canvas Portrait</h4>
            <p style="font-size:0.8rem; color:var(--color-gray)">Ages 12+ • Stretched canvas studio paint</p>
          </div>
          <div class="wizard-option-card ${selectedBookingPackage.includes('Corporate') ? 'selected' : ''}" data-value="Corporate Workshop">
            <h4 style="font-family:var(--font-sans); font-weight:600; margin-bottom:8px;">Corporate Workshop</h4>
            <p style="font-size:0.8rem; color:var(--color-gray)">Teams • De-stress mural paint session</p>
          </div>
        </div>
      </div>

      <!-- STEP 2: Custom details -->
      <div class="wizard-panel" id="pane-step-2">
        <h3>2. Schedule & Attendees</h3>
        <div class="form-group">
          <label>Select Date</label>
          <input type="date" class="form-input" id="booking-date" value="2026-07-25">
        </div>
        <div class="form-group">
          <label>Number of Participants</label>
          <select class="form-input" id="booking-participants">
            <option>1 Participant</option>
            <option selected>2 Participants</option>
            <option>3 Participants</option>
            <option>4 Participants</option>
            <option>5+ Participants</option>
          </select>
        </div>
      </div>

      <!-- STEP 3: Contact & Complete -->
      <div class="wizard-panel" id="pane-step-3">
        <h3>3. Contact Information</h3>
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" class="form-input" id="booking-name" placeholder="John Doe">
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" class="form-input" id="booking-email" placeholder="john@example.com">
        </div>
        <div class="form-group">
          <label>WhatsApp Number</label>
          <input type="tel" class="form-input" id="booking-phone" placeholder="+1 (555) 000-0000">
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="wizard-nav">
        <button class="btn btn-secondary btn-wizard-back" style="visibility: hidden;">Back</button>
        <button class="btn btn-primary btn-wizard-next">Next Step</button>
      </div>
    </div>
  `;

  box.appendChild(closeBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('open');
  }, 10);

  // Selector cards bind
  const optionCards = box.querySelectorAll('.wizard-option-card');
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      optionCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedBookingPackage = card.getAttribute('data-value');
    });
  });

  // Steps controller
  let currentStep = 1;
  const backBtn = box.querySelector('.btn-wizard-back');
  const nextBtn = box.querySelector('.btn-wizard-next');

  const showStep = (step) => {
    box.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
    box.querySelectorAll('.wizard-dot').forEach(d => d.classList.remove('active'));
    
    box.querySelector(`#pane-step-${step}`).classList.add('active');
    
    for (let i = 1; i <= step; i++) {
      box.querySelector(`#dot-step-${i}`).classList.add('active');
    }

    backBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    nextBtn.textContent = step === 3 ? 'Confirm Booking' : 'Next Step';
  };

  nextBtn.addEventListener('click', () => {
    if (currentStep < 3) {
      // Validate step 1 selection
      if (currentStep === 1 && !selectedBookingPackage) {
        alert("Please pick a workshop option first!");
        return;
      }
      currentStep++;
      showStep(currentStep);
    } else {
      // Step 3 Confirmation - validate contacts
      const name = box.querySelector('#booking-name').value;
      const email = box.querySelector('#booking-email').value;
      
      if (!name || !email) {
        alert("Please fill in your name and email.");
        return;
      }

      // Successful Booking!
      overlay.classList.remove('open');
      setTimeout(() => {
        document.body.removeChild(overlay);
        openBookingSuccessModal();
      }, 300);
    }
  });

  backBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

function openBookingSuccessModal() {
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  
  const box = document.createElement('div');
  box.classList.add('modal-box', 'details-box');

  box.innerHTML = `
    <div class="success-pane">
      <div class="success-icon-box">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>
      <h2>Happiness Reserved!</h2>
      <p style="margin-bottom: 24px; font-size:1.1rem;">Your creative workshop has been reserved. A confirmation email and WhatsApp message details are headed your way!</p>
      <button class="btn btn-primary btn-success-ok">Excellent</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('open');
    triggerConfetti();
  }, 10);

  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  };

  box.querySelector('.btn-success-ok').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}
