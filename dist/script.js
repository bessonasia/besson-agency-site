// =======================
// CodePen-safe DOM ready
// =======================
const onReady = (cb)=> (document.readyState !== 'loading') ? cb() : document.addEventListener('DOMContentLoaded', cb);

onReady(()=>{

  // --- Footer year ---
  try {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  } catch(e){ console.warn('year:', e); }

  // --- LOGO: build "BESSON AGENCY" letters + hover micro-interactions ---
  let logoText;
  try {
    logoText = document.getElementById("logoText");
    if (logoText) {
      const logoString = "BESSON AGENCY";
      logoText.innerHTML = logoString.split("")
        .map(ch => ch === " " ? '<span data-space="true">&nbsp;</span>' : `<span>${ch}</span>`).join("");

      const spans = Array.from(logoText.querySelectorAll("span")).filter(s => !s.dataset.space);
      spans.forEach((span)=>{
        span.addEventListener("mouseenter", ()=>{
          span.style.transform = "translateY(-4px) scale(1.25)";
          span.style.textShadow = "0 0 18px rgba(255,255,255,0.35)";
        });
        span.addEventListener("mouseleave", ()=>{
          span.style.transform = "translateY(0) scale(1)";
          span.style.textShadow = "none";
        });
      });
    }
  } catch(e){ console.warn('logo init:', e); }

  // --- LOGO MOBILE SCROLL ANIMATION (reactive to breakpoint changes) ---
  try {
    if (!logoText) logoText = document.getElementById('logoText');
    if (logoText){
      const mq = window.matchMedia('(max-width: 768px)');
      let cleanup = null; // function to remove listeners & reset styles

      function activate(){
        const letters = Array.from(logoText.querySelectorAll('span'));
        const maxScroll = Math.max(window.innerHeight * 1.1, 600);
        let breathing = false;
        let ticking = false;

        function applySpread(){
          const s = Math.min(window.scrollY, maxScroll);
          const p = s / maxScroll;
          const scale = 1 + p * 1.6;
          const spread = p * 120;
          const glow = 8 + p * 32;
          let i = 0;

          letters.forEach((span)=>{
            const isSpace = span.dataset.space === 'true' || span.textContent.trim() === '';
            if(isSpace){
              span.style.transform = 'translateX(0) scale(1)';
              span.style.textShadow = 'none';
              return;
            }
            const dir = (i++ % 2 === 0) ? -1 : 1;
            const tx = dir * spread;
            span.style.transform = `translateX(${tx}px) scale(${scale})`;
            span.style.textShadow = `0 0 ${glow}px rgba(255,255,255,${0.10 + p * 0.5})`;
          });

          if (p > 0.95 && !breathing){ logoText.classList.add('breathe'); breathing = true; }
          if (p < 0.90 && breathing){ logoText.classList.remove('breathe'); breathing = false; }
        }

        function onScroll(){
          if(!ticking){
            requestAnimationFrame(()=>{ applySpread(); ticking = false; });
            ticking = true;
          }
        }

        window.addEventListener('scroll', onScroll, {passive:true});
        applySpread(); // initial

        return ()=>{
          window.removeEventListener('scroll', onScroll);
          logoText.classList.remove('breathe');
          letters.forEach((span)=>{
            span.style.transform = '';
            span.style.textShadow = '';
          });
        };
      }

      function recheck(){
        if (mq.matches){
          if (!cleanup) cleanup = activate();
        } else if (cleanup){
          cleanup();
          cleanup = null;
        }
      }

      if (mq.addEventListener) mq.addEventListener('change', recheck);
      else mq.addListener(recheck);
      recheck(); // initial run
    }
  } catch(e){ console.warn('logo mobile anim:', e); }

  // --- MOBILE MENU: scroll lock + Esc + focus trap + stagger ---
  try {
    const mq = window.matchMedia('(max-width: 768px)');
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('mobileMenu');
    if(toggle && menu){
      const focusableSel = 'a, button, [tabindex]:not([tabindex="-1"])';
      let lastFocus = null;

      const lockBody = (lock)=>{
        document.documentElement.style.overflow = lock ? 'hidden' : '';
        document.body.style.overflow = lock ? 'hidden' : '';
        document.body.style.touchAction = lock ? 'none' : '';
      };

      const setStagger = (active)=>{
        const items = menu.querySelectorAll('li');
        items.forEach((li,i)=>{ li.style.transitionDelay = active ? `${i*0.1}s` : '0s'; });
      };

      const onKey = (e)=>{
        if(e.key === 'Escape'){ closeMenu(); }
        else if(e.key === 'Tab' && menu.classList.contains('active')){
          const f = menu.querySelectorAll(focusableSel);
          if(!f.length) return;
          const first = f[0], last = f[f.length-1];
          if(e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
          else if(!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
        }
      };

      const openMenu = ()=>{
        lastFocus = document.activeElement;
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded','true');
        menu.classList.add('active');
        menu.setAttribute('aria-hidden','false');
        setStagger(true);
        lockBody(true);
        const first = menu.querySelector(focusableSel);
        if(first) first.focus();
        document.addEventListener('keydown', onKey);
      };

      const closeMenu = ()=>{
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded','false');
        menu.classList.remove('active');
        menu.setAttribute('aria-hidden','true');
        setStagger(false);
        lockBody(false);
        document.removeEventListener('keydown', onKey);
        if(lastFocus) lastFocus.focus();
      };

      const maybeToggle = ()=>{
        if(!mq.matches){ closeMenu(); return; } // always closed on desktop
        menu.classList.contains('active') ? closeMenu() : openMenu();
      };

      toggle.addEventListener('click', maybeToggle);
      menu.addEventListener('click', (e)=>{ if(e.target.matches('a')) closeMenu(); });
    }
  } catch(e){ console.warn('mobile menu:', e); }

  // --- INTERLUDE: rotating words Event / Creative / BTL / POSM ---
  try {
    const words = ["Event.", "Creative.", "BTL.", "POSM."];
    const swap = document.getElementById("swap");
    if (swap){
      let wi = 0;
      setInterval(() => {
        swap.textContent = words[wi];
        if (swap.animate) swap.animate([{opacity:0},{opacity:1}], {duration:600});
        wi = (wi + 1) % words.length;
      }, 1800);
    }
  } catch(e){ console.warn('swap:', e); }

  // --- Floating labels ---
  try {
    document.querySelectorAll(".input").forEach((inp) => {
      const f = inp.parentNode;
      const toggle = () => f.classList.toggle("filled", !!inp.value.trim());
      toggle();
      inp.addEventListener("input", toggle);
      inp.addEventListener("blur", toggle);
    });
  } catch(e){ console.warn('labels:', e); }

  // --- Form submit (honeypot + phone normalization) ---
  try {
    const leadForm = document.getElementById("leadForm");
    const statusNode = document.getElementById("formStatus");
    if(leadForm && statusNode){
      const submitBtn = leadForm.querySelector(".btn");
      const endpoint = "https://formsubmit.co/ajax/hello@besson.asia";

      const updateStatus = (message = "", mode = "")=>{
        statusNode.textContent = message;
        statusNode.className = `form__status ${mode ? `form__status--${mode}` : ""}`.trim();
      };

      leadForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!leadForm.reportValidity()) return;

        const formData = new FormData(leadForm);
        if (formData.get('_honey')) { updateStatus("Ошибка. Попробуйте другой способ связи.", "error"); return; }

        const raw = (formData.get('phone') || '').toString();
        formData.set('phone', raw.replace(/[^\d\+]/g,''));

        if (submitBtn) submitBtn.disabled = true;
        updateStatus("Отправляем…");

        try {
          const response = await fetch(endpoint, { method: "POST", headers: { "Accept": "application/json" }, body: formData });
          if (!response.ok) throw new Error(`Request failed: ${response.status}`);
          updateStatus("Спасибо! Мы свяжемся с вами в ближайшее время.", "success");
          leadForm.reset();
          leadForm.querySelectorAll(".field").forEach((field) => field.classList.remove("filled"));
        } catch (error) {
          updateStatus("Не удалось отправить заявку. Попробуйте снова или свяжитесь по WhatsApp.", "error");
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }
  } catch(e){ console.warn('form:', e); }

  // --- Premium cursor (desktop only: hover:hover & pointer:fine) ---
  try {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (fine.matches){
      const dot = document.getElementById("cursorDot");
      const ring = document.getElementById("cursorRing");
      if (dot && ring){
        let tx = 0, ty = 0, x = 0, y = 0;

        window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
        (function anim(){
          x += (tx - x) * 0.17;
          y += (ty - y) * 0.17;
          dot.style.transform = `translate(${x}px, ${y}px)`;
          ring.style.transform = `translate(${x}px, ${y}px)`;
          requestAnimationFrame(anim);
        })();

        const addHover = (el)=>{
          el.addEventListener("mouseenter", () => ring.classList.add("cursor--hover"));
          el.addEventListener("mouseleave", () => ring.classList.remove("cursor--hover"));
        };
        document.querySelectorAll("a, button, .input, .icon-btn, .btn").forEach(addHover);
      }
    }
  } catch(e){ console.warn('cursor:', e); }

});
/* no-op patch for JS */
/* Force a line break before "Реализуем" inside the description title */
(function () {
  var el = document.querySelector('section.stage#about .stage__title');
  if (!el || el.dataset.broken === '1') return;

  // Вставляем перенос строки перед словом "Реализуем" (первое вхождение)
  // Сохраняем остальную разметку как есть.
  el.innerHTML = el.innerHTML.replace(/Реализуем/, '<br>Реализуем');

  el.dataset.broken = '1';
})();
// Центрируем #about при переходе по якорю "Об агентстве"
(function(){
  const about  = document.querySelector('section.stage#about');
  if (!about) return;

  // Считаем высоту фиксированной шапки, если она реально fixed
  const header = document.querySelector('.nav, header.nav, .site-header');
  const getHeaderH = () => {
    if (!header) return 0;
    const cs = getComputedStyle(header);
    return cs.position === 'fixed' ? header.offsetHeight : 0;
  };

  // Скроллим так, чтобы центр секции оказался в центре экрана
  const scrollCenterTo = (el) => {
    const rect    = el.getBoundingClientRect();
    const yNow    = window.pageYOffset || document.documentElement.scrollTop;
    const vh      = window.innerHeight;
    const targetY = yNow + rect.top + (rect.height / 2) - (vh / 2);

    // Чуть корректируем, если есть фикс-шапка
    const yWithHeader = Math.max(0, targetY + getHeaderH() * 0.5);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, yWithHeader);
    } else {
      window.scrollTo({ top: yWithHeader, behavior: 'smooth' });
    }
  };

  // Перехватываем клики по всем вариантам ссылок на #about
  const selectors = [
    'a[href="#about"]',
    '[data-scroll="about"]',
    '[data-target="#about"]'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollCenterTo(about);
      // Если у тебя мобильное меню открыто — здесь можно его закрыть
      // (оставил без логики, чтобы не менять твоё меню)
    });
  });

  // Если пришли сразу с хэшем (#about), центрируем после рендера
  if (location.hash === '#about') {
    requestAnimationFrame(() => setTimeout(() => scrollCenterTo(about), 60));
  }
})();
/* === Center #about with a slight downward bias === */
(() => {
  const about  = document.querySelector('section.stage#about');
  if (!about) return;

  // Подстройка: сколько "ниже центра" останавливаемся
  const BIAS_DESKTOP = -270;  // px — под себя
  const BIAS_MOBILE  = 96;  // px — на мобиле чуть ниже

  // Если шапка реально fixed — можно учесть её высоту (сейчас не учитываем)
  const header = document.querySelector('.nav, header.nav, .site-header');
  const getHeaderH = () => {
    if (!header) return 0;
    const cs = getComputedStyle(header);
    return cs.position === 'fixed' ? header.offsetHeight : 0;
  };

  const centerWithBias = () => {
    const r   = about.getBoundingClientRect();
    const y   = window.pageYOffset || document.documentElement.scrollTop;
    const vh  = window.innerHeight;
    const bias = window.matchMedia('(max-width: 768px)').matches ? BIAS_MOBILE : BIAS_DESKTOP;

    // Центр секции + смещение вниз (положительное = ниже)
    const target = y + r.top + (r.height / 2) - (vh / 2) + bias;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, Math.max(0, target));
    } else {
      window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    }
  };

  // Перехватываем клики по ссылкам на #about на стадии capture,
  // чтобы переопределить любые предыдущие обработчики
  const sel = 'a[href="#about"], [data-scroll="about"], [data-target="#about"]';
  const onNav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    centerWithBias();
  };
  document.querySelectorAll(sel).forEach(a => a.addEventListener('click', onNav, true));

  // Если пришли по хэшу сразу — центрируем после рендера
  if (location.hash === '#about') {
    requestAnimationFrame(() => setTimeout(centerWithBias, 60));
  }
})();
/* Склейки: не даём рвать ключевые словосочетания на переносах */
(() => {
  const el = document.querySelector('section.stage#about .stage__title');
  if (!el || el.dataset.typoFixed) return;

  // NBSP-дефисы: U+2011 (неразрывный дефис)
  el.innerHTML = el.innerHTML
    .replace(/BTL-?проекты/gi, 'BTL-проекты')
    .replace(/бренд-активаций/gi, 'бренд-активаций');

  el.dataset.typoFixed = '1';
})();
// Тонкая настройка «на глаз»
(() => {
  const TUNE = {
    dotLerp: 0.40,   // точка: 0.28–0.40 (быстрее = больше)
    ringLerp: 0.01,  // кольцо: 0.06–0.10 (медленнее = длиннее хвост)
    cssRingMs: 1000   // CSS-длительность transform для кольца
  };

  // Попробуем найти типичный апдейтер и подменить коэф.
  const _upd = window.updateCursor;
  if (_upd) window.updateCursor = function(){
    window.__DOT_LERP__ = TUNE.dotLerp;
    window.__RING_LERP__ = TUNE.ringLerp;
    return _upd.apply(this, arguments);
  };

  // Подкрутим длительность через стиль
  const ring = document.querySelector('.cursor-ring');
  if (ring) ring.style.transition = `transform ${TUNE.cssRingMs}ms cubic-bezier(.16,1,.3,1), width 220ms cubic-bezier(.22,1,.36,1), height 220ms cubic-bezier(.22,1,.36,1), opacity 220ms ease`;
})();
// Однократная замена в #about: BTL-проекты -> BTL-проекты (неразрывный дефис)
(() => {
  const el = document.querySelector('section.stage#about .stage__title');
  if (!el || el.dataset.nbspFixed) return;
  el.innerHTML = el.innerHTML.replace(/BTL-?проекты/gi, 'BTL-проекты'); // U+2011
  el.dataset.nbspFixed = '1';
})();
/* ==== Контейнерно-осознанный размер шрифта для #about ==== */
(() => {
  const section = document.querySelector('section.stage#about');
  const title   = section?.querySelector('.stage__title');
  if (!section || !title) return;

  // ПРАВЬ ЗДЕСЬ под свой вкус:
  const MIN_W = 360;   // px: ширина секции, где хотим минимальный размер
  const MAX_W = 1200;  // px: ширина секции, где хотим максимальный размер
  const MIN_FS = 20;   // px: минимальный размер шрифта (мобайл)
  const MAX_FS = 24;   // px: максимальный размер шрифта (широкие десктопы)

  const map = (x, inMin, inMax, outMin, outMax) =>
    outMin + (outMax - outMin) * ((x - inMin) / (inMax - inMin));

  const apply = () => {
    const w = section.clientWidth || window.innerWidth;
    const clampedW = Math.max(MIN_W, Math.min(MAX_W, w));
    const fs = map(clampedW, MIN_W, MAX_W, MIN_FS, MAX_FS);
    document.documentElement.style.setProperty('--about-fs', fs.toFixed(2) + 'px');
  };

  // Реагируем на реальные изменения размера секции
  const ro = new ResizeObserver(apply);
  ro.observe(section);

  // Запускаем
  apply();
  addEventListener('orientationchange', apply, { passive: true });
  addEventListener('load', apply, { passive: true });
})();
// Диагностика в консоли: какой шрифт реально применился
(() => {
  const t = document.querySelector('section.stage#about .stage__title');
  if (!t) return;
  const ff = getComputedStyle(t).fontFamily;
  console.log('[FontCheck] about.title font-family →', ff);
})();
/* ==== Safari-страховка: закрепляем размер текста от реальной ширины ABOUT ==== */
(() => {
  const sec = document.querySelector('section.stage#about');
  const p   = sec?.querySelector('.stage__title');
  if (!sec || !p) return;

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  const apply = () => {
    // ширина самого блока (а не окна) — стабильнее для Safari
    const w  = sec.clientWidth || window.innerWidth;
    const fs = Math.round(clamp(19 + ((w - 360) / (1200 - 360)) * (22 - 19), 19, 22));
    // только если наш CSS не перекрыт вручную
    p.style.setProperty('font-size', fs + 'px', 'important');
  };

  // один раз и при реальном изменении размеров
  apply();
  new ResizeObserver(apply).observe(sec);
  addEventListener('orientationchange', apply, { passive: true });
})();