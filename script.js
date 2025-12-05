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

/* ========== main ========== */
document.addEventListener('DOMContentLoaded', () => {
  const isMobile      = window.matchMedia('(max-width: 768px)').matches;
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

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

  /* ===== Mobile: Netflix-спред на скролл без горизонтального скролла ===== */
  if (logoSpans.length && isMobile) {
    const MAX_SCROLL_BASE = 600;
    let maxScroll = Math.max(innerHeight * 1.1, MAX_SCROLL_BASE);

    // максимально допустимое "разъезжание" в пикселях, пересчитывается от ширины экрана
    let maxSpread = 40;

    let breathing = false;
    let ticking   = false;

    const recalc = () => {
      maxScroll = Math.max(innerHeight * 1.1, MAX_SCROLL_BASE);

      // считаем, сколько свободного места по краям у логотипа
      if (logoText) {
        const rect     = logoText.getBoundingClientRect();
        const viewport = window.innerWidth
          || document.documentElement.clientWidth
          || rect.width;

        // свободное пространство слева + справа = viewport - ширина текста
        // нас интересует максимум, на который можно уйти от центра, не вылезая за экран
        const free = Math.max(0, (viewport - rect.width) / 2);

        // оставляем небольшой запас (90%), чтобы точно не вылезти
        maxSpread = free * 0.9;
      }
    };

    const applySpread = () => {
      const s = Math.min(window.scrollY || 0, maxScroll);
      const p = maxScroll === 0 ? 0 : s / maxScroll; // 0..1

      const scale  = 1 + p * 1.6;
      const spread = p * maxSpread;           // вместо жёстких 120px
      const glow   = 8 + p * 32;

      let i = 0;
      logoSpans.forEach(span => {
        if (span.dataset.space === 'true') {
          span.style.transform  = 'translateX(0) scale(1)';
          span.style.textShadow = 'none';
          return;
        }

        const dir = (i++ % 2 === 0) ? -1 : 1;
        span.style.transform  = `translateX(${dir * spread}px) scale(${scale})`;
        span.style.textShadow =
          `0 0 ${glow}px rgba(255,255,255,${0.15 + p * 0.35})`;
      });

      // лёгкий "breathing"-эффект, когда анимация дошла до конца
      if (p > 0.95 && !breathing) {
        logoText.classList.add('breathe');
        breathing = true;
      } else if (p < 0.9 && breathing) {
        logoText.classList.remove('breathe');
        breathing = false;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applySpread();
        ticking = false;
      });
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

  /* ===== Mobile Core-orb + радиальное меню (объединённый блок) ===== */
  const coreTriggerEl = qs('.core-trigger') || qs('.moon-trigger');
  const mobileMenuEl  = qs('#mobileMenu');

  if (coreTriggerEl && mobileMenuEl) {
    const rootStyle = document.documentElement.style;
    let menuOpen = false;

    // координаты источника света = центр триггера
    const setCoreBeamOrigin = () => {
      const rect = coreTriggerEl.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      rootStyle.setProperty('--core-x', cx + 'px');
      rootStyle.setProperty('--core-y', cy + 'px');
    };

    const lockScroll = (lock) => {
      const html = document.documentElement;
      if (lock) {
        html.dataset.navLock = '1';
        html.style.overflowY = 'hidden';
        document.body.style.overflowY = 'hidden';
      } else {
        html.dataset.navLock = '0';
        html.style.overflowY = '';
        document.body.style.overflowY = '';
      }
    };

    const setMenuState = (open) => {
      menuOpen = open;
      coreTriggerEl.classList.toggle('is-open', open);
      mobileMenuEl.classList.toggle('active', open);
      mobileMenuEl.setAttribute('aria-hidden', open ? 'false' : 'true');
      coreTriggerEl.setAttribute('aria-expanded', open ? 'true' : 'false');

      if (open) setCoreBeamOrigin();
      lockScroll(open);
    };

    coreTriggerEl.addEventListener('click', () => {
      setMenuState(!menuOpen);
    });

    // клики по пунктам меню закрывают его
    qsa('.mobile-menu__link', mobileMenuEl).forEach(a => {
      a.addEventListener('click', () => {
        if (menuOpen) setMenuState(false);
      });
    });

    // на случай поворота экрана при открытом меню
    window.addEventListener('resize', () => {
      if (menuOpen) setCoreBeamOrigin();
    }, { passive: true });

    // хаотичное плавное движение точки
    const orb =
      coreTriggerEl.querySelector('.core-orb') ||
      coreTriggerEl.querySelector('.moon-orb') ||
      coreTriggerEl;
    const dot =
      coreTriggerEl.querySelector('.core-dot') ||
      coreTriggerEl.querySelector('.core-dot-inner') ||
      coreTriggerEl.querySelector('.core-inner') ||
      coreTriggerEl.querySelector('.moon-dot') ||
      orb;

    let tDot = 0;
    let curX = 0;
    let curY = 0;

    const radius = 12;      // радиус движения
    const speed  = 0.0014;  // медленная скорость

    const animateDot = () => {
      tDot += speed;

      // "рваные" оси
      const ax = Math.cos(tDot * 0.7) * 0.6 + Math.sin(tDot * 1.123) * 0.4;
      const ay = Math.sin(tDot * 0.52) * 0.7 + Math.cos(tDot * 0.31) * 0.3;

      const targetX = menuOpen ? 0 : ax * radius;
      const targetY = menuOpen ? 0 : ay * radius;

      curX = lerp(curX, targetX, menuOpen ? 0.18 : 0.1);
      curY = lerp(curY, targetY, menuOpen ? 0.18 : 0.1);

      if (dot && dot.style) {
        dot.style.transform = `translate(${curX}px, ${curY}px)`;
      }

      requestAnimationFrame(animateDot);
    };
    animateDot();
  }

  /* ===== Цвет меню / круга в зависимости от фона ===== */
  const nav = qs('.nav');

  const updateNavOnLight = () => {
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const y = Math.max(navRect.bottom + 4, 40);
    const x = window.innerWidth - 10;

    let el = document.elementFromPoint(x, y);
    let isLight = false;
    let depth = 0;

    while (el && depth < 6) {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const m = bg.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const parts = m[1].split(',').map(v => parseFloat(v.trim()));
          const r = parts[0], g = parts[1], b = parts[2];
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          isLight = lum > 0.5;
          break;
        }
      }
      el = el.parentElement;
      depth++;
    }

    nav.classList.toggle('nav--on-light', isLight);
  };

  let colorTicking = false;
  const onScrollColor = () => {
    if (colorTicking) return;
    colorTicking = true;
    requestAnimationFrame(() => {
      updateNavOnLight();
      colorTicking = false;
    });
  };

  updateNavOnLight();
  window.addEventListener('scroll', onScrollColor, { passive: true });
  window.addEventListener('resize', updateNavOnLight);

  /* ===== Premium cursor (desktop) ===== */
  const dotCur  = qs('#cursorDot');
  const ringCur = qs('#cursorRing');

  if (isFinePointer && dotCur && ringCur) {
    let dx = innerWidth / 2;
    let dy = innerHeight / 2;
    let rx = dx;
    let ry = dy;
    let tx = dx;
    let ty = dy;

    const DOT_LERP  = 0.35;
    const RING_LERP = 0.12;

    const move = e => {
      tx = e.clientX;
      ty = e.clientY;
      dotCur.style.opacity  = '1';
      ringCur.style.opacity = '1';
    };

    window.addEventListener('mousemove', move, { passive: true });

    const loop = () => {
      dx = lerp(dx, tx, DOT_LERP);
      dy = lerp(dy, ty, DOT_LERP);
      rx = lerp(rx, tx, RING_LERP);
      ry = lerp(ry, ty, RING_LERP);

      dotCur.style.transform  = `translate(${dx}px,${dy}px)`;
      ringCur.style.transform = `translate(${rx}px,${ry}px)`;

      requestAnimationFrame(loop);
    };
    loop();

    const hoverSel = 'a,button,[role="button"],.link,.tile,.btn,input,textarea,select,label,summary';

    document.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse') return;
      if (e.target.closest(hoverSel)) {
        ringCur.classList.add('cursor--hover');
      }
    });

    document.addEventListener('pointerout', e => {
      if (e.pointerType !== 'mouse') return;
      if (!e.relatedTarget || !e.relatedTarget.closest(hoverSel)) {
        ringCur.classList.remove('cursor--hover');
      }
    });

    window.addEventListener('mouseout', e => {
      if (!e.relatedTarget) {
        dotCur.style.opacity  = '0';
        ringCur.style.opacity = '0';
      }
    });

    window.addEventListener('mouseenter', () => {
      dotCur.style.opacity  = '1';
      ringCur.style.opacity = '1';
    });

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

  /* ===== Float labels ===== */
  qsa('.field').forEach(f => {
    const input = f.querySelector('.input');
    if (!input) return;
    const toggle = () => f.classList.toggle('filled', !!input.value);
    input.addEventListener('input', toggle);
    input.addEventListener('blur', toggle);
    toggle();
  });

  /* ===== Lead form submit ===== */
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
});


