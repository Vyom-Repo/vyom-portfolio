/* ═══════════════════════════════════════════════════════
   script.js — Portfolio bootstrap
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── AOS (Animate On Scroll) ── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 550,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }


    /* ── Canvas Background System (Neural Network) ── */
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speedMultiplier = prefersReducedMotion ? 0.1 : 1.0;

    // Resize handling
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // App State for background animation
    // 'wait' = signals moving, 'ready' = fully illuminated
    window.appState = 'wait';
    
    // For demonstration, toggle to 'ready' after 5 seconds
    setTimeout(() => {
      window.appState = 'ready';
    }, 5000);

    const blueShades = [
      '10, 132, 255',  // Base Core Blue
      '59, 130, 246',  // Royal Blue
      '96, 165, 250',  // Light Blue
      '147, 197, 253', // Pale Blue
      '14, 165, 233',  // Sky Blue
      '56, 189, 248',  // Vivid Sky Blue
      '125, 211, 252', // Electric Blue
      '0, 191, 255',   // Deep Sky Blue
      '37, 99, 235',   // Medium Blue
      '29, 78, 216'    // Deep Blue
    ];

    const nodes = [];
    const numNodes = 57; // Balanced density per user request
    const connectionDist = 140; // Slightly increased to allow more connections
    
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5 * speedMultiplier,
        vy: (Math.random() - 0.5) * 1.5 * speedMultiplier,
        radius: Math.random() * 1.5 + 1,
        baseAlpha: Math.random() * 0.5 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
        color: blueShades[Math.floor(Math.random() * blueShades.length)]
      });
    }

    const signals = [];

    function createSignal(startNode, endNode) {
       signals.push({
           startNode,
           endNode,
           progress: 0,
           speed: 0.01 + Math.random() * 0.015,
           color: startNode.color
       });
    }

    function animate(time) {
      ctx.clearRect(0, 0, width, height);

      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // Draw connections & generate signals
      for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            // Smooth distance-based falloff
            let opacity = Math.pow(1 - dist / connectionDist, 1.5);
            
            if (window.appState === 'ready') {
              opacity *= 0.5; // Slightly increased glow for lines
            } else {
              opacity *= 0.25; // Brighter during initial load
            }
            
            // Linear gradient for connections between two differently shaded nodes
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `rgba(${nodes[i].color}, ${opacity})`);
            grad.addColorStop(1, `rgba(${nodes[j].color}, ${opacity})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Randomly spawn signals if app is in wait state
            if (window.appState === 'wait' && Math.random() < 0.002) {
              createSignal(nodes[i], nodes[j]);
            }
          }
        }
      }

      // Draw signals
      if (window.appState === 'wait') {
         for (let i = signals.length - 1; i >= 0; i--) {
           const sig = signals[i];
           sig.progress += sig.speed;
           
           if (sig.progress >= 1) {
             signals.splice(i, 1);
             continue;
           }
           
           const sx = sig.startNode.x + (sig.endNode.x - sig.startNode.x) * sig.progress;
           const sy = sig.startNode.y + (sig.endNode.y - sig.startNode.y) * sig.progress;
           
           // Draw signal blip
           ctx.fillStyle = `rgba(${sig.color}, 1)`;
           ctx.beginPath();
           ctx.arc(sx, sy, 2, 0, Math.PI * 2);
           ctx.fill();

           // Glow trail effect
           const trailGradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
           trailGradient.addColorStop(0, `rgba(${sig.color}, 0.8)`);
           trailGradient.addColorStop(1, `rgba(${sig.color}, 0)`);
           ctx.fillStyle = trailGradient;
           ctx.beginPath();
           ctx.arc(sx, sy, 6, 0, Math.PI * 2);
           ctx.fill();
         }
      } else {
          signals.length = 0; // clear signals when ready
      }

      // Draw nodes
      nodes.forEach(node => {
        let alpha = node.baseAlpha + Math.sin(time * 0.002 + node.pulseOffset) * 0.3;
        if (window.appState === 'ready') {
            alpha = Math.min(0.95, alpha + 0.25); // Brighter glow for nodes
        }
        alpha = Math.max(0.1, Math.min(1, alpha));
        
        ctx.fillStyle = `rgba(${node.color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }
  /* ── Lucide Icons ── */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }


  /* ═══════════════════════════════════════════════════
     TYPED.JS — Hero typewriter
     ═══════════════════════════════════════════════════ */
  const typedTarget = document.getElementById('typed-target');

  if (typedTarget && typeof Typed !== 'undefined') {
    new Typed('#typed-target', {
      strings: ['Developer', 'AI/ML Engineer', 'Web Developer', 'Data Enthusiast'],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 1800,
      startDelay: 600,
      loop: true,
      cursorChar: '|',
    });
  }


  /* ═══════════════════════════════════════════════════
     NAVBAR — scroll effect
     ═══════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════
     SMOOTH-SCROLL — anchor click handling
     ═══════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Native smooth scroll
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ═══════════════════════════════════════════════════
     SCROLL-SPY — highlight active nav link
     ═══════════════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[data-section]');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link[data-section]');

  if (sections.length && navLinks.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',  // trigger roughly when section is in upper-middle viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          // Update desktop nav
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === sectionId);
          });

          // Update mobile nav
          mobileLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === sectionId);
          });

          // Contact section background effect
          if (sectionId === 'contact') {
            document.body.classList.add('contact-active');
          } else {
            document.body.classList.remove('contact-active');
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }


  /* ═══════════════════════════════════════════════════
     MOBILE MENU — hamburger toggle
     ═══════════════════════════════════════════════════ */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    const toggleMenu = () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Pause/resume Lenis when menu is open
      if (typeof lenisInstance !== 'undefined' && lenisInstance) {
        isOpen ? lenisInstance.stop() : lenisInstance.start();
      }
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close menu when a mobile link is clicked
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     TIMELINE OBSERVER — highlight points
     ═══════════════════════════════════════════════════ */
  const timelineItems = document.querySelectorAll('.timeline__item');
  if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Toggle 'is-active' based on intersection
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
          } else {
            entry.target.classList.remove('is-active');
          }
        });
      },
      {
        rootMargin: '-30% 0px -40% 0px', // Trigger near center screen
      }
    );

    timelineItems.forEach((item) => timelineObserver.observe(item));
  }

  /* ═══════════════════════════════════════════════════
     CERTIFICATE MODAL
     ═══════════════════════════════════════════════════ */
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certModalClose = document.getElementById('certModalClose');
  const certModalBackdrop = document.getElementById('certModalBackdrop');
  const certBtns = document.querySelectorAll('.exp-item__cert-btn');

  if (certModal && certBtns.length > 0) {
    const openModal = (src) => {
      certModalImg.src = src;
      certModal.classList.add('is-open');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (typeof lenisInstance !== 'undefined' && lenisInstance) lenisInstance.stop();
    };

    const closeModal = () => {
      certModal.classList.remove('is-open');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (typeof lenisInstance !== 'undefined' && lenisInstance) lenisInstance.start();
      setTimeout(() => { certModalImg.src = ''; }, 300);
    };

    certBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-cert-src');
        if (src) openModal(src);
      });
    });

    certModalClose.addEventListener('click', closeModal);
    certModalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /* Projects are now a CSS Grid showcase. No carousel JS needed. */

  /* ═══════════════════════════════════════════════════
     CERTIFICATES CAROUSEL
     ═══════════════════════════════════════════════════ */
  const certsCarousel = document.getElementById('certsCarousel');
  const certScrollLeft = document.getElementById('certScrollLeft');
  const certScrollRight = document.getElementById('certScrollRight');

  if (certsCarousel && certScrollLeft && certScrollRight) {
    const certScrollAmount = 300; // approximate card width + gap
    
    certScrollLeft.addEventListener('click', () => {
      certsCarousel.scrollBy({ left: -certScrollAmount, behavior: 'smooth' });
    });
    
    certScrollRight.addEventListener('click', () => {
      certsCarousel.scrollBy({ left: certScrollAmount, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════
     FOOTER CURRENT YEAR
     ═══════════════════════════════════════════════════ */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }


  /* ── Interaction Manager (Magnetic, Tilt, Glow, Ripples) ── */
  const prefersReducedMotionInteraction = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!prefersReducedMotionInteraction) {
    
    // 1. Magnetic Buttons
    if (!isTouchDevice) {
      const magneticButtons = document.querySelectorAll('.btn-glass, .contact-btn, .exp-item__cert-btn, .cert-card__btn, .projects-nav__btn');
      
      magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          // Subtly translate, max around 8px
          btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0px, 0px)';
        });
      });
    }

    // 2. Cursor-Follow Glow Border
    if (!isTouchDevice) {
      const glassCards = document.querySelectorAll('.glass-card');
      glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });
    }

    // 3. 3D Tilt on Project & Cert Cards
    if (!isTouchDevice) {
      const tiltCards = document.querySelectorAll('.project-card, .cert-card');
      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const xNorm = (x / rect.width) * 2 - 1;
          const yNorm = (y / rect.height) * 2 - 1;
          
          const maxTilt = 6; // degrees
          const rotateX = yNorm * -maxTilt;
          const rotateY = xNorm * maxTilt;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
          
          // Set sheen position
          card.style.setProperty('--sheen-x', `${x}px`);
          card.style.setProperty('--sheen-y', `${y}px`);
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
          card.style.setProperty('--sheen-opacity', '0');
        });

        card.addEventListener('mouseenter', () => {
          card.style.setProperty('--sheen-opacity', '1');
        });
      });
    }

    // 4. Ripple on Click
    const rippleElements = document.querySelectorAll('.btn-glass, .contact-btn, .exp-item__cert-btn, .cert-card__btn, .projects-nav__btn, .project-card, .cert-card');
    
    rippleElements.forEach(el => {
      // Ensure element is relative and hides overflow for ripples
      el.style.position = el.style.position || 'relative';
      el.style.overflow = 'hidden';

      el.addEventListener('click', function(e) {
        const rect = el.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if (clientX === 0 && clientY === 0) {
          clientX = rect.left + rect.width / 2;
          clientY = rect.top + rect.height / 2;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const circle = document.createElement('span');
        circle.classList.add('click-ripple');
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;

        this.appendChild(circle);

        setTimeout(() => {
          circle.remove();
        }, 600);
      });
    });
  }

  /* ── Custom Cursor & Scroll Progress ── */
  if (!isTouchDevice && !prefersReducedMotionInteraction) {
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    
    // Set initial position off-screen
    let curX = -100, curY = -100;
    let tgX = -100, tgY = -100;

    window.addEventListener('mousemove', (e) => {
      tgX = e.clientX;
      tgY = e.clientY;
      // Dot follows instantly
      if (cursorDot) {
        cursorDot.style.transform = `translate(${tgX}px, ${tgY}px)`;
      }
    });

    // Outline follows with lag
    function animateCursor() {
      curX += (tgX - curX) * 0.15; // spring ease
      curY += (tgY - curY) * 0.15;
      if (cursorOutline) {
        cursorOutline.style.transform = `translate(${curX}px, ${curY}px)`;
      }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      scrollProgress.style.transform = `scaleX(${scrolled})`;
    });
  }

});
