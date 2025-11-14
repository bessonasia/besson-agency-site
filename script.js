// helpers
const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];
const lerp = (a,b,t)=>a+(b-a)*t;

document.addEventListener('DOMContentLoaded', () => {
  const isMobile      = matchMedia('(max-width: 768px)').matches;
  const isFinePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* 1) Анимируем логотип (верхний и центральный по буквам) */
  const logoText = qs('#logoText');
  if (logoText) {
    const text = (logoText.getAttribute('aria-label') || 'Besson Agency').trim();
    logoText.innerHTML = text.split('').map(ch=>{
      const isSpace = ch === ' ';
      return `<span ${isSpace ? 'data-space="true"' : ''}>${isSpace?'&nbsp;':ch}</span>`;
    }).join('');

    const spans = qsa('#logoText span');

    // Ховер по буквам — только на десктопе, чтобы не мешать мобиле
    if (!isMobile) {
      spans.forEach(s=>{
        if (s.dataset.space) return;
        s.addEventListener('mouseenter', ()=>{
          s.style.transform = 'translateY(-6px) scale(1.06)';
        });
        s.addEventListener('mouseleave', ()=>{
          s.style.transform = 'translateY(0) scale(1)';
        });
      });
    }

    // 7) Мобильный «разъезд» логотипа при прокрутке вниз
    if (isMobile) {
      const letterSpans = spans.filter(s => !s.dataset.space);
      const half = Math.ceil(letterSpans.length / 2);
      const maxShift = 12; // px — насколько далеко разъезжаются буквы

      const updateFromScroll = () => {
        // t от 0 до 1, по мере прокрутки вниз
        const t = Math.max(0, Math.min(1, window.scrollY / 220));
        letterSpans.forEach((s, i) => {
          const dir   = i < half ? -1 : 1;     // левая часть влево, правая вправо
          const shift = dir * t * maxShift;
          s.style.transform = `translateX(${shift}px)`;
        });
      };

      updateFromScroll();
      window.addEventListener('scroll', updateFromScroll, { passive: true });
    }
  }

  /* 2) Смена слов в interlude (Event / Creative / BTL / POSM) */
  const swapEl = qs('#swap');
  if (swapEl) {
    const words = ['Event.', 'Creative.', 'BTL.', 'POSM.'];
    let i = 0;
    setInterval(()=>{ i=(i+1)%words.length; swapEl.textContent = words[i]; }, 2500);
  }

  /* 3) Mobile menu */
  const burger = qs('.menu-toggle');
  const mnav   = qs('.mobile-menu');
  if (burger && mnav){
    burger.addEventListener('click', ()=>{
      const on = burger.classList.toggle('active');
      mnav.classList.toggle('active', on);
      mnav.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
  }

  /* 4) Премиальный курсор (desktop only) */
  const dot  = qs('#cursorDot');
  const ring = qs('#cursorRing');
  if (isFinePointer && dot && ring){
    let dx=0, dy=0, rx=0, ry=0;
    let mx=window.innerWidth/2, my=window.innerHeight/2;
    const DOT_LERP  = 0.35;
    const RING_LERP = 0.12;

    const onMove = (e)=>{
      mx = e.clientX; my = e.clientY;
      dot.style.opacity = ring.style.opacity = '1';
    };
    window.addEventListener('mousemove', onMove, {passive:true});

    const raf = ()=>{
      dx = lerp(dx, mx, DOT_LERP);
      dy = lerp(dy, my, DOT_LERP);
      rx = lerp(rx, mx, RING_LERP);
      ry = lerp(ry, my, RING_LERP);
      dot.style.transform  = `translate(${dx}px, ${dy}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(raf);
    };
    raf();

    const hoverSel = 'a, button, [role="button"], .link, .tile, .btn, input, textarea, select, label, summary';
    qsa(hoverSel).forEach(el=>{
      el.addEventListener('mouseenter', ()=> ring.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', ()=> ring.classList.remove('cursor--hover'));
    });

    window.addEventListener('mouseout', (e)=>{
      if (!e.relatedTarget) { dot.style.opacity = ring.style.opacity = '0'; }
    });
  } else {
    // мобильные: на всякий случай скрываем элементы курсора
    if (dot)  dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  /* 5) Кнопка: эффект «светового пятна» по курсору */
  qsa('.btn').forEach(btn=>{
    const glow = qs('.glow', btn);
    if (!glow) return;
    btn.addEventListener('pointermove', (e)=>{
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top)  / r.height)* 100;
      glow.style.setProperty('--x', x + '%');
      glow.style.setProperty('--y', y + '%');
    });
  });

  /* 6) Формочка — UX + год */
  qsa('.field .input').forEach(inp=>{
    const wrap = inp.closest('.field');
    const sync = ()=> wrap.classList.toggle('filled', !!inp.value.trim());
    inp.addEventListener('input', sync); sync();
  });
  const yearEl = qs('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
});


