// Low-power / reduced-motion devices get a lighter visual mode (see .lite rules in style.css)
(function() {
  var weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
             (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
             (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (weak) document.documentElement.classList.add('lite');
})();

(function() {
      const bar = document.getElementById('load-bar');
      const percent = document.getElementById('load-percent');
      const screen = document.getElementById('loading-screen');

      // Real progress: tracks actual <img> elements loading on the page
      const images = Array.from(document.images).filter(function(i){return i.loading !== 'lazy';});
      const total = images.length;
      let loaded = 0;
      let finished = false;

      function updateProgress() {
        const pct = total > 0 ? Math.round((loaded / total) * 100) : 100;
        bar.style.width = pct + '%';
        percent.textContent = pct + '%';
        if (pct >= 100) finish();
      }

      function markLoaded() {
        loaded++;
        updateProgress();
      }

      function finish() {
        if (finished) return;
        finished = true;
        setTimeout(function() {
          screen.classList.add('hidden');
          window.__loaderDone = true;
          window.dispatchEvent(new Event('sf-loader-done'));
          setTimeout(function() { screen.style.display = 'none'; }, 1200);
        }, 300);
      }

      if (total === 0) {
        updateProgress();
      } else {
        images.forEach(function(img) {
          if (img.complete) {
            markLoaded();
          } else {
            img.addEventListener('load', markLoaded);
            img.addEventListener('error', markLoaded);
          }
        });
      }

      // Safety net: never let the loader hang forever on a slow/broken connection
      setTimeout(finish, 6000);
    })();

    (function() {
      const canvas = document.getElementById('ember-canvas');
      const ctx = canvas.getContext('2d');
      let particles = [];
      let animationId;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      function createParticles() {
        particles = [];
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        const colors = ["#D61B1B", "#FF3B3B", "#8B0000", "#FF6B6B"];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: -Math.random() * 0.5 - 0.2,
            opacity: Math.random() * 0.5 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      }

      var lastTs = 0;
      function animate(ts) {
        animationId = requestAnimationFrame(animate);
        if (document.hidden || ts - lastTs < 33) return; // ~30fps is plenty for slow embers
        lastTs = ts;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function(p) {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      resize();
      createParticles();
      if (!document.documentElement.classList.contains('lite')) animationId = requestAnimationFrame(animate);
      window.addEventListener('resize', function() { resize(); createParticles(); });
    })();

    (function() {
      const navbar = document.getElementById('navbar');
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
      });
    })();

    function toggleMobileMenu() {
      document.getElementById('mobile-menu').classList.toggle('active');
    }

    // Enhanced Intersection Observer with stagger support
    (function() {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Also trigger stagger children if parent has stagger-children class
            if (entry.target.classList.contains('stagger-children')) {
              entry.target.classList.add('visible');
            }
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur, .reveal-flip, .img-reveal, .stagger-children').forEach(function(el) {
        observer.observe(el);
      });
    })();

    // Hero entrance: plays when the hero section is actually reached (the cinematic intro sits above it)
(function() {
  var entered = false;
  function enterHero() {
    if (entered) return;
    entered = true;
    document.getElementById('hero-left').classList.add('visible');
    scrambleText('hero-name-1', 'ROHAN', 800);
    setTimeout(function() { scrambleText('hero-name-2', 'KRYTHOS', 800); }, 400);
    setTimeout(function() { document.getElementById('hero-right').classList.add('visible'); }, 600);
  }
  var hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { enterHero(); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(hero);
  } else {
    setTimeout(enterHero, 2800);
  }
})();

