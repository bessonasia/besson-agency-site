// helpers
const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];
const lerp = (a,b,t)=>a+(b-a)*t;

document.addEventListener('DOMContentLoaded', () => {
  /* 1) Анимируем логотип (верхний и центральный по буквам) */
  const logoText = qs('#logoText');
  if (logoText) {
    const text = (logoText.getAttribute('aria-label') || 'Besson Agency').trim();
    logoText.innerHTML = text.split('').map(ch=>{
      const isSpace = ch === ' ';
      return `<span ${isSpace ? 'data-space="true"' : ''}>${isSpace?'&nbsp;':ch}</span>`;
    }).join('');
    // ховер по букве
    qsa('#logoText span').forEach(s=>{
      if (s.dataset.space) return;
      s.addEventListener('mouseenter', ()=> s.style.transform = 'translateY(-6px) scale(1.06)');
      s.addEventListener('mouseleave', ()=> s.style.transform = 'translateY(0) scale(1)');
    });
  }

  /* 2) Смена слов в interlude (Event / Creative / BTL / POSM) — мягкий цикл */
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
  const isFine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const dot  = qs('#cursorDot');
  const ring = qs('#cursorRing');
  if (isFine && dot && ring){
    let dx=0, dy=0, rx=0, ry=0;
    let mx=window.innerWidth/2, my=window.innerHeight/2;
    const DOT_LERP  = 0.35; // скорость точки
    const RING_LERP = 0.12; // скорость кольца

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

    // Ховер по интерактиву
    const hoverSel = 'a, button, [role="button"], .link, .tile, .btn, input, textarea, select, label, summary';
    qsa(hoverSel).forEach(el=>{
      el.addEventListener('mouseenter', ()=> ring.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', ()=> ring.classList.remove('cursor--hover'));
    });

    // прячем при уходе
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

  /* 6) Формочка — небольшой UX */
  qsa('.field .input').forEach(inp=>{
    const wrap = inp.closest('.field');
    const sync = ()=> wrap.classList.toggle('filled', !!inp.value.trim());
    inp.addEventListener('input', sync); sync();
  });
  const yearEl = qs('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 7) Мобильный «разъезд» логотипа при свайпе/скролле вниз */
  const isMobile = matchMedia('(max-width: 768px)').matches;
  if (isMobile && logoText){
    let startY = null;
    const spans = qsa('#logoText span').filter(s=>!s.dataset.space);
    const half = Math.ceil(spans.length/2);

    const apply = (delta)=>{
      const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
      const t = clamp(delta/120, 0, 1); // нормируем силу эффекта
      // левая половина влево, правая вправо
      spans.forEach((s, i)=>{
        const dir = i < half ? -1 : 1;
        const shift = dir * t * 10; // px
        s.style.transform = `translate(${shift}px, 0)`;
      });
    };

    // по прокрутке вниз
    let lastY = window.scrollY;
    window.addEventListener('scroll', ()=>{
      const dy = Math.max(0, window.scrollY - lastY);
      lastY = window.scrollY;
      apply(dy);
      // лёгкая отдача назад
      clearTimeout(apply._t);
      apply._t = setTimeout(()=> spans.forEach(s=> s.style.transform=''), 140);
    }, {passive:true});

    // по свайпу
    window.addEventListener('touchstart', (e)=>{ startY = e.touches[0].clientY; }, {passive:true});
    window.addEventListener('touchmove',  (e)=>{
      if (startY==null) return;
      const dy = Math.max(0, e.touches[0].clientY - startY);
      apply(dy);
    }, {passive:true});
    window.addEventListener('touchend',   ()=>{ spans.forEach(s=> s.style.transform=''); startY=null; }, {passive:true});
  }
});

