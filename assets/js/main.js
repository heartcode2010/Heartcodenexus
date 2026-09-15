/* ========================================
   HEARTCODE NEXUS — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Header Scroll Effect ----
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ---- Mobile Menu ----
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.mobile-overlay');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close menu on link click
    navLinks.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Mobile Dropdown Toggle ----
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('mobile-open');
        }
      });
    }
  });

  // ---- Accordion ----
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all accordion items in the same accordion
        const accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
          });
        }

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-count]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = prefix + target.toLocaleString() + suffix;
          }
        };

        updateCounter();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ---- Typing Effect (Hero) ----
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const words = JSON.parse(typingEl.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];
      
      if (isWaiting) return;

      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500;
      }

      setTimeout(typeEffect, speed);
    }

    typeEffect();
  }

  // ---- Scroll to Top ----
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simple validation
      let isValid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--accent-red)';
        } else {
          field.style.borderColor = '';
        }
      });

      if (isValid) {
        // Show success message
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = 'var(--accent-green)';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }
    });
  }

  // ---- Testimonials Auto-scroll ----
  const testimonialTrack = document.querySelector('.testimonials-track');
  if (testimonialTrack) {
    let scrollAmount = 0;
    let scrollDirection = 1;
    
    function autoScrollTestimonials() {
      if (!testimonialTrack.matches(':hover')) {
        scrollAmount += scrollDirection;
        testimonialTrack.scrollLeft = scrollAmount;
        
        if (scrollAmount >= testimonialTrack.scrollWidth - testimonialTrack.clientWidth) {
          scrollDirection = -1;
        } else if (scrollAmount <= 0) {
          scrollDirection = 1;
        }
      }
      requestAnimationFrame(autoScrollTestimonials);
    }

    // Only auto-scroll on desktop
    if (window.innerWidth > 768) {
      setTimeout(autoScrollTestimonials, 2000);
    }
  }

  // ---- Active Nav Link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || href === './' + currentPage) {
      link.classList.add('active');
    }
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- CEO Typewriter Effect ----
  const ceoTypingEl = document.querySelector('.ceo-typing-text');
  if (ceoTypingEl) {
    const ceoRoles = [
      "Full-Stack Web Developer",
      "AI Developer",
      "Automation Expert",
      "Mobile Developer",
      "UI/UX Enthusiast",
      "Digital Marketer",
      "Freelancer",
      "Visionary Writer",
      "Online Tutor"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeletingRole = false;

    function ceoTypeEffect() {
      const currentRole = ceoRoles[roleIdx];
      
      if (isDeletingRole) {
        ceoTypingEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        ceoTypingEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeletingRole ? 40 : 80;

      if (!isDeletingRole && charIdx === currentRole.length) {
        speed = 2200; // Pause at full word
        isDeletingRole = true;
      } else if (isDeletingRole && charIdx === 0) {
        isDeletingRole = false;
        roleIdx = (roleIdx + 1) % ceoRoles.length;
        speed = 400;
      }

      setTimeout(ceoTypeEffect, speed);
    }

    ceoTypeEffect();
  }

  // ---- Interactive Mouse Spotlight Glow on Cards ----
  const glowCards = document.querySelectorAll(
    '.service-card, .program-card, .feature-card, .value-card, .stat-box, .skill-card, .glass-card, .level-card, .event-card, .blog-card, .card, .ceo-image-card, .partner-logo-box'
  );
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ---- Dynamic Interactive Heartcode Nexus Particle Canvas ----
  (function initParticleCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cyber-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let width, height, particles;
    let mouse = { x: null, y: null, radius: 140 };

    // Brand color spectrum matching the Heartcode ribbon: Electric Blue, Green, Orange, Coral, Cyan
    const brandColors = [
      'rgba(56, 152, 236, ',
      'rgba(52, 199, 89, ',
      'rgba(255, 149, 0, ',
      'rgba(255, 59, 92, ',
      'rgba(0, 240, 255, '
    ];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    }

    function createParticles() {
      particles = [];
      const density = window.innerWidth < 768 ? 26000 : 16000;
      const particleCount = Math.min(Math.floor((width * height) / density), 85);
      
      for (let i = 0; i < particleCount; i++) {
        const color = brandColors[Math.floor(Math.random() * brandColors.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1,
          color: color,
          alpha: Math.random() * 0.4 + 0.3
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowColor = p.color + '0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 152, 236, ${0.18 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          let mdx = p.x - mouse.x;
          let mdy = p.y - mouse.y;
          let mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.35 * (1 - mDist / mouse.radius)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resize();
    animate();
  })();

});