// Text scramble function
    function scrambleText(elementId, finalText, duration) {
      const el = document.getElementById(elementId);
      if (!el) return;
      el.classList.add('scrambling');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      const steps = 12;
      const stepDuration = duration / steps;
      let step = 0;

      const interval = setInterval(function() {
        if (step >= steps) {
          el.textContent = finalText;
          el.classList.remove('scrambling');
          clearInterval(interval);
          return;
        }
        let scrambled = '';
        for (let i = 0; i < finalText.length; i++) {
          if (i < (step / steps) * finalText.length) {
            scrambled += finalText[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        el.textContent = scrambled;
        step++;
      }, stepDuration);
    }

    // Tab Switching with enhanced animation
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        const panel = document.getElementById('tab-' + btn.dataset.tab);
        panel.classList.add('active');
        // Re-trigger reveal animations for new panel
        panel.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur').forEach(function(el) {
          el.classList.remove('visible');
          setTimeout(function() { el.classList.add('visible'); }, 100);
        });
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Parallax effect for hero background (rAF-throttled)
    (function() {
      const heroBg = document.querySelector('.hero-bg');
      if (!heroBg) return;
      let ticking = false;
      window.addEventListener('scroll', function() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function() {
          heroBg.style.transform = 'translateY(' + (window.pageYOffset * 0.3) + 'px)';
          ticking = false;
        });
      }, { passive: true });
    })();

    // Magnetic hover effect for buttons
    (function() {
      const magneticElements = document.querySelectorAll('.btn-primary, .btn-outline, .project-btn, .about-stat, .achieve-card');
      magneticElements.forEach(function(el) {
        el.addEventListener('mousemove', function(e) {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = 'translate(' + (x * 0.1) + 'px, ' + (y * 0.1) + 'px)';
        });
        el.addEventListener('mouseleave', function() {
          el.style.transform = '';
        });
      });
    })();

    // Profile particles animation
    (function() {
      const container = document.getElementById('profile-particles');
      if (!container) return;

      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'profile-particle';
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.animationDelay = (i * 0.25) + 's';
        particle.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
        container.appendChild(particle);
      }
    })();

    // ========== HEADER ANIMATION: PLAY ONCE ON OPEN, THEN SCROLL-SCRUBBED (same on every device) ==========
    (function() {
      const section = document.getElementById('scroll-anim-section');
      const sticky = document.querySelector('.scroll-anim-sticky');
      const canvas = document.getElementById('scrollAnimCanvas');
      const loader = document.getElementById('scrollAnimLoader');
      const progressFill = document.getElementById('scrollAnimProgress');
      const skipBtn = document.getElementById('scrollAnimSkip');
      if (!section || !canvas || !sticky) return;

      const ctx = canvas.getContext('2d');
      const root = document.documentElement;
      const TOTAL_FRAMES = 240;
      const INTRO_MS = 5200;        // length of the opening play-through
      const SCRUB_REVERSE = true;   // true: top of page = finished title card, scrolling down rewinds it.
                                    // false: scrolling down plays 1 -> 240 (the card is held until the first scroll).
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const clamp = function(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };

      // Frames 1-99 live in header-frame-A, 100-198 in header-frame-B, 199-240 in header-frame-C
      function framePath(n) {
        const padded = String(n).padStart(3, '0');
        const folder = n <= 99 ? 'header-frame-A' : (n <= 198 ? 'header-frame-B' : 'header-frame-C');
        return folder + '/ezgif-frame-' + padded + '.jpg';
      }

      const images = new Array(TOTAL_FRAMES + 1);
      const loadedFlags = new Array(TOTAL_FRAMES + 1).fill(false);
      let loadedCount = 0;
      let firstLoaded = false;

      function markLoaded(n, ok) {
        if (loadedFlags[n]) return;
        loadedFlags[n] = ok;                 // a failed frame never blocks the sequence
        loadedCount++;
        if (n === 1 && ok) { firstLoaded = true; drawFrame(1, true); }
        tryStart();
      }
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = function() { markLoaded(i, true); };
        img.onerror = function() { markLoaded(i, false); };
        img.src = framePath(i);
        images[i] = img;
      }

      // ---------- canvas sizing + drawing ----------
      let cw = 0, ch = 0;
      const bg = document.createElement('canvas');   // tiny canvas = cheap blurred backdrop for tall screens
      bg.width = 48; bg.height = 27;
      const bctx = bg.getContext('2d');

      function resizeCanvas() {
        const rect = sticky.getBoundingClientRect();
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        const maxPixels = 2300000;                    // keep phones/low-end GPUs comfortable
        dpr = Math.min(dpr, Math.sqrt(maxPixels / Math.max(1, rect.width * rect.height)));
        cw = canvas.width = Math.max(2, Math.round(rect.width * dpr));
        ch = canvas.height = Math.max(2, Math.round(rect.height * dpr));
        drawFrame(shown, true);
      }

      function nearestAvailableFrame(target) {
        if (loadedFlags[target]) return target;
        for (let d = 1; d < TOTAL_FRAMES; d++) {
          if (target - d >= 1 && loadedFlags[target - d]) return target - d;
          if (target + d <= TOTAL_FRAMES && loadedFlags[target + d]) return target + d;
        }
        return 1;
      }

      let shown = 1;        // frame number currently on the canvas
      function drawFrame(requested, force) {
        const n = nearestAvailableFrame(clamp(Math.round(requested), 1, TOTAL_FRAMES));
        if (!force && n === shown) return;
        const img = images[n];
        if (!img || !img.complete || !img.naturalWidth || !cw) return;
        shown = n;
        const iw = img.naturalWidth, ih = img.naturalHeight;
        ctx.clearRect(0, 0, cw, ch);
        if (cw / ch >= 1.25) {
          // wide screen: fill the viewport (cover crop)
          const canvasRatio = cw / ch, imgRatio = iw / ih;
          let sx, sy, sw, sh;
          if (imgRatio > canvasRatio) { sh = ih; sw = ih * canvasRatio; sx = (iw - sw) / 2; sy = 0; }
          else { sw = iw; sh = iw / canvasRatio; sx = 0; sy = (ih - sh) / 2; }
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
        } else {
          // tall screen (phones, "desktop site" on phones): whole frame visible over a soft backdrop
          bctx.drawImage(img, 0, 0, 48, 27);
          const bScale = Math.max(cw / 48, ch / 27);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(bg, (cw - 48 * bScale) / 2, (ch - 27 * bScale) / 2, 48 * bScale, 27 * bScale);
          ctx.fillStyle = 'rgba(5,5,5,0.5)';
          ctx.fillRect(0, 0, cw, ch);
          const fScale = Math.min(cw / iw, ch / ih);
          ctx.drawImage(img, (cw - iw * fScale) / 2, (ch - ih * fScale) / 2, iw * fScale, ih * fScale);
        }
      }

      // ---------- phase 1: opening play-through ----------
      let phase = 'loading';     // loading -> intro -> scrub
      let loaderDone = !!window.__loaderDone;
      let startedAt = 0;
      let cur = 1;               // float frame position used by the scrub easing

      function lockScroll() {
        root.classList.add('intro-lock');
        window.addEventListener('wheel', blockScroll, { passive: false });
        window.addEventListener('touchmove', blockScroll, { passive: false });
        window.addEventListener('keydown', blockKeys, true);
      }
      function unlockScroll() {
        root.classList.remove('intro-lock');
        window.removeEventListener('wheel', blockScroll);
        window.removeEventListener('touchmove', blockScroll);
        window.removeEventListener('keydown', blockKeys, true);
      }
      function blockScroll(e) { if (e.cancelable) e.preventDefault(); }
      function blockKeys(e) {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'].indexOf(e.key) !== -1) e.preventDefault();
      }

      function startIntro() {
        if (phase !== 'loading') return;
        if (!firstLoaded) { finishIntro(true); return; }       // frames failed completely: just show the page
        phase = 'intro';
        loader.classList.add('hidden');
        section.classList.add('intro-playing');
        lockScroll();
        startedAt = performance.now();
        requestAnimationFrame(introStep);
      }
      function introStep(now) {
        if (phase !== 'intro') return;
        const t = clamp((now - startedAt) / INTRO_MS, 0, 1);
        drawFrame(1 + t * (TOTAL_FRAMES - 1));
        if (t < 1) requestAnimationFrame(introStep); else finishIntro(false);
      }
      function finishIntro(jump) {
        if (phase === 'scrub') return;
        phase = 'scrub';
        loader.classList.add('hidden');
        if (jump) drawFrame(TOTAL_FRAMES, true);
        cur = TOTAL_FRAMES;
        section.classList.remove('intro-playing');
        section.classList.add('intro-done');
        unlockScroll();
        updateFromScroll();
      }

      // Start once the loading screen is gone and (nearly) all frames are in; hard timeouts so the page never hangs.
      function tryStart() {
        if (phase !== 'loading' || !loaderDone) return;
        if (loadedCount >= TOTAL_FRAMES * 0.92) beginPlayback();
      }
      function beginPlayback() {
        if (phase !== 'loading') return;
        if (reduceMotion || location.hash) { finishIntro(true); return; }   // no autoplay for reduced-motion / deep links
        startIntro();
      }
      window.addEventListener('sf-loader-done', function() { loaderDone = true; tryStart(); setTimeout(beginPlayback, 7000); });
      if (loaderDone) { tryStart(); setTimeout(beginPlayback, 7000); }
      setTimeout(function() { loaderDone = true; beginPlayback(); }, 14000);   // absolute safety net

      if (skipBtn) skipBtn.addEventListener('click', function() { if (phase === 'intro') finishIntro(true); });

      // ---------- phase 2: scroll-scrubbing (identical on mobile, tablet, desktop) ----------
      let progress = 0;
      let target = TOTAL_FRAMES;
      let easing = false;
      function computeTarget() {
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - sticky.clientHeight;
        progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
        section.classList.toggle('in-view', rect.top < window.innerHeight && rect.bottom > 0);
        section.classList.toggle('at-end', progress > 0.02);
        if (progressFill) progressFill.style.width = (progress * 100) + '%';
        if (SCRUB_REVERSE) return TOTAL_FRAMES - progress * (TOTAL_FRAMES - 1);
        return progress < 0.002 ? TOTAL_FRAMES : 1 + progress * (TOTAL_FRAMES - 1);
      }
      // Glide toward the scroll position: after the opening play-through the first scroll is a fast
      // rewind instead of a hard jump, and normal scrolling stays smooth.
      function ease() {
        const diff = target - cur;
        if (Math.abs(diff) < 0.6) { cur = target; drawFrame(cur); easing = false; return; }
        cur += clamp(diff * 0.25, -16, 16);
        drawFrame(cur);
        requestAnimationFrame(ease);
      }
      function updateFromScroll() {
        if (phase !== 'scrub') return;
        target = computeTarget();
        if (!easing) { easing = true; requestAnimationFrame(ease); }
      }
      window.addEventListener('scroll', updateFromScroll, { passive: true });
      window.addEventListener('resize', function() { resizeCanvas(); updateFromScroll(); });

      // Always start a visit at the top so the opening play-through is the first thing seen
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      if (!location.hash) window.scrollTo(0, 0);
      resizeCanvas();
    })();

    // Profile 3D tilt on mouse move
    (function() {
      const profileBox = document.getElementById('profile-box');
      const profileImg = document.getElementById('profile-img');
      if (!profileBox || !profileImg) return;

      profileBox.addEventListener('mousemove', function(e) {
        const rect = profileBox.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        profileImg.style.transform = 'perspective(800px) scale(1.08) rotateY(' + (x * 15) + 'deg) rotateX(' + (-y * 15) + 'deg)';
        profileImg.style.animation = 'none';
      });

      profileBox.addEventListener('mouseleave', function() {
        profileImg.style.transform = '';
        profileImg.style.animation = 'profileFloat 4s ease-in-out infinite';
      });
    })();
