/* ========== helpers ========== */
const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const lerp = (a, b, t) => a + (b - a) * t;

/* ensure system cursor never shows on desktop (Safari-safe) */
(function enforceNoCursor() {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  const apply = () => {
    document.documentElement.style.cursor = 'none';
    if (document.body) document.body.style.cursor = 'none';
  };

  apply();
  window.addEventListener('mousemove', apply, { passive: true });
  window.addEventListener('mouseenter', apply, { passive: true });
  window.addEventListener('focus', apply, { passive: true });

  new MutationObserver(apply).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });
})();

/* DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  const isMobile      = window.matchMedia('(max-width: 768px)').matches;
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  const nav = qs('.nav');

  /* ===== Year в футере ===== */
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Logo: собираем по буквам ===== */
  const logoText = qs('#logoText');
  let logoSpans = [];

  if (logoText) {
    const text = (logoText.getAttribute('aria-label') || logoText.textContent || 'Besson Agency').trim();
    logoText.innerHTML = text
      .split('')
      .map(ch =>
        ch === ' '
          ? '<span data-space="true">&nbsp;</span>'
          : `<span>${ch}</span>`
      )
      .join('');
    logoSpans = qsa('span', logoText);
  }

  /* ===== Desktop: микро-ховер по буквам ===== */
  if (logoSpans.length && !isMobile) {
    logoSpans.forEach(span => {
      if (span.dataset.space === 'true') return;
      span.style.transition = 'transform .22s ease-out';
      span.addEventListener('mouseenter', () => {
        span.style.transform = 'translateY(-6px) scale(1.06)';
      });
      span.addEventListener('mouseleave', () => {
        span.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  /* ===== Mobile: Netflix-spread на скролл ===== */
  if (logoSpans.length && isMobile) {
    const MAX_SCROLL_BASE = 600;
    let maxScroll = Math.max(innerHeight * 1.1, MAX_SCROLL_BASE);
    let breathing = false;
    let ticking   = false;

    const recalc = () => {
      maxScroll = Math.max(innerHeight * 1.1, MAX_SCROLL_BASE);
    };

    const applySpread = () => {
      const s = Math.min(scrollY, maxScroll);
      const p = maxScroll === 0 ? 0 : s / maxScroll; // 0..1
      const scale  = 1 + p * 1.6;
      const spread = p * 120;
      const glow   = 8 + p * 32;

      let i = 0;
      logoSpans.forEach(span => {
        if (span.dataset.space === 'true') {
          span.style.transform   = 'translateX(0) scale(1)';
          span.style.textShadow  = 'none';
          return;
        }
        const dir = (i++ % 2 === 0) ? -1 : 1;
        span.style.transform  = `translateX(${dir * spread}px) scale(${scale})`;
        span.style.textShadow = `0 0 ${glow}px rgba(255,255,255,${0.15 + p * 0.35})`;
      });

      if (p > 0.95 && !breathing) {
        logoText.classList.add('breathe');
        breathing = true;
      } else if (p < 0.9 && breathing) {
        logoText.classList.remove('breathe');
        breathing = false;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          applySpread();
          ticking = false;
        });
        ticking = true;
      }
    };

    recalc();
    applySpread();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      recalc();
      applySpread();
    }, { passive: true });
  }

  /* ===== Interlude word swap ===== */
  const swapEl = qs('#swap');
  if (swapEl) {
    const words = ['Event.', 'Creative.', 'BTL.', 'POSM.'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      swapEl.textContent = words[i];
    }, 2500);
  }

  /* ===== Mobile core trigger & menu ===== */
  const coreTrigger = qs('.core-trigger') || qs('.moon-trigger');
  const mobileMenu  = qs('#mobileMenu');
  const coreDot     = coreTrigger ? coreTrigger.querySelector('.core-dot') : null;

  if (coreTrigger && mobileMenu) {
    let menuOpen = false;

    const lockScroll = (lock) => {
      document.documentElement.style.overflow = lock ? 'hidden' : '';
      document.body.style.overflow           = lock ? 'hidden' : '';
      document.body.style.touchAction        = lock ? 'none'   : '';
    };

    const setAligned = (aligned) => {
      if (!coreDot) return;
      coreTrigger.classList.toggle('core-trigger--aligned', aligned);
    };

    const openMenu = () => {
      if (menuOpen) return;
      menuOpen = true;
      setAligned(true);
      mobileMenu.classList.add('active');
      coreTrigger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      lockScroll(true);
    };

    const closeMenu = () => {
      if (!menuOpen) return;
      menuOpen = false;
      mobileMenu.classList.remove('active');
      coreTrigger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      setAligned(false);
      lockScroll(false);
    };

    const toggleMenu = () => {
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    coreTrigger.addEventListener('click', toggleMenu);

    // закрываем по клику на пункт меню
    qsa('a', mobileMenu).forEach(a => {
      a.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  /* ===== Premium cursor (desktop) ===== */
  const dot  = qs('#cursorDot');
  const ring = qs('#cursorRing');

  if (isFinePointer && dot && ring) {
    let dx = innerWidth / 2;
    let dy = innerHeight / 2;
    let rx = dx;
    let ry = dy;
    let tx = dx;
    let ty = dy;

    const DOT_LERP  = 0.35; // точка — быстрее
    const RING_LERP = 0.12; // кольцо — плавнее

    const move = e => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', move, { passive: true });

    const loop = () => {
      dx = lerp(dx, tx, DOT_LERP);
      dy = lerp(dy, ty, DOT_LERP);
      rx = lerp(rx, tx, RING_LERP);
      ry = lerp(ry, ty, RING_LERP);

      dot.style.transform  = `translate(${dx}px,${dy}px)`;
      ring.style.transform = `translate(${rx}px,${ry}px)`;

      requestAnimationFrame(loop);
    };
    loop();

    const hoverSel = 'a,button,[role="button"],.link,.tile,.btn,input,textarea,select,label,summary';

    document.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse') return;
      if (e.target.closest(hoverSel)) {
        ring.classList.add('cursor--hover');
      }
    });

    document.addEventListener('pointerout', e => {
      if (e.pointerType !== 'mouse') return;
      if (!e.relatedTarget || !e.relatedTarget.closest(hoverSel)) {
        ring.classList.remove('cursor--hover');
      }
    });

    window.addEventListener('mouseout', e => {
      if (!e.relatedTarget) {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
      }
    });

    window.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });

    // Glow на кнопке отправки
    qsa('.btn').forEach(btn => {
      const glow = btn.querySelector('.glow');
      if (!glow) return;
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        glow.style.setProperty('--x', ((e.clientX - r.left) / r.width * 100) + '%');
        glow.style.setProperty('--y', ((e.clientY - r.top)  / r.height * 100) + '%');
      });
    });
  }

  /* ===== Float labels для полей формы ===== */
  qsa('.field').forEach(f => {
    const input = f.querySelector('.input');
    if (!input) return;
    const toggle = () => f.classList.toggle('filled', !!input.value);
    input.addEventListener('input', toggle);
    input.addEventListener('blur', toggle);
    toggle();
  });

  /* ===== Lead form submit (Formsubmit + без редиректа) ===== */
  const leadForm = qs('#leadForm');
  const statusEl = qs('#formStatus');

  if (leadForm && statusEl) {
    const endpoint = 'https://formsubmit.co/ajax/hello@besson.asia';

    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!leadForm.checkValidity()) {
        statusEl.textContent = 'Проверьте имя и телефон.';
        statusEl.classList.remove('form__status--success');
        statusEl.classList.add('form__status--error');
        return;
      }

      const formData  = new FormData(leadForm);
      const submitBtn = leadForm.querySelector('button[type="submit"]');

      statusEl.textContent = 'Отправляем...';
      statusEl.classList.remove('form__status--success', 'form__status--error');

      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error('Bad response');

        leadForm.reset();
        qsa('.field', leadForm).forEach(f => f.classList.remove('filled'));

        statusEl.textContent = 'Все получилось! Мы уже обрабатываем вашу заявку.';
        statusEl.classList.add('form__status--success');
      } catch (err) {
        statusEl.textContent = 'Не удалось отправить форму. Попробуйте ещё раз или напишите на hello@besson.asia.';
        statusEl.classList.add('form__status--error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ===== Переключение навигации в "светлый" режим
         только на interlude + about
         (на блоке проектов #work core снова белый) ===== */
  if (nav) {
    const whiteSections = [];
    const interlude = qs('.interlude');
    if (interlude) whiteSections.push(interlude);

    qsa('.stage').forEach(s => {
      if (s.id === 'about') whiteSections.push(s);
    });

    if (whiteSections.length) {
      let whiteTop = 0;
      let whiteBottom = 0;

      const recalcBreakpoints = () => {
        const navH = nav.offsetHeight || 76;
        whiteTop = Infinity;
        whiteBottom = -Infinity;
        whiteSections.forEach(sec => {
          const top = sec.offsetTop - navH;
          const bottom = sec.offsetTop + sec.offsetHeight - navH;
          if (top < whiteTop) whiteTop = top;
          if (bottom > whiteBottom) whiteBottom = bottom;
        });
      };

      const handleNavTone = () => {
        const y = window.scrollY || window.pageYOffset || 0;
        const onLight = y >= whiteTop && y < whiteBottom;
        nav.classList.toggle('nav--on-light', onLight);
      };

      recalcBreakpoints();
      handleNavTone();

      window.addEventListener('scroll', handleNavTone, { passive: true });
      window.addEventListener('resize', () => {
        recalcBreakpoints();
        handleNavTone();
      }, { passive: true });
    }
  }

});



