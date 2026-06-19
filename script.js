/**
 * NXT – Next Generation Technology
 * Production JavaScript (Layout fixes + AI Assistant)
 */

(function () {
  'use strict';

  const LOADER_DURATION = 3000;
  const WHATSAPP = '918469640417';
  const EMAIL = 'aftabbhai07861@gmail.com';
  const ENQUIRY_KEY = 'nxt_enquiries';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  const loader = $('#loader');
  const loaderProgress = $('#loader-progress');
  const loaderPercent = $('#loader-percent');
  const header = $('#header');
  const navMenu = $('#nav-menu');
  const navToggle = $('#nav-toggle');
  const themeToggle = $('#theme-toggle');
  const scrollTopBtn = $('#scroll-top');
  const scrollProgress = $('#scroll-progress');
  const typingEl = $('#typing-text');
  const contactForm = $('#contact-form');
  const formStatus = $('#form-status');
  const inquiryForm = $('#inquiry-form');
  const inquiryStatus = $('#inquiry-status');
  const downloadCv = $('#download-cv');
  const viewResume = $('#view-resume');
  const resumeModal = $('#resume-modal');
  const modalOverlay = $('#modal-overlay');
  const modalClose = $('#modal-close');
  const modalResumeBody = $('#modal-resume-body');
  const yearEl = $('#year');
  const particleCanvas = $('#particle-canvas');

  function getHeaderOffset() {
    return (header ? header.offsetHeight : 72) + 20;
  }

  function closeMobileNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    $$('.nav-dropdown').forEach((d) => d.classList.remove('open'));
  }

  /* ---- Enquiry Storage ---- */
  function saveEnquiry(data) {
    const enquiries = JSON.parse(localStorage.getItem(ENQUIRY_KEY) || '[]');
    enquiries.push({ ...data, id: Date.now(), date: new Date().toISOString() });
    localStorage.setItem(ENQUIRY_KEY, JSON.stringify(enquiries));
  }

  function sendEnquiryChannels(summary, subject) {
    const waText = encodeURIComponent(summary);
    const mailSubject = encodeURIComponent(subject || 'NXT Enquiry');
    const mailBody = encodeURIComponent(summary);
    window.open(`https://wa.me/${WHATSAPP}?text=${waText}`, '_blank');
    setTimeout(() => {
      window.open(`mailto:${EMAIL}?subject=${mailSubject}&body=${mailBody}`, '_blank');
    }, 400);
  }

  /* ---- Loader ---- */
  function initLoader() {
    document.body.classList.add('loading');
    const start = performance.now();

    function tick(now) {
      const pct = Math.min(((now - start) / LOADER_DURATION) * 100, 100);
      if (loaderProgress) loaderProgress.style.width = `${pct}%`;
      if (loaderPercent) loaderPercent.textContent = `${Math.floor(pct)}%`;
      if (now - start < LOADER_DURATION) requestAnimationFrame(tick);
      else {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---- Scroll Progress ---- */
  function initScrollProgress() {
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      if (scrollProgress) scrollProgress.style.width = `${pct}%`;
    }, { passive: true });
  }

  /* ---- Theme ---- */
  function initTheme() {
    const saved = localStorage.getItem('nxt-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nxt-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }

  /* ---- Header ---- */
  function initHeader() {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
      scrollTopBtn.classList.toggle('visible', window.scrollY > 350);
    }, { passive: true });
  }

  /* ---- Mobile Nav ---- */
  function initMobileNav() {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', open);
      document.body.classList.toggle('nav-open', open);
    });

    $$('.nav-dropdown-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = btn.closest('.nav-dropdown');
        const isOpen = parent.classList.contains('open');
        $$('.nav-dropdown').forEach((d) => d.classList.remove('open'));
        if (!isOpen) parent.classList.add('open');
        btn.setAttribute('aria-expanded', parent.classList.contains('open'));
      });
    });

    $$('.nav-link').forEach((link) => {
      if (link.classList.contains('nav-dropdown-btn')) return;
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMobileNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMobileNav();
    });
  }

  /* ---- Active Nav ---- */
  function initActiveNav() {
    const sections = $$('section[id]');
    const links = $$('.nav-link').filter((l) => l.getAttribute('href')?.startsWith('#'));

    function update() {
      const offset = getHeaderOffset();
      let current = '';
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
      });
      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---- Smooth Scroll ---- */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        closeMobileNav();
        const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  function initScrollTop() {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Typing ---- */
  function initTyping() {
    if (!typingEl) return;
    const phrases = ['Engineering the Future', 'Next Generation Technology', 'Web · Arduino · IoT · AI', 'Building Smart Solutions'];
    let pi = 0, ci = 0, del = false;

    function type() {
      const cur = phrases[pi];
      typingEl.textContent = del ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
      ci += del ? -1 : 1;
      let delay = del ? 40 : 80;
      if (!del && ci === cur.length) { delay = 2200; del = true; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; delay = 500; }
      setTimeout(type, delay);
    }
    type();
  }

  /* ---- Counters ---- */
  function initCounters() {
    const counters = $$('.stat-number');
    let done = false;
    function run() {
      if (done) return;
      const stats = $('.hero-stats');
      if (!stats || stats.getBoundingClientRect().top > window.innerHeight) return;
      done = true;
      counters.forEach((c) => {
        const target = parseInt(c.dataset.target, 10);
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / 2000, 1);
          c.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(tick);
          else c.textContent = target;
        }
        requestAnimationFrame(tick);
      });
    }
    window.addEventListener('scroll', run, { passive: true });
    run();
  }

  /* ---- Reveal ---- */
  function initReveal() {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    $$('.reveal').forEach((el) => obs.observe(el));
  }

  /* ---- Skill Bars ---- */
  function initSkillBars() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const bar = e.target.querySelector('.skill-progress');
          if (bar) bar.style.width = `${bar.dataset.progress}%`;
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    $$('.skill-card').forEach((c) => obs.observe(c));
  }

  /* ---- Filters ---- */
  function initProjectFilter() {
    $$('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        $$('.project-card').forEach((c) => c.classList.toggle('hidden', f !== 'all' && c.dataset.category !== f));
      });
    });
  }

  function initGalleryFilter() {
    $$('.gallery-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.gallery-filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.galleryFilter;
        $$('.gallery-item').forEach((i) => i.classList.toggle('hidden', f !== 'all' && i.dataset.gallery !== f));
      });
    });
  }

  /* ---- Testimonials ---- */
  function initTestimonials() {
    const cards = $$('.testimonial-card');
    const dotsEl = $('#testimonial-dots');
    if (!cards.length || !dotsEl) return;

    let cur = 0, timer;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => go(i));
      dotsEl.appendChild(dot);
    });

    const dots = $$('.testimonial-dot', dotsEl);

    function go(i) {
      cards[cur].classList.remove('active');
      dots[cur].classList.remove('active');
      cur = i;
      cards[cur].classList.add('active');
      dots[cur].classList.add('active');
    }

    function next() { go((cur + 1) % cards.length); }
    function start() { timer = setInterval(next, 5000); }
    function stop() { clearInterval(timer); }

    start();
    const slider = $('#testimonials-slider');
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
  }

  /* ---- FAQ ---- */
  function initFaq() {
    $$('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');

        $$('.faq-item').forEach((i) => {
          i.classList.remove('active');
          i.querySelector('.faq-answer').style.maxHeight = '0px';
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---- Forms ---- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className = `form-status ${type}`;
    setTimeout(() => { el.textContent = ''; el.className = 'form-status'; }, 5000);
  }

  function initContactForm() {
    if (!contactForm) return;
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const subject = $('#subject').value.trim();
      const message = $('#message').value.trim();
      if (!name || !email || !subject || !message) return showStatus(formStatus, 'Please fill in all fields.', 'error');
      if (!isValidEmail(email)) return showStatus(formStatus, 'Please enter a valid email.', 'error');

      const summary = `NXT Contact Form\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
      saveEnquiry({ name, email, phone: '', service: subject, message, summary });
      sendEnquiryChannels(summary, subject);
      showStatus(formStatus, 'Message sent! WhatsApp & email opened.', 'success');
      contactForm.reset();
    });
  }

  function initInquiryForm() {
    if (!inquiryForm) return;
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: $('#inq-name').value.trim(),
        email: $('#inq-email').value.trim(),
        phone: $('#inq-phone').value.trim(),
        service: $('#inq-service').value,
        budget: $('#inq-budget').value,
        timeline: $('#inq-timeline').value,
        message: $('#inq-details').value.trim()
      };
      if (!data.name || !data.email || !data.phone || !data.service || !data.budget || !data.timeline || !data.message) {
        return showStatus(inquiryStatus, 'Please complete all fields.', 'error');
      }
      if (!isValidEmail(data.email)) return showStatus(inquiryStatus, 'Please enter a valid email.', 'error');

      const summary = `NXT Client Inquiry\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nService: ${data.service}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\nDetails:\n${data.message}`;
      saveEnquiry({ ...data, summary });
      sendEnquiryChannels(summary, `NXT Inquiry: ${data.service}`);
      showStatus(inquiryStatus, 'Inquiry submitted successfully!', 'success');
      inquiryForm.reset();
    });
  }

  /* ---- Resume ---- */
  function getResumeHTML() {
    return `<h2>Aftab</h2><h3>Founder — NXT – Next Generation Technology</h3>
      <section><h4>Contact</h4><p>Email: ${EMAIL}</p><p>Phone: +91 8469640417</p></section>
      <section><h4>Profile</h4><p>ICT Engineering student passionate about Web Development, Arduino, IoT, AI, and Digital Innovation.</p></section>
      <section><h4>Skills</h4><ul><li>HTML5, CSS3, JavaScript</li><li>Arduino & IoT</li><li>AI & App Development</li></ul></section>`;
  }

  function getResumeText() {
    return `NXT – NEXT GENERATION TECHNOLOGY\nAftab\nEmail: ${EMAIL}\nPhone: +91 8469640417`;
  }

  function initResume() {
    if (!downloadCv) return;

    downloadCv.addEventListener('click', (e) => {
      e.preventDefault();
      const blob = new Blob([getResumeText()], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Aftab_NXT_Resume.txt';
      a.click();
      URL.revokeObjectURL(url);
    });

    function openModal() {
      modalResumeBody.innerHTML = getResumeHTML();
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    viewResume.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('open')) closeModal();
    });
  }

  /* ---- Particles ---- */
  function initParticles() {
    if (!particleCanvas) return;
    const ctx = particleCanvas.getContext('2d');
    let particles = [], animId;

    function resize() {
      particleCanvas.width = particleCanvas.offsetWidth;
      particleCanvas.height = particleCanvas.offsetHeight;
    }

    function create() {
      particles = [];
      const n = Math.min(60, Math.floor(particleCanvas.width / 18));
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * particleCanvas.width,
          y: Math.random() * particleCanvas.height,
          r: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          o: Math.random() * 0.4 + 0.15
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.o})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = particleCanvas.width;
        if (p.x > particleCanvas.width) p.x = 0;
        if (p.y < 0) p.y = particleCanvas.height;
        if (p.y > particleCanvas.height) p.y = 0;
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x, dy = particles[j].y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    }

    resize(); create(); draw();
    window.addEventListener('resize', () => { resize(); create(); }, { passive: true });
  }

  /* ---- AI Assistant ---- */
  function initAIAssistant() {
    const widget = $('#ai-widget');
    const toggle = $('#ai-toggle');
    const panel = $('#ai-panel');
    const closeBtn = $('#ai-close');
    const messages = $('#ai-messages');
    const typingInd = $('#ai-typing');
    const chatInput = $('#ai-chat-input');
    const sendBtn = $('#ai-send');
    const voiceIn = $('#ai-voice-in');
    const voiceOut = $('#ai-voice-out');
    const aiPrev = $('#ai-prev');
    const aiNext = $('#ai-next');
    const aiSubmit = $('#ai-submit');
    const aiSummary = $('#ai-summary');
    const aiFile = $('#ai-file');
    const aiFileName = $('#ai-file-name');

    if (!widget || !toggle) return;

    let step = 1;
    const totalSteps = 6;
    let recognition = null;
    let lastBotText = '';

    const aiData = {
      name: '', email: '', phone: '', service: '', message: '', fileName: ''
    };

    function openPanel() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('ai-open');

      try {
        const saved = JSON.parse(localStorage.getItem('nxt_ai_user') || '{}');
        if (saved.name) $('#ai-name').value = saved.name;
        if (saved.email) $('#ai-email').value = saved.email;
        if (saved.phone) $('#ai-phone').value = saved.phone;
        if (saved.service) $('#ai-service').value = saved.service;
        if (saved.message) $('#ai-message').value = saved.message;
      } catch (_) { /* ignore */ }

      if (!messages.children.length) {
        typeBotMessage('नमस्ते! Hello! I am NXT AI Assistant. I can help you submit a project enquiry in Hindi or English. Fill the form below or chat with me.');
      }
    }

    function closePanel() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('ai-open');
      stopVoiceInput();
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.contains('open') ? closePanel() : openPanel();
    });

    closeBtn.addEventListener('click', closePanel);
    document.addEventListener('click', (e) => {
      if (panel.classList.contains('open') && !widget.contains(e.target)) closePanel();
    });

    function addMessage(text, type) {
      const div = document.createElement('div');
      div.className = `ai-msg ${type}`;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function typeBotMessage(text, cb) {
      typingInd.hidden = false;
      lastBotText = text;
      const div = document.createElement('div');
      div.className = 'ai-msg bot';
      messages.appendChild(div);
      let i = 0;
      function tick() {
        if (i <= text.length) {
          div.textContent = text.slice(0, i++);
          messages.scrollTop = messages.scrollHeight;
          setTimeout(tick, i < 30 ? 18 : 12);
        } else {
          typingInd.hidden = true;
          if (cb) cb();
        }
      }
      tick();
    }

    function showStep(n) {
      step = n;
      $$('.ai-step').forEach((s) => s.classList.toggle('active', parseInt(s.dataset.step, 10) === n));
      aiPrev.hidden = n <= 1;
      aiNext.hidden = n >= totalSteps;
      aiSubmit.hidden = n !== totalSteps;
      aiSummary.hidden = n !== totalSteps;

      if (n === totalSteps) {
        aiData.name = $('#ai-name').value.trim();
        aiData.email = $('#ai-email').value.trim();
        aiData.phone = $('#ai-phone').value.trim();
        aiData.service = $('#ai-service').value;
        aiData.message = $('#ai-message').value.trim();
        aiData.fileName = aiFile.files[0]?.name || '';

        const summary = `NXT AI Enquiry Summary\n━━━━━━━━━━━━━━━━━━━━\nName: ${aiData.name}\nEmail: ${aiData.email}\nPhone: ${aiData.phone}\nService: ${aiData.service}\nFile: ${aiData.fileName || 'None'}\n\nProject Details:\n${aiData.message}\n━━━━━━━━━━━━━━━━━━━━\nSubmitted via NXT AI Assistant`;
        aiSummary.textContent = summary;
      }
    }

    aiNext.addEventListener('click', () => {
      const fields = {
        1: ['#ai-name', 'Please enter your name.'],
        2: ['#ai-email', 'Please enter a valid email.'],
        3: ['#ai-phone', 'Please enter your phone number.'],
        4: ['#ai-service', 'Please select a service.'],
        5: ['#ai-message', 'Please describe your project.']
      };
      const [sel, err] = fields[step] || [];
      if (sel) {
        const el = $(sel);
        if (!el.value.trim()) return typeBotMessage(err);
        if (step === 2 && !isValidEmail(el.value.trim())) return typeBotMessage('Please enter a valid email address.');
      }
      if (step < totalSteps) showStep(step + 1);
    });

    aiPrev.addEventListener('click', () => { if (step > 1) showStep(step - 1); });

    aiFile.addEventListener('change', () => {
      const file = aiFile.files[0];
      if (!file) { aiFileName.textContent = ''; return; }
      const allowed = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp', 'gif'];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowed.includes(ext)) {
        typeBotMessage('Invalid file type. Please upload PDF, DOCX, or image files.');
        aiFile.value = '';
        aiFileName.textContent = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        typeBotMessage('File too large. Maximum size is 5MB.');
        aiFile.value = '';
        aiFileName.textContent = '';
        return;
      }
      aiFileName.textContent = file.name;
    });

    aiSubmit.addEventListener('click', () => {
      const summary = aiSummary.textContent;
      saveEnquiry({ ...aiData, summary });
      sendEnquiryChannels(summary, `NXT AI Enquiry: ${aiData.service}`);
      typeBotMessage('धन्यवाद! Thank you! Your enquiry has been saved and sent to Aftab via WhatsApp and Email. We will contact you soon.');
      speakHindi('धन्यवाद! आपकी पूछताछ सफलतापूर्वक भेज दी गई है। हम जल्द संपर्क करेंगे।');

      localStorage.setItem('nxt_ai_user', JSON.stringify(aiData));
      aiSubmit.disabled = true;
      aiSubmit.textContent = 'Submitted ✓';
    });

    function handleChat() {
      const text = chatInput.value.trim();
      if (!text) return;
      addMessage(text, 'user');
      chatInput.value = '';

      const lower = text.toLowerCase();
      let reply = '';

      if (/price|pricing|cost|kitna|कीमत|दाम/.test(lower)) {
        reply = 'हमारे प्लान ₹4,999 से शुरू होते हैं। Pricing section देखें या form भरें। Our plans start from ₹4,999.';
      } else if (/service|website|app|arduino|iot|ai/.test(lower)) {
        reply = 'NXT offers Website Development, Android Apps, Arduino, IoT, AI Solutions, Photography & Video Editing. Select a service in the form above.';
      } else if (/contact|phone|email|whatsapp/.test(lower)) {
        reply = `Contact Aftab: +91 8469640417 | ${EMAIL}`;
      } else if (/hello|hi|namaste|नमस्ते|hey/.test(lower)) {
        reply = 'नमस्ते! Welcome to NXT. How can I help you today? Fill the enquiry form or ask about our services.';
      } else {
        reply = 'Thank you for your message! Please complete the enquiry form above so we can assist you better. आप फॉर्म भर सकते हैं।';
      }

      setTimeout(() => typeBotMessage(reply), 400);
    }

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleChat(); });

    function speakHindi(text) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'hi-IN';
      utter.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
      if (hiVoice) utter.voice = hiVoice;
      window.speechSynthesis.speak(utter);
    }

    voiceOut.addEventListener('click', () => {
      speakHindi(lastBotText || 'नमस्ते! मैं NXT AI Assistant हूँ।');
    });

    function stopVoiceInput() {
      if (recognition) { recognition.stop(); recognition = null; }
      voiceIn.classList.remove('listening');
    }

    voiceIn.addEventListener('click', () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return typeBotMessage('Voice input is not supported in this browser. Please type your message.');

      if (voiceIn.classList.contains('listening')) { stopVoiceInput(); return; }

      recognition = new SR();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => voiceIn.classList.add('listening');
      recognition.onend = () => voiceIn.classList.remove('listening');
      recognition.onerror = () => {
        voiceIn.classList.remove('listening');
        typeBotMessage('Voice input failed. Please try again or type your message.');
      };
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        chatInput.value = transcript;
        handleChat();
      };
      recognition.start();
    });

    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    showStep(1);
  }

  /* ---- PWA ---- */
  function initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  }

  function initYear() {
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function init() {
    initLoader();
    initScrollProgress();
    initTheme();
    initHeader();
    initMobileNav();
    initActiveNav();
    initSmoothScroll();
    initScrollTop();
    initTyping();
    initCounters();
    initReveal();
    initSkillBars();
    initProjectFilter();
    initGalleryFilter();
    initTestimonials();
    initFaq();
    initContactForm();
    initInquiryForm();
    initResume();
    initParticles();
    initAIAssistant();
    initPWA();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
