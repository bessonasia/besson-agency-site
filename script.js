/* ========== helpers ========== */
const qs  = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const lerp = (a,b,t)=>a+(b-a)*t;

/* ensure system cursor never shows on desktop (Safari-safe) */
(function enforceNoCursor(){
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const apply=()=>{
    document.documentElement.style.cursor='none';
    if (document.body) document.body.style.cursor='none';
  };
  apply();
  window.addEventListener('mousemove',apply,{passive:true});
  window.addEventListener('mouseenter',apply,{passive:true});
  window.addEventListener('focus',apply,{passive:true});
  new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['style','class']});
})();

/* DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  const isMobile      = window.matchMedia('(max-width: 768px)').matches;
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* Year */
  const yearEl = qs('#year'); 
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========== Logo: build spans ========== */
  const logoText = qs('#logoText');
  let logoSpans = [];
  if (logoText){
    const text = (logoText.getAttribute('aria-label') || logoText.textContent || 'Besson Agency').trim();
    logoText.innerHTML = text
      .split('')
      .map(ch => ch === ' '
        ? '<span data-space="true">&nbsp;</span>'
        : `<span>${ch}</span>`
      ).join('');
    logoSpans = qsa('span', logoText);
  }

  /* Desktop micro-hover on letters */
  if (logoSpans.length && !isMobile){
    logoSpans.forEach(span => {
      if (span.dataset.space === 'true') return;
      span.style.transition = 'transform .22s ease-out';
      span.addEventListener('mouseenter', ()=>{
        span.style.transform='translateY(-6px) scale(1.06)';
      });
      span.addEventListener('mouseleave', ()=>{
        span.style.transform='translateY(0) scale(1)';
      });
    });
  }

  /* Mobile: Netflix-like spread on scroll */
  if (logoSpans.length && isMobile){
    const letters = logoSpans.filter(s=>s.dataset.space!=='true');
    const MAX_SCROLL_BASE = 600;               // можно увеличить/уменьшить «ход»
    let   maxScroll = Math.max(innerHeight*1.1, MAX_SCROLL_BASE);
    let   breathing=false, ticking=false;

    const recalc = ()=>{ maxScroll=Math.max(innerHeight*1.1, MAX_SCROLL_BASE); };
    const applySpread = ()=>{
      const s = Math.min(scrollY, maxScroll);
      const p = maxScroll===0?0:s/maxScroll;   // 0..1
      const scale  = 1 + p*1.6;                // масштаб букв
      const spread = p*120;                    // разлет по X
      const glow   = 8 + p*32;

      let i=0;
      logoSpans.forEach(span=>{
        if (span.dataset.space==='true'){
          span.style.transform='translateX(0) scale(1)';
          span.style.textShadow='none';
          return;
        }
        const dir=(i++%2===0)?-1:1;
        span.style.transform=`translateX(${dir*spread}px) scale(${scale})`;
        span.style.textShadow=`0 0 ${glow}px rgba(255,255,255,${0.15+p*0.35})`;
      });

      if (p>0.95 && !breathing){
        logoText.classList.add('breathe');
        breathing=true;
      } else if (p<0.9 && breathing){
        logoText.classList.remove('breathe');
        breathing=false;
      }
    };

    const onScroll=()=>{
      if (!ticking){
        requestAnimationFrame(()=>{
          applySpread();
          ticking=false;
        });
        ticking=true;
      }
    };

    recalc(); 
    applySpread();
    addEventListener('scroll', onScroll, {passive:true});
    addEventListener('resize', ()=>{
      recalc(); 
      applySpread();
    }, {passive:true});
  }

  /* Interlude word swap */
  const swapEl = qs('#swap');
  if (swapEl){
    const words = ['Event.','Creative.','BTL.','POSM.'];
    let i=0;
    setInterval(()=>{
      i=(i+1)%words.length;
      swapEl.textContent=words[i];
    }, 2500);
  }

  /* Mobile menu */
  const burger = qs('.menu-toggle');
  const mobileMenu = qs('#mobileMenu');
  if (burger && mobileMenu){
    const lock = v => {
      document.documentElement.style.overflow = v?'hidden':'';
      document.body.style.overflow = v?'hidden':'';
      document.body.style.touchAction = v?'none':'';
    };
    burger.addEventListener('click', ()=>{
      const active = burger.classList.toggle('active');
      mobileMenu.classList.toggle('active', active);
      mobileMenu.setAttribute('aria-hidden', active?'false':'true');
      burger.setAttribute('aria-expanded', active?'true':'false');
      lock(active);
    });
    qsa('a', mobileMenu).forEach(a=>a.addEventListener('click', ()=>{
      if (!burger.classList.contains('active')) return;
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden','true');
      burger.setAttribute('aria-expanded','false');
      lock(false);
    }));
  }

  /* Premium cursor (desktop) */
  const dot = qs('#cursorDot');
  const ring = qs('#cursorRing');
  if (isFinePointer && dot && ring){
    let dx=innerWidth/2, dy=innerHeight/2, rx=dx, ry=dy, tx=dx, ty=dy;

    // === Настройка «прилипания» курсора ===
    const DOT_LERP  = 0.35;   // точка (быстрее)
    const RING_LERP = 0.12;   // кольцо (медленнее/«летает дольше»)

    const move = e => {
      tx=e.clientX; 
      ty=e.clientY; 
      dot.style.opacity='1'; 
      ring.style.opacity='1';
    };
    addEventListener('mousemove', move, {passive:true});

    const loop=()=>{
      dx=lerp(dx,tx,DOT_LERP); 
      dy=lerp(dy,ty,DOT_LERP);
      rx=lerp(rx,tx,RING_LERP); 
      ry=lerp(ry,ty,RING_LERP);
      dot.style.transform=`translate(${dx}px,${dy}px)`;
      ring.style.transform=`translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    // hover-индикатор
    const hoverSel = 'a,button,[role="button"],.link,.tile,.btn,input,textarea,select,label,summary';
    document.addEventListener('pointerover', e=>{
      if (e.pointerType!=='mouse') return;
      if (e.target.closest(hoverSel)) ring.classList.add('cursor--hover');
    });
    document.addEventListener('pointerout', e=>{
      if (e.pointerType!=='mouse') return;
      if (!e.relatedTarget || !e.relatedTarget.closest(hoverSel)) {
        ring.classList.remove('cursor--hover');
      }
    });

    // скрывать при уходе за окно
    addEventListener('mouseout', e=>{
      if (!e.relatedTarget){
        dot.style.opacity='0'; 
        ring.style.opacity='0';
      }
    });
    addEventListener('mouseenter', ()=>{
      dot.style.opacity='1'; 
      ring.style.opacity='1';
    });

    // кнопка — свечения
    qsa('.btn').forEach(btn=>{
      const glow = btn.querySelector('.glow');
      if (!glow) return;
      btn.addEventListener('mousemove', e=>{
        const r=btn.getBoundingClientRect();
        glow.style.setProperty('--x', ((e.clientX-r.left)/r.width*100)+'%');
        glow.style.setProperty('--y', ((e.clientY-r.top)/r.height*100)+'%');
      });
    });
  }

  /* Float labels for inputs */
  qsa('.field').forEach(f=>{
    const input = f.querySelector('.input');
    if (!input) return;
    const toggle=()=>f.classList.toggle('filled', !!input.value);
    input.addEventListener('input',toggle); 
    input.addEventListener('blur',toggle); 
    toggle();
  });

  /* ========== Lead form: submit handler ========== */
  const form   = qs('#leadForm');
  const status = qs('#formStatus');

  if (form && status) {
    const nameInput  = form.elements['name'];
    const phoneInput = form.elements['phone'];
    const honeyInput = form.querySelector('input[name="_honey"]');
    const submitBtn  = form.querySelector('button[type="submit"]');

    // аккуратный сеттер статуса
    const setStatus = (msg, type) => {
      status.textContent = msg || '';
      status.classList.remove('form__status--success','form__status--error');
      if (type) status.classList.add(type);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // honeypot: если бот заполнил скрытое поле — тихо выходим
      if (honeyInput && honeyInput.value.trim() !== '') {
        return;
      }

      const name  = nameInput ? nameInput.value.trim()  : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';

      // простая проверка заполненности
      if (!name || !phone) {
        setStatus('Пожалуйста, укажите имя и номер телефона.','form__status--error');
        return;
      }

      // базовая проверка формата телефона
      const phoneOk = /^[\d\s+\-()]{6,}$/.test(phone);
      if (!phoneOk) {
        setStatus('Проверьте формат номера телефона.','form__status--error');
        return;
      }

      setStatus('Отправляем заявку...', null);
      if (submitBtn) submitBtn.disabled = true;

      // можно использовать для визуальных состояний в CSS, если захочешь
      form.classList.add('form--submitting');

      try {
        const payload = {
          name,
          phone,
          source: 'besson.asia',
          ts: new Date().toISOString()
        };

        // TODO: сюда вставляем реальный endpoint (Telegram, CRM, почтовый сервис и т.п.)
        const ENDPOINT = ''; // пример: 'https://your-api.example.com/lead'

        if (ENDPOINT) {
          const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error('Network error: ' + res.status);
        } else {
          // временно — просто логируем, но для пользователя форма «отправлена»
          console.log('[LeadForm] payload:', payload);
        }

        setStatus('Заявка отправлена. Мы свяжемся с вами в рабочие часы.','form__status--success');

        // чистим поля и состояния «filled» для плавающих лейблов
        form.reset();
        qsa('.field', form).forEach(f => f.classList.remove('filled'));

        // GTM / dataLayer — чтобы можно было строить аналитику
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event:      'leadFormSubmit',
          formName:   'bessonLeadForm',
          formStatus: 'success'
        });

      } catch (err) {
        console.error('[LeadForm] error:', err);
        setStatus('Не удалось отправить заявку. Попробуйте ещё раз позже.','form__status--error');

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event:      'leadFormSubmit',
          formName:   'bessonLeadForm',
          formStatus: 'error'
        });
      } finally {
        form.classList.remove('form--submitting');
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

});
