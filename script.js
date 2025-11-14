// ===== Утилиты =====
const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const lerp = (a, b, t) => a + (b - a) * t;

document.addEventListener('DOMContentLoaded', () => {
  const isMobile      = window.matchMedia('(max-width: 768px)').matches;
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  // ===== 1. Год в футере =====
  const yearEl = qs('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== 2. Логотип: сборка по буквам =====
  const logoText = qs('#logoText');
  let logoSpans = [];

  if (logoText) {
    const text = (logoText.getAttribute('aria-label') || logoText.textContent || 'Besson Agency').trim();

    logoText.innerHTML = text
      .split('')
      .map(ch => {
        if (ch === ' ') {
          return '<span data-space="true">&nbsp;</span>';
        }
        return `<span>${ch}</span>`;
      })
      .join('');

    logoSpans = qsa('span', logoText);
  }

  // ===== 3. Десктоп: ховер по буквам (микроанимация) =====
  if (logoSpans.length && !isMobile) {
    logoSpans.forEach(span => {
      if (span.dataset.space === 'true') return;
      span.style.transition = 'transform 0.22s ease-out';

      span.addEventListener('mouseenter', () => {
        span.style.transform = 'translateY(-6px) scale(1.06)';
      });

      span.addEventListener('mouseleave', () => {
        span.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // ===== 4. Мобилка: Netflix-анимация логотипа при скролле =====
  if (logoSpans.length && isMobile) {
    const letters = logoSpans.filter(s => s.dataset.space !== 'true');
    const maxScrollBase = 600;
    let maxScroll = Math.max(window.innerHeight * 1.1, maxScrollBase);
    let breathing = false;
    let ticking = false;

    const recalcMaxScroll = () => {
      maxScroll = Math.max(window.innerHeight * 1.1, maxScrollBase);
    };

    const applySpread = () => {
      const s = Math.min(window.scrollY, maxScroll);
      const p = maxScroll === 0 ? 0 : s / maxScroll; // 0..1

      // масштаб и “сила” разлёта
      const scale  = 1 + p * 1.6;       // чем ниже — тем крупнее
      const spread = p * 120;           // насколько далеко разъезжаются
      const glow   = 8 + p * 32;        // сила свечения

      let index = 0;

      logoSpans.forEach(span => {
        const isSpace = span.dataset.space === 'true';
        if (isSpace) {
          span.style.transform   = 'translateX(0px) scale(1)';
          span.style.textShadow  = 'none';
          return;
        }

        // Чередуем направление: буквы идут влево/вправо поочерёдно
        const dir = (index++ % 2 === 0) ? -1 : 1;
        const tx  = dir * spread;

        span.style.transform  = `translateX(${tx}px) scale(${scale})`;
        span.style.textShadow = `0 0 ${glow}px rgba(255,255,255,${0.15 + p * 0.35})`;
      });

      // Лёгкий “breathing”-эффект на пике (если ты захочешь анимировать классом .breathe в CSS)
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
        window.requestAnimationFrame(() => {
          applySpread();
          ticking = false;
        });
        ticking = true;
      }
    };

    // стартовые значения
    recalcMaxScroll();
    applySpread();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      recalcMaxScroll();
      applySpread();
    }, { passive: true });
  }

  // ===== 5. Смена слов в interlude (Event / Creative / BTL / POSM) =====
  const swapEl = qs('#swap');
  if (swapEl) {
    const words = ['Event.', 'Creative.', 'BTL.', 'POSM.'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      swapEl.textContent = words[i];
    }, 2500);
  }

  // ===== 6. Мобильное меню (гамбургер) =====
  const burger = qs('.menu-toggle');
  const mobileMenu = qs('#mobileMenu');

  if (burger && mobileMenu) {
    const lockBody = lock => {
      document.documentElement.style.overflow = lock ? 'hidden' : '';
      document.body.style.overflow = lock ? 'hidden' : '';
      document.body.style.touchAction = lock ? 'none' : '';
    };

    burger.addEventListener('click', () => {
      const active = burger.classList.toggle('active');
      mobileMenu.classList.toggle('active', active);
      mobileMenu.setAttribute('aria-hidden', active ? 'false' : 'true');
      burger.setAttribute('aria-expanded', active ? 'true' : 'false');
      lockBody(active);
    });

    // закрываем меню по клику на ссылку
    qsa('a', mobileMenu).forEach(a => {
      a.addEventListener('click', () => {
        if (!burger.classList.contains('active')) return;
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        burger.setAttribute('aria-expanded', 'false');
        lockBody(false);
      });
    });
  }

  // ===== 7. Премиальный курсор (десктоп) =====
  const dot  = qs('#cursorDot');
  const ring = qs('#cursorRing');

  if (isFinePointer && dot && ring) {
    let dx = window.innerWidth / 2;
    let dy = window.innerHeight / 2;
    let rx = dx;
    let ry = dy;
    let targetX = dx;
    let targetY = dy;

    const DOT_LERP  = 0.35;
    const RING_LERP = 0.12;

    const move = e => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', move, { passive: true });

    const loop = () => {
      dx = lerp(dx, targetX, DOT_LERP);
      dy = lerp(dy, targetY, DOT_LERP);
      rx = lerp(rx, targetX, RING_LERP);
      ry = lerp(ry, targetY, RING_LERP);

      dot.style.transform  = `translate(${dx}px, ${dy}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;

      requestAnimationFrame(loop);
    };
    loop();

    const hoverSel = 'a, button, [role="button"], .link, .tile, .btn, input, textarea, select, label, summary';
    qsa(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor--hover'));
    });

    window.addEventListener('mouseout', e => {
      if (!e.relatedTarget) {
        dot.style.opacity  = '0';
        ring.


