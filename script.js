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

    /* ===== Mobile menu — луна ===== */
  const moonTrigger = qs('.moon-trigger');
  const mobileMenu  = qs('#mobileMenu');

  if (moonTrigger && mobileMenu) {
    const lock = (v) => {
      document.documentElement.style.overflow = v ? 'hidden' : '';
      document.body.style.overflow           = v ? 'hidden' : '';
      document.body.style.touchAction        = v ? 'none'   : '';
    };

    const setState = (active) => {
      moonTrigger.classList.toggle('active', active);
      mobileMenu.classList.toggle('active', active);
      mobileMenu.setAttribute('aria-hidden', active ? 'false' : 'true');
      moonTrigger.setAttribute('aria-expanded', active ? 'true' : 'false');
      lock(active);
    };

    // тап по луне — переключаем меню туда-обратно
    moonTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !moonTrigger.classList.contains('active');
      setState(willOpen);
    });

    // клик по пункту меню — закрываем
    qsa('a', mobileMenu).forEach(a => {
      a.addEventListener('click', () => setState(false));
    });

    // клик по затемнённому фону вокруг — тоже закрываем
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) setState(false);
    });

    // закрытие по Esc (на всякий случай)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setState(false);
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

});

