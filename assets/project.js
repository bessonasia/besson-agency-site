// =========================
// HELPERS
// =========================
const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const lerp = (a, b, t) => a + (b - a) * t;

// =========================
// BLOCK 1: NAV + MOBILE MENU
// =========================
function initNavAndMobileMenu() {
  const nav           = qs('.nav');
  const coreTriggerEl = qs('.core-trigger');
  const mobileMenuEl  = qs('#mobileMenu');

  if (!nav) return;

  // Логика открытия/закрытия мобильного меню
  if (coreTriggerEl && mobileMenuEl) {
    let menuOpen = false;

    const lockScroll = (lock) => {
      const html = document.documentElement;
      if (lock) {
        html.style.overflowY = 'hidden';
        document.body.style.overflowY = 'hidden';
      } else {
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
      lockScroll(open);
    };

    coreTriggerEl.addEventListener('click', () => {
      setMenuState(!menuOpen);
    });

    // Закрытие при клике по пункту
    qsa('.mobile-menu__link', mobileMenuEl).forEach(link => {
      link.addEventListener('click', () => {
        if (menuOpen) setMenuState(false);
      });
    });
  }

  // Автоматическое переключение тёмной/светлой шапки
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

  let ticking = false;
  const onScrollOrResize = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateNavOnLight();
      ticking = false;
    });
  };

  updateNavOnLight();
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
}

// =========================
// BLOCK 2: FORM + FLOAT LABELS
// =========================
function initLeadForm() {
  const form     = qs('#leadForm');
  const statusEl = qs('#formStatus');

  if (!form || !statusEl) return;

  // Float labels внутри формы
  qsa('.field', form).forEach(field => {
    const input = field.querySelector('.input');
    if (!input) return;

    const toggle = () => field.classList.toggle('filled', !!input.value);
    input.addEventListener('input', toggle);
    input.addEventListener('blur', toggle);
    toggle();
  });

  // Glow на кнопке
  qsa('.btn', form).forEach(btn => {
    const glow = btn.querySelector('.glow');
    if (!glow) return;

    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      glow.style.setProperty('--x', ((e.clientX - r.left) / r.width * 100) + '%');
      glow.style.setProperty('--y', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
  });

  const endpoint = form.action || 'https://api.web3forms.com/submit';

  const onSubmit = async (e) => {
    // HTML5-валидация
    if (!form.checkValidity()) {
      e.preventDefault();
      statusEl.textContent = 'Проверьте имя и телефон.';
      statusEl.classList.remove('form__status--success');
      statusEl.classList.add('form__status--error');
      return;
    }

    e.preventDefault();

    const formData  = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    statusEl.textContent = 'Отправляем...';
    statusEl.classList.remove('form__status--success', 'form__status--error');

    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Bad response: ' + res.status);

      let data = null;
      try {
        data = await res.json();
      } catch (_) {}

      if (data && data.success === false) {
        throw new Error(data.message || 'Web3Forms error');
      }

      form.reset();
      qsa('.field', form).forEach(f => f.classList.remove('filled'));

      statusEl.textContent = 'Все получилось! Мы уже обрабатываем вашу заявку.';
      statusEl.classList.add('form__status--success');
    } catch (err) {
      console.error('Web3Forms AJAX failed, fallback to normal submit:', err);
      statusEl.textContent = '';
      statusEl.classList.remove('form__status--success', 'form__status--error');
      form.removeEventListener('submit', onSubmit);
      form.submit();
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  form.addEventListener('submit', onSubmit);
}

// =========================
// BLOCK 3: PREMIUM CURSOR
// =========================
function initPremiumCursor() {
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const dotCur  = qs('#cursorDot');
  const ringCur = qs('#cursorRing');

  if (!isFinePointer || !dotCur || !ringCur) return;

  let dx = window.innerWidth / 2;
  let dy = window.innerHeight / 2;
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
}

// =========================
// OTHER: YEAR IN FOOTER
// =========================
function initYear() {
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// =========================
// BOOTSTRAP
// =========================
document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initNavAndMobileMenu();
  initLeadForm();
  initPremiumCursor();
});

