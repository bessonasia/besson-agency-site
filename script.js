


const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const lerp = (a, b, t) => a + (b - a) * t;

/* =========================================================
Enforce no system cursor on desktop
========================================================= */
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

/* =========================================================
Globe: dome + cities + runner line
========================================================= */
function initGlobeStrip() {
  const dome = qs('#globeDome');
  const canvas = qs('#globeCanvas');
  const label = qs('#globeLabel');
  if (!dome || !canvas || !window.THREE) return;

  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CITIES = [
    { name: 'офис Алматы',  lat: 31.0, lon: 20.0 },
    { name: 'офис Москва',  lat: 60.0, lon: -5.0 },
    { name: 'офис Ташкент', lat: 25.0, lon: -10.0 }
  ];

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

  const group = new THREE.Group();
  scene.add(group);

  const radius = 5.3;

  const baseGeo = new THREE.IcosahedronGeometry(radius, 5);
  const wireGeo = new THREE.WireframeGeometry(baseGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.35
  });
  const wire = new THREE.LineSegments(wireGeo, wireMat);
  wire.renderOrder = 1;
  group.add(wire);

  group.position.y = -radius * 0.95;

  const posAttr = baseGeo.getAttribute('position');
  const vertsUnit = [];
  const tmp = new THREE.Vector3();
  for (let i = 0; i < posAttr.count; i++) {
    tmp.fromBufferAttribute(posAttr, i).normalize();
    vertsUnit.push(tmp.clone());
  }

  const vecFromLatLon = (latDeg, lonDeg) => {
    const lat = THREE.MathUtils.degToRad(latDeg);
    const lon = THREE.MathUtils.degToRad(lonDeg);
    const x = Math.cos(lat) * Math.sin(lon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon);
    return new THREE.Vector3(x, y, z).normalize();
  };

  const snapToVertex = (vUnit) => {
    let best = vertsUnit[0];
    let bestDot = -1;
    for (const vv of vertsUnit) {
      const d = vv.dot(vUnit);
      if (d > bestDot) { bestDot = d; best = vv; }
    }
    return best.clone().multiplyScalar(radius * 1.006);
  };

  const dotGeo = new THREE.SphereGeometry(radius * 0.021, 18, 18);
  const dotMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    depthTest: false,
    depthWrite: false
  });

  const cities = [];
  for (const c of CITIES) {
    const v = vecFromLatLon(c.lat, c.lon);
    const p = snapToVertex(v);

    const mesh = new THREE.Mesh(dotGeo, dotMat.clone());
    mesh.position.copy(p);
    mesh.renderOrder = 10;

    group.add(mesh);
    cities.push({ ...c, mesh });
  }

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.65,
    depthTest: false,
    depthWrite: false
  });
  const lineGeo = new THREE.BufferGeometry();
  const runner = new THREE.Line(lineGeo, lineMat);
  runner.renderOrder = 9;
  group.add(runner);

  const buildArc = (fromIdx, toIdx) => {
    const a = cities[fromIdx].mesh.position.clone().normalize();
    const b = cities[toIdx].mesh.position.clone().normalize();

    const axis = new THREE.Vector3().crossVectors(a, b);
    if (axis.length() < 1e-6) axis.set(0, 1, 0);
    else axis.normalize();

    const angle = Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1));

    const STEPS = 110;
    const arr = new Float32Array((STEPS + 1) * 3);

    for (let k = 0; k <= STEPS; k++) {
      const t = k / STEPS;
      const p = a.clone().applyAxisAngle(axis, angle * t).multiplyScalar(radius * 1.004);
      arr[k * 3 + 0] = p.x;
      arr[k * 3 + 1] = p.y;
      arr[k * 3 + 2] = p.z;
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    lineGeo.setDrawRange(0, 2);
    lineGeo.computeBoundingSphere();
    return STEPS + 1;
  };

  let activeIndex = 0;
  const wp = new THREE.Vector3();

  const showLabelFor = (i) => {
    if (!label) return;
    label.textContent = cities[i]?.name || '';
    label.classList.remove('globe-label--visible', 'globe-label--flash');
    void label.offsetWidth;
    label.classList.add('globe-label--visible', 'globe-label--flash');
  };

  const updateLabelPosition = () => {
    if (!label || !cities[activeIndex]) return;

    const w = dome.clientWidth;
    const h = dome.clientHeight;

    cities[activeIndex].mesh.getWorldPosition(wp);
    wp.project(camera);

    let x = (wp.x * 0.5 + 0.5) * w;
    let y = (-wp.y * 0.5 + 0.5) * h;

    const name = cities[activeIndex].name;
    const ox = (name === 'Ташкент') ? -18 : 18;
    const oy = -8;

    x += ox;
    y += oy;

    const m = 14;
    x = Math.max(m, Math.min(w - m, x));
    y = Math.max(m, Math.min(h - m, y));

    label.style.left = x + 'px';
    label.style.top = y + 'px';
  };

  const resize = () => {
    const w = dome.clientWidth;
    const h = dome.clientHeight;

    renderer.setSize(w, h, false);
    camera.aspect = w / h;

    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

    const isMobile = matchMedia('(max-width:768px)').matches;

    const fitW = isMobile ? 1.08 : 0.92;
    const fitH = isMobile ? 0.98 : 0.86;
    const zPad = isMobile ? 0.35 : 0.18;

    const fitWidthDist  = (radius * fitW) / Math.tan(hFov / 2);
    const fitHeightDist = (radius * fitH) / Math.tan(vFov / 2);

    camera.position.set(0, 1.15, Math.max(fitWidthDist, fitHeightDist) + zPad);
    camera.lookAt(0, 0, 0);

    camera.updateProjectionMatrix();
    updateLabelPosition();
  };

  const ro = new ResizeObserver(resize);
  ro.observe(dome);
  resize();

  const setActiveCity = (i) => {
    activeIndex = i;
    cities.forEach((c, idx) => {
      const on = idx === i;
      c.mesh.scale.setScalar(on ? 1.35 : 1.0);
    });
    showLabelFor(i);
  };

  let current = 0;
  let next = cities.length > 1 ? 1 : 0;
  let arcCount = cities.length > 1 ? buildArc(current, next) : 0;

  setActiveCity(current);

  let segT = 0;
  const SEG_DUR = 1.55;

  let last = performance.now();
  const startTime = last;

  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const t = (now - startTime) / 1000;

    if (!prefersReduced) {
      group.rotation.y = 0.22 * Math.sin(t * 0.45);
      group.rotation.x = 0.05 * Math.sin(t * 0.22);
    }

    if (cities.length > 1) {
      segT += dt;
      const p = Math.min(segT / SEG_DUR, 1);
      const draw = Math.max(2, Math.floor(p * arcCount));
      lineGeo.setDrawRange(0, draw);

      if (p >= 1) {
        current = next;
        next = (current + 1) % cities.length;

        setActiveCity(current);

        segT = 0;
        arcCount = buildArc(current, next);
      }
    }

    updateLabelPosition();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/* =========================================================
Globe: scroll "выезд" (премиально и выше)
========================================================= */
function initGlobeDomeScroll(){
  const bridge = qs('#globeBridge');
  const dome = qs('#globeDome');
  if (!bridge || !dome) return;

  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  let current = null;
  let target = null;
  let raf = 0;

  const compute = () => {
    const rect = bridge.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;

    const start = vh * 0.72;
    const end   = vh * 0.14;
    const pRaw = (start === end) ? 0 : (start - rect.top) / (start - end);
    const p = easeOutCubic(clamp01(pRaw));

    const isMobile = matchMedia('(max-width:768px)').matches;

    /* ✅ подняли диапазоны ещё выше (и мобила тоже) */
    const from = isMobile ? -22 : -18;  // старт (чуть ниже)
    const to   = isMobile ?  -8 :  -4;  // финиш (выше)

    target = from + (to - from) * p;
    if (current === null) current = target;
  };

  const paint = () => {
    raf = 0;
    if (target === null) return;

    if (prefersReduced) {
      dome.style.setProperty('--domeBottom', `${target}vh`);
      return;
    }

    current = lerp(current, target, 0.14);
    dome.style.setProperty('--domeBottom', `${current.toFixed(3)}vh`);

    if (Math.abs(current - target) > 0.02) {
      raf = requestAnimationFrame(paint);
    }
  };

  const request = () => {
    compute();
    if (!raf) raf = requestAnimationFrame(paint);
  };

  request();
  window.addEventListener('scroll', request, { passive:true });
  window.addEventListener('resize', request);
}

 


/* =========================================================
Main init
========================================================= */
function initBesson() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ===== 1. Year ===== */
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== 2. Лого / Hero ===== */
  const logoText = qs('#logoText');
  let logoSpans = [];

  if (logoText) {
    const text = (logoText.getAttribute('aria-label') || logoText.textContent || 'Besson Agency').trim();
    logoText.innerHTML = text
      .split('')
      .map(ch => ch === ' ' ? '<span data-space="true">&nbsp;</span>' : `<span>${ch}</span>`)
      .join('');
    logoSpans = qsa('span', logoText);
  }

  if (logoSpans.length && !isMobile) {
    logoSpans.forEach(span => {
      if (span.dataset.space === 'true') return;
      span.addEventListener('mouseenter', () => { span.style.transform = 'translateY(-6px) scale(1.06)'; });
      span.addEventListener('mouseleave', () => { span.style.transform = 'translateY(0) scale(1)'; });
    });
  }

  if (logoSpans.length && isMobile) {
    const MAX_SCROLL_BASE = 600;
    let maxScroll = Math.max(innerHeight * 1.1, MAX_SCROLL_BASE);
    let maxSpread = 40;
    let breathing = false;
    let ticking = false;

    const recalc = () => {
      maxScroll = Math.max(innerHeight * 1.1, MAX_SCROLL_BASE);
      if (logoText) {
        const rect = logoText.getBoundingClientRect();
        const viewport = window.innerWidth || document.documentElement.clientWidth || rect.width;
        const free = Math.max(0, (viewport - rect.width) / 2);
        maxSpread = free * 0.9;
      }
    };

    const applySpread = () => {
      const s = Math.min(window.scrollY || 0, maxScroll);
      const p = maxScroll === 0 ? 0 : s / maxScroll;

      const scale = 1 + p * 1.6;
      const spread = p * maxSpread;
      const glow = 8 + p * 32;

      let i = 0;
      logoSpans.forEach(span => {
        if (span.dataset.space === 'true') {
          span.style.transform = 'translateX(0) scale(1)';
          span.style.textShadow = 'none';
          return;
        }
        const dir = (i++ % 2 === 0) ? -1 : 1;
        span.style.transform = `translateX(${dir * spread}px) scale(${scale})`;
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

    recalc();
    applySpread();

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applySpread();
        ticking = false;
      });
    }, { passive: true });

    window.addEventListener('resize', () => {
      recalc();
      applySpread();
    }, { passive: true });
  }

  /* ===== 3. Interlude word swap ===== */
  const swapEl = qs('#swap');
  if (swapEl) {
    const words = ['Event.', 'Creative.', 'BTL.', 'POSM.'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      swapEl.textContent = words[i];
    }, 2500);
  }

  /* ===== 3.1 Globe ===== */
  initGlobeStrip();
  initGlobeDomeScroll();

  /* ===== 4. Hero reveal ===== */
  const hero = qs('.hero');
  const heroReveal = qs('.hero__reveal');
  const heroScroll = qs('.hero__scroll');
  let heroHeight = hero ? hero.offsetHeight : 0;
  let heroMaxOffset = heroHeight * 0.45;

  const updateHeroReveal = () => {
    if (!hero || !heroReveal) return;
    heroHeight = hero.offsetHeight || window.innerHeight;
    heroMaxOffset = heroHeight * 0.45;

    const scrollY = window.scrollY || 0;
    const progress = Math.max(0, Math.min(scrollY / heroHeight, 1));
    const offset = (1 - progress) * heroMaxOffset;

    heroReveal.style.transform = `translateY(${offset}px)`;

    if (heroScroll) {
      const alpha = Math.max(0, 1 - progress * 1.4);
      heroScroll.style.opacity = alpha;
    }
  };

  updateHeroReveal();
  window.addEventListener('scroll', () => { requestAnimationFrame(updateHeroReveal); }, { passive: true });
  window.addEventListener('resize', updateHeroReveal);

  /* ===== 5. Nav ===== */
  const nav = qs('#siteNav');
  const burger = qs('.burger');
  const mobileMenu = qs('#mobileMenu');
  const themeSections = qsa('section[data-theme]');
  let currentTheme = 'dark';
  let lastScrollY = window.scrollY || 0;
  const SCROLL_DELTA = 6;
  const HIDE_START = 80;
  let menuOpen = false;
  let tickingNav = false;

  const setMobileMenuState = (open) => {
    if (!burger || !mobileMenu) return;
    menuOpen = open;
    burger.classList.toggle('burger--active', open);
    mobileMenu.classList.toggle('mobile-menu--open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('nav-lock', open);

    if (nav) {
      if (open) {
        nav.classList.remove('nav--hidden');
        nav.classList.add('nav--menu-open');
      } else {
        nav.classList.remove('nav--menu-open');
      }
    }
  };

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => { setMobileMenuState(!menuOpen); });
    qsa('a', mobileMenu).forEach(a => {
      a.addEventListener('click', () => {
        if (!menuOpen) return;
        setMobileMenuState(false);
      });
    });
  }

  const updateNavTheme = () => {
    if (!nav || !themeSections.length) return;
    const navHeight = nav.offsetHeight || 0;
    const markerY = navHeight + 2;

    let theme = 'dark';
    for (const section of themeSections) {
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0) continue;
      if (rect.top <= markerY && rect.bottom >= markerY) {
        theme = section.dataset.theme || 'dark';
        break;
      }
    }

    if (theme !== currentTheme) {
      currentTheme = theme;
      nav.classList.toggle('nav--on-light', theme === 'light');
    }
  };

  const handleNavScroll = () => {
    if (!nav) return;
    const currentY = window.scrollY || 0;
    const diff = currentY - lastScrollY;

    if (!menuOpen && Math.abs(diff) > SCROLL_DELTA) {
      if (currentY > HIDE_START && diff > 0) nav.classList.add('nav--hidden');
      else if (diff < 0) nav.classList.remove('nav--hidden');
      lastScrollY = currentY;
    } else if (menuOpen) {
      nav.classList.remove('nav--hidden');
      lastScrollY = currentY;
    }

    updateNavTheme();
  };

  updateNavTheme();

  window.addEventListener('scroll', () => {
    if (tickingNav) return;
    tickingNav = true;
    requestAnimationFrame(() => {
      handleNavScroll();
      tickingNav = false;
    });
  }, { passive: true });

  window.addEventListener('resize', updateNavTheme);

  /* ===== 6. Contact pill (SAFE) ===== */
const contactPill = qs('#contactPill');

if (contactPill) {
  const interlude = qs('.interlude');
  const themeSectionsPill = qsa('section[data-theme]');

  let open = false;
  let rafPill = 0;

  const setOpen = (v) => {
    open = v;
    contactPill.classList.toggle('contact-pill--open', open);
    contactPill.setAttribute('aria-expanded', open ? 'true' : 'false');

    const icons = contactPill.querySelector('.contact-pill__icons');
    if (icons) icons.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  const getThemeAtMarker = (markerY) => {
    let theme = 'light';
    for (const s of themeSectionsPill) {
      const r = s.getBoundingClientRect();
      if (r.bottom <= 0) continue;
      if (r.top <= markerY && r.bottom >= markerY) {
        theme = (s.dataset.theme || 'light');
        break;
      }
    }
    return theme;
  };

  const shouldShow = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (interlude) {
      const r = interlude.getBoundingClientRect();
      return r.top <= vh * 0.65; // появляется начиная с Event/BTL
    }
    return (window.scrollY || 0) > vh * 0.9;
  };

  const update = () => {
    rafPill = 0;

    const visible = shouldShow();
    contactPill.classList.toggle('contact-pill--visible', visible);

    if (!visible && open) setOpen(false);

    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const theme = getThemeAtMarker(vh * 0.5);
    contactPill.classList.toggle('contact-pill--on-dark', theme === 'dark');
  };

  const requestUpdate = () => {
    if (rafPill) return;
    rafPill = requestAnimationFrame(update);
  };

  contactPill.addEventListener('click', (e) => {
    if (e.target.closest('.contact-pill__icon')) return;
    e.stopPropagation();
    setOpen(!open);
  });

  contactPill.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!open);
    }
    if (e.key === 'Escape') setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (!open) return;
    if (e.target.closest('#contactPill')) return;
    setOpen(false);
  });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });

  requestUpdate();
}


  /* ===== 7. Premium cursor ===== */
  const dotCur = qs('#cursorDot');
  const ringCur = qs('#cursorRing');

  if (isFinePointer && dotCur && ringCur) {
    let dx = innerWidth / 2;
    let dy = innerHeight / 2;
    let rx = dx;
    let ry = dy;
    let tx = dx;
    let ty = dy;

    const DOT_LERP = 0.35;
    const RING_LERP = 0.12;

    const move = e => {
      tx = e.clientX;
      ty = e.clientY;
      dotCur.style.opacity = '1';
      ringCur.style.opacity = '1';
    };

    window.addEventListener('mousemove', move, { passive: true });

    const loop = () => {
      dx = lerp(dx, tx, DOT_LERP);
      dy = lerp(dy, ty, DOT_LERP);
      rx = lerp(rx, tx, RING_LERP);
      ry = lerp(ry, ty, RING_LERP);

      dotCur.style.transform = `translate(${dx}px,${dy}px)`;
      ringCur.style.transform = `translate(${rx}px,${ry}px)`;

      requestAnimationFrame(loop);
    };
    loop();

    const hoverSel = 'a,button,[role="button"],.link,.tile,.btn,input,textarea,select,label,summary';

    document.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse') return;
      if (e.target.closest(hoverSel)) ringCur.classList.add('cursor--hover');
    });

    document.addEventListener('pointerout', e => {
      if (e.pointerType !== 'mouse') return;
      if (!e.relatedTarget || !e.relatedTarget.closest(hoverSel)) ringCur.classList.remove('cursor--hover');
    });

    window.addEventListener('mouseout', e => {
      if (!e.relatedTarget) {
        dotCur.style.opacity = '0';
        ringCur.style.opacity = '0';
      }
    });

    window.addEventListener('mouseenter', () => {
      dotCur.style.opacity = '1';
      ringCur.style.opacity = '1';
    });

    qsa('.btn').forEach(btn => {
      const glow = btn.querySelector('.glow');
      if (!glow) return;
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        glow.style.setProperty('--x', ((e.clientX - r.left) / r.width * 100) + '%');
        glow.style.setProperty('--y', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ===== 8. Float labels ===== */
  qsa('.field').forEach(f => {
    const input = f.querySelector('.input');
    if (!input) return;
    const toggle = () => f.classList.toggle('filled', !!input.value);
    input.addEventListener('input', toggle);
    input.addEventListener('blur', toggle);
    toggle();
  });

  /* ===== 9. Lead form ===== */
  const leadForm = qs('#leadForm');
  const statusEl = qs('#formStatus');

  if (leadForm && statusEl) {
    const endpoint = leadForm.getAttribute('action') || 'https://api.web3forms.com/submit';

    const onSubmit = async (e) => {
      if (!leadForm.checkValidity()) {
        e.preventDefault();
        statusEl.textContent = 'Проверьте имя и телефон.';
        statusEl.classList.remove('form__status--success');
        statusEl.classList.add('form__status--error');
        return;
      }

      e.preventDefault();

      const formData = new FormData(leadForm);
      const submitBtn = leadForm.querySelector('button[type="submit"]');

      statusEl.textContent = 'Отправляем...';
      statusEl.classList.remove('form__status--success', 'form__status--error');

      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Bad response: ' + res.status);

        leadForm.reset();
        qsa('.field', leadForm).forEach(f => f.classList.remove('filled'));

        statusEl.textContent = 'Все получилось! Мы уже обрабатываем вашу заявку.';
        statusEl.classList.add('form__status--success');
      } catch (err) {
        console.error('Web3Forms AJAX failed, fallback to normal submit:', err);
        statusEl.textContent = '';
        statusEl.classList.remove('form__status--success', 'form__status--error');
        leadForm.removeEventListener('submit', onSubmit);
        leadForm.submit();
        return;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };

    leadForm.addEventListener('submit', onSubmit);
  }
}

/* =========================================================
Work: reveal tiles on scroll (IntersectionObserver + row stagger)
========================================================= */
function initWorkReveal(){
  const wall = qs('#wall');
  if (!wall) return;

  const tiles = qsa('.tile', wall);
  if (!tiles.length) return;

  // 1) Ставим задержки "волной" по рядам (адаптивно)
  const assignStagger = () => {
    // Группируем по offsetTop (это "ряд" в текущей сетке)
    const rows = new Map();

    tiles.forEach(el => {
      const top = el.offsetTop;
      if (!rows.has(top)) rows.set(top, []);
      rows.get(top).push(el);
    });

    // Сортируем ряды сверху вниз
    const rowTops = Array.from(rows.keys()).sort((a,b) => a - b);

    rowTops.forEach((top, rowIndex) => {
      const rowEls = rows.get(top);

      // Внутри ряда — слева направо
      rowEls.sort((a,b) => a.offsetLeft - b.offsetLeft);

      rowEls.forEach((el, colIndex) => {
        // Премиальный тайминг: быстро, но ощущается как система
        const delay = rowIndex * 110 + colIndex * 70; // ms
        el.style.setProperty('--reveal-delay', `${delay}ms`);
      });
    });
  };

  assignStagger();

  // На resize сетка меняется — пересчитываем задержки (лёгкий debounce)
  let rAF = 0;
  const onResize = () => {
    if (rAF) return;
    rAF = requestAnimationFrame(() => {
      assignStagger();
      rAF = 0;
    });
  };
  window.addEventListener('resize', onResize, { passive:true });

    // Если true — волна задержек будет каждый раз при повторном появлении
  // Если false — stagger только при первом появлении, дальше без задержек (обычно выглядит дороже)
  const REPEAT_STAGGER = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;

      // Вошла в кадр — включаем
      if (entry.isIntersecting) {
        // если уже показывали и не хотим повторных задержек — обнуляем delay
        if (!REPEAT_STAGGER && el.dataset.seen === '1') {
          el.style.setProperty('--reveal-delay', '0ms');
        }

        el.classList.add('is-in');
        el.dataset.seen = '1';
        return;
      }

      // Вышла из кадра полностью — сбрасываем, чтобы при возврате анимация сыграла заново
      // (сработает уже когда элемент реально вне viewport, визуально не "мигает")
      el.classList.remove('is-in');
    });
  }, {
    root: null,
    threshold: 0.18,
    rootMargin: '0px 0px -12% 0px'
  });

  tiles.forEach(el => io.observe(el));


  tiles.forEach(el => io.observe(el));
}


/* =========================================================
Clients: repeatable reveal on scroll (section-based)
========================================================= */
function initClientsReveal(){
  const section = qs('#clients');
  if (!section) return;

  const items = qsa('.clients__item', section);
  if (!items.length) return;

  // Волна по рядам (адаптивно, т.к. сетка меняется)
  const assignStagger = () => {
    const rows = new Map();

    items.forEach(el => {
      const top = el.offsetTop;
      if (!rows.has(top)) rows.set(top, []);
      rows.get(top).push(el);
    });

    const rowTops = Array.from(rows.keys()).sort((a,b) => a - b);

    rowTops.forEach((top, rowIndex) => {
      const rowEls = rows.get(top);
      rowEls.sort((a,b) => a.offsetLeft - b.offsetLeft);

      rowEls.forEach((el, colIndex) => {
        const delay = rowIndex * 110 + colIndex * 70; // ms
        el.style.setProperty('--c-delay', `${delay}ms`);
      });
    });
  };

  assignStagger();

  let raf = 0;
  const onResize = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      assignStagger();
      raf = 0;
    });
  };
  window.addEventListener('resize', onResize, { passive:true });

  // Повторяемая анимация: вошли -> is-in, вышли -> убрали is-in
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      section.classList.toggle('is-in', entry.isIntersecting);
    });
  }, {
    root: null,
    threshold: 0.18,
    rootMargin: '0px 0px -22% 0px'
  });

  io.observe(section);
}

/* =========================================================
Contact — Variant A: underlap + repeatable reveal + subtle scroll float
========================================================= */
function initContactUnderlap(){
  const section = qs('#contact');
  if (!section) return;

  const form = qs('.form', section);
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let inView = false;

  // Повторяемый reveal: вошли -> is-in, вышли -> сняли
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      inView = entry.isIntersecting;
      section.classList.toggle('is-in', inView);

      // когда ушли — сбрасываем микросмещение (чтобы не было "залипания")
      if (!inView && form) form.style.setProperty('--form-float', '0px');
    });
  }, {
    root: null,
    threshold: 0.18,
    rootMargin: '0px 0px -22% 0px'
  });

  io.observe(section);

  // Микродвижение формы по скроллу (только когда секция в кадре)
  if (!form || prefersReduced) return;

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  let raf = 0;

  const tick = () => {
    raf = 0;
    if (!inView) return;

    const r = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;

    // Фокусируемся чуть выше центра секции (где форма)
    const focusY = r.top + r.height * 0.42;
    const dist = (focusY - vh * 0.5) / (vh * 0.5);      // -1..1
    const intensity = 1 - clamp01(Math.abs(dist));      // 1 в центре, 0 по краям

    const floatPx = -10 * intensity;                    // 0..-10px (очень мягко)
    form.style.setProperty('--form-float', `${floatPx.toFixed(2)}px`);
  };

  const request = () => {
    if (raf) return;
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', request, { passive:true });
  window.addEventListener('resize', request);
  request();
}
 /* ===== 3.2 Work reveal ===== */
  initWorkReveal();

  /* ===== Clients reveal ===== */
  initClientsReveal();

  initContactUnderlap();

/* =========================================================
VIDEO REVIEWS (B) — self-boot, no dependency on initBesson
========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function initVideoReviewsB(){
    const root = $('#reviews');
    if (!root) return;

    const tabs  = $$('.reviews__tab', root);
    const open  = $('#rvOpen');
    const lead  = $('#rvLead');
    const quote = $('#rvQuote');
    const meta  = $('#rvMeta');
    const modal = $('#rvModal');
    const frame = $('#rvFrame');

    if (!tabs.length || !open || !lead || !quote || !meta || !modal || !frame) return;

    // Ссылки на видео вставишь позже. Пока блок работает без них.
    const DATA = [
      {
        brand:'Nestlé',
        lead:'Съёмки, логистика, дисциплина. Без суеты.',
        quote:'“Команда держит процесс: спокойно, точно, вовремя.”',
        meta:'Brand Manager — Nestlé',
        video:'' // пример: 'https://www.youtube.com/embed/XXXX?autoplay=1'
      },
      {
        brand:'Beiersdorf',
        lead:'Премиальная подача и контроль деталей.',
        quote:'“Редкий уровень ответственности и вкуса.”',
        meta:'Marketing Lead — Beiersdorf',
        video:''
      },
      {
        brand:'METRO',
        lead:'Когда важно без нервов и хаоса.',
        quote:'“Сильная режиссура процесса: всё под контролем.”',
        meta:'Head of Trade — METRO',
        video:''
      }
    ];

    let active = 2;

    const apply = (i) => {
      active = i;
      tabs.forEach((b, idx) => b.classList.toggle('is-active', idx === i));
      const d = DATA[i];
      lead.textContent  = d.lead;
      quote.textContent = d.quote;
      meta.textContent  = d.meta;
    };

    const openModal = () => {
      const d = DATA[active];
      if (!d.video) return; // нет видео — не открываем пустоту

      frame.innerHTML = '';

      if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(d.video)) {
        const v = document.createElement('video');
        v.src = d.video;
        v.controls = true;
        v.playsInline = true;
        v.autoplay = true;
        frame.appendChild(v);
      } else {
        const iframe = document.createElement('iframe');
        iframe.src = d.video;
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
        iframe.allowFullscreen = true;
        frame.appendChild(iframe);
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('reviews-lock');
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      frame.innerHTML = '';
      document.body.classList.remove('reviews-lock');
    };

    tabs.forEach(btn => {
      btn.addEventListener('click', () => apply(parseInt(btn.dataset.rvTab, 10)));
    });

    open.addEventListener('click', openModal);

    $$('[data-rv-close]', modal).forEach(el => el.addEventListener('click', closeModal));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    apply(active);
  }

  function initVideoReviewsRevealRepeat(){
    const root = $('#reviews');
    if (!root) return;

    // Включаем анимацию ТОЛЬКО если JS реально стартанул
    root.classList.add('rv-ready');

    const items = $$('[data-rv]', root);
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        en.target.classList.toggle('is-inview', en.isIntersecting);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -12% 0px'
    });

    items.forEach(el => io.observe(el));
  }

  const boot = () => {
    initVideoReviewsB();
    initVideoReviewsRevealRepeat();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

(() => {
  const rail = document.getElementById("teamRail");
  const dotsWrap = document.getElementById("teamDots");
  if (!rail || !dotsWrap) return;

  const btnPrev = document.querySelector("[data-team-prev]");
  const btnNext = document.querySelector("[data-team-next]");

  // Оригинальные карточки (до клонирования)
  const originalCards = Array.from(rail.querySelectorAll(".team-card"));
  const N = originalCards.length;
  if (N < 2) return;

  // Пагинация
  const dots = [];
  dotsWrap.innerHTML = "";
  for (let i = 0; i < N; i++) {
    const b = document.createElement("button");
    b.className = "team-dot";
    b.type = "button";
    b.setAttribute("aria-label", `Показать сотрудника ${i + 1}`);
    b.addEventListener("click", () => scrollToIndex(i));
    dotsWrap.appendChild(b);
    dots.push(b);
  }

  // Клонируем карточки для бесшовного авто-скролла
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    rail.appendChild(clone);
  });

  let step = 0;
  let originalWidth = 0;

  const measure = () => {
    const cardsNow = Array.from(rail.querySelectorAll(".team-card"));
    // шаг = расстояние между двумя соседними карточками
    if (cardsNow.length >= 2) {
      step = cardsNow[1].offsetLeft - cardsNow[0].offsetLeft;
    }
    // ширина оригинального набора (до клонов) = половина scrollWidth
    originalWidth = rail.scrollWidth / 2;
  };

  const clampIndex = (i) => ((i % N) + N) % N;

  const getIndexFromScroll = () => {
    const pos = (rail.scrollLeft % originalWidth + originalWidth) % originalWidth;
    const idx = step ? Math.round(pos / step) : 0;
    return clampIndex(idx);
  };

  const setActiveDot = (idx) => {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  };

  const scrollToIndex = (idx) => {
    idx = clampIndex(idx);
    const target = idx * step;
    // целимся в ближайший “круг” (текущая область + target)
    const base = Math.floor(rail.scrollLeft / originalWidth) * originalWidth;
    rail.scrollTo({ left: base + target, behavior: "smooth" });
    setActiveDot(idx);
  };

  // Кнопки
  const go = (dir) => {
    const idx = getIndexFromScroll();
    scrollToIndex(idx + dir);
    pauseAutoTemporarily();
  };

  btnPrev && btnPrev.addEventListener("click", () => go(-1));
  btnNext && btnNext.addEventListener("click", () => go(1));

  // Drag-to-scroll (премиально: “тащится руками”)
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  const onDown = (e) => {
    isDown = true;
    startX = (e.touches ? e.touches[0].pageX : e.pageX);
    startScroll = rail.scrollLeft;
    pauseAutoTemporarily();
  };

  const onMove = (e) => {
    if (!isDown) return;
    const x = (e.touches ? e.touches[0].pageX : e.pageX);
    const dx = x - startX;
    rail.scrollLeft = startScroll - dx;
  };

  const onUp = () => {
    isDown = false;
  };

  rail.addEventListener("mousedown", onDown);
  rail.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  rail.addEventListener("touchstart", onDown, { passive: true });
  rail.addEventListener("touchmove", onMove, { passive: true });
  rail.addEventListener("touchend", onUp);

  // Auto-scroll (постоянная анимация полосы)
  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let paused = false;
  let resumeTimer = null;
  const SPEED = 0.28; // px/frame — очень медленно и дорого выглядит

  const pauseAutoTemporarily = () => {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; }, 2400);
  };

  rail.addEventListener("mouseenter", pauseAutoTemporarily);
  rail.addEventListener("wheel", pauseAutoTemporarily, { passive: true });
  rail.addEventListener("focus", pauseAutoTemporarily);

  const tick = () => {
    if (!prefersReduce) {
      if (!paused) {
        rail.scrollLeft += SPEED;
        // бесшовный луп
        if (rail.scrollLeft >= originalWidth) {
          rail.scrollLeft -= originalWidth;
        }
      }
      setActiveDot(getIndexFromScroll());
    }
    requestAnimationFrame(tick);
  };

  // Перемеряем при ресайзе
  const onResize = () => {
    const idx = getIndexFromScroll();
    measure();
    // Сохраняем логический индекс
    requestAnimationFrame(() => scrollToIndex(idx));
  };

  window.addEventListener("resize", onResize);

  // Init
  measure();
  setActiveDot(0);
  // чуть двинем, чтобы не казалось “мертвым”
  rail.scrollLeft = 3;
  requestAnimationFrame(tick);
})();

(() => {
  const section = document.getElementById("team");
  if (!section) return;

  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Какие элементы анимируем
  const nodes = [
    ...section.querySelectorAll(".team__kicker, .team__title, .team__sub, .team-card")
  ];

  // Навешиваем базовый класс "reveal" без правок HTML
  nodes.forEach((el) => el.classList.add("reveal"));

  // Stagger (премиальные ступеньки)
  nodes.forEach((el, i) => {
    // текст — быстрее, карточки — чуть медленнее
    const isText = el.classList.contains("team__kicker") || el.classList.contains("team__title") || el.classList.contains("team__sub");
    const base = isText ? 0.06 : 0.12;
    const step = isText ? 0.06 : 0.07;
    const d = Math.min(base + i * step, 0.75);
    el.style.setProperty("--td", `${d}s`);
  });

  if (prefersReduce) {
    nodes.forEach((el) => el.classList.add("is-inview"));
    return;
  }

  // Повторяем при каждом входе/выходе из зоны видимости
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
        } else {
          e.target.classList.remove("is-inview");
        }
      }
    },
    {
      threshold: 0.22,
      // Важно: так анимация включается чуть раньше,
      // а сброс происходит уже после ухода элемента вниз
      rootMargin: "0px 0px -10% 0px"
    }
  );

  nodes.forEach((el) => io.observe(el));
})();


(function boot(){
  const root = document.documentElement;

  const start = () => {
    try {
      if (typeof initBesson === 'function') initBesson();
      if (typeof initWorkReveal === 'function') initWorkReveal();

      root.classList.remove('no-js');
      root.classList.add('js');
    } catch (e) {
      console.error('[BESSON] script crashed:', e);
      // откат, чтобы сайт не “умирал” визуально
      root.classList.add('no-js');
      root.classList.remove('js');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

// ===== TEAM mobile swipe: snap card to center (NO scrollIntoView) =====
(() => {
  const team = document.getElementById('team');
  if (!team) return;

  const mq = window.matchMedia('(max-width: 768px)');

  let scroller = null;
  let onScroll = null;

  let teamInView = false;
  let userInteracted = false;

  function teardown() {
    if (scroller && onScroll) scroller.removeEventListener('scroll', onScroll);
    if (scroller) scroller.classList.remove('team-snap');
    scroller = null;
    onScroll = null;
    userInteracted = false;
  }

  function setup() {
    teardown();
    if (!mq.matches) return;

    const cards = Array.from(team.querySelectorAll('.team-card'));
    if (cards.length < 2) return;

    // Ищем общий контейнер всех карточек
    let p = cards[0].parentElement;
    while (p && p !== team) {
      if (p.querySelectorAll('.team-card').length === cards.length) break;
      p = p.parentElement;
    }
    scroller = (p && p !== team) ? p : cards[0].parentElement;
    if (!scroller) return;

    scroller.classList.add('team-snap');

    // Флаг "пользователь трогал"
    const markUser = () => { userInteracted = true; };
    scroller.addEventListener('touchstart', markUser, { passive: true });
    scroller.addEventListener('mousedown', markUser, { passive: true });
    scroller.addEventListener('pointerdown', markUser, { passive: true });

    let t = null;

    const snapToNearest = () => {
      // 1) Не снапать, пока секция команды не в зоне видимости
      if (!teamInView) return;

      // 2) Не снапать от программных scrollLeft на старте (только после касания/drag)
      if (!userInteracted) return;

      const r = scroller.getBoundingClientRect();
      const centerX = r.left + r.width / 2;

      let best = null;
      let bestDist = Infinity;

      cards.forEach((card) => {
        const cr = card.getBoundingClientRect();
        const c = cr.left + cr.width / 2;
        const d = Math.abs(c - centerX);
        if (d < bestDist) { bestDist = d; best = card; }
      });

      if (!best) return;

      // Горизонтальный снап без вертикального скролла страницы
      const targetLeft =
        best.offsetLeft - (scroller.clientWidth - best.clientWidth) / 2;

      scroller.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
    };

    onScroll = () => {
      clearTimeout(t);
      t = setTimeout(snapToNearest, 80);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });

    // Отслеживаем видимость секции (чтобы не “улетать” на неё)
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          teamInView = !!(e && e.isIntersecting);
        },
        { threshold: 0.12 }
      );
      io.observe(team);
    } else {
      // fallback: считаем "не в кадре" пока пользователь не долистал
      teamInView = false;
      window.addEventListener('scroll', () => {
        const rr = team.getBoundingClientRect();
        teamInView = rr.top < (window.innerHeight * 0.9) && rr.bottom > 0;
      }, { passive: true });
    }
  }

  setup();
  (mq.addEventListener ? mq.addEventListener('change', setup) : mq.addListener(setup));
  window.addEventListener('orientationchange', () => setTimeout(setup, 150));
})();




/* =========================================
   OFFICES CARDS (tilt + expand) — script.js
   ========================================= */
(() => {
  const cards = Array.from(document.querySelectorAll(".office-card"));
  if (!cards.length) return;

  const canTilt = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  const closeAll = (exceptEl) => {
    cards.forEach((card) => {
      if (exceptEl && card === exceptEl) return;
      card.classList.remove("is-expanded");
      const btn = card.querySelector(".office-card__btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  };

  // Fill from data-attrs (so ты правишь только data-* в HTML)
  cards.forEach((card) => {
    const btn = card.querySelector(".office-card__btn");
    const frame = card.querySelector(".office-card__frame");
    if (!btn || !frame) return;

    const city = card.getAttribute("data-city") || "";
    const country = card.getAttribute("data-country") || "";
    const address = card.getAttribute("data-address") || "";
    const coords = card.getAttribute("data-coords") || "";
    const phone = card.getAttribute("data-phone") || "";
    const messenger = (card.getAttribute("data-messenger") || "").toLowerCase();
    const link = card.getAttribute("data-link") || "";

    const nameEl = card.querySelector(".office-card__name");
    const addrEl = card.querySelector(".office-card__addr");
    const coordsEl = card.querySelector(".office-card__coords");
    const phoneEl = card.querySelector(".office-card__phone");
    const actionLink = card.querySelector(".office-action");

    if (nameEl) nameEl.textContent = `${city}, ${country}`.trim().replace(/^,|,$/g, "");
    if (addrEl) addrEl.textContent = address;
    if (coordsEl) coordsEl.textContent = coords;
    if (phoneEl) phoneEl.textContent = phone;

    if (actionLink && link) {
      actionLink.setAttribute("href", link);

      // Small safety: ensure correct target labeling if someone swaps messenger type later
      if (messenger === "whatsapp") {
        actionLink.classList.remove("is-telegram");
        actionLink.classList.add("is-whatsapp");
        actionLink.setAttribute("aria-label", "Написать в WhatsApp");
        const tx = actionLink.querySelector(".office-action__tx");
        if (tx) tx.textContent = "WhatsApp";
      } else {
        actionLink.classList.remove("is-whatsapp");
        actionLink.classList.add("is-telegram");
        actionLink.setAttribute("aria-label", "Написать в Telegram");
        const tx = actionLink.querySelector(".office-action__tx");
        if (tx) tx.textContent = "Telegram";
      }
    }

    // Click: expand / collapse (one at a time)
    btn.addEventListener("click", () => {
      const isOpen = card.classList.contains("is-expanded");
      if (isOpen) {
        card.classList.remove("is-expanded");
        btn.setAttribute("aria-expanded", "false");
      } else {
        closeAll(card);
        card.classList.add("is-expanded");
        btn.setAttribute("aria-expanded", "true");
      }
    });

    // Tilt on hover (desktop only)
    if (!canTilt) return;

    let rafId = 0;

    const onMove = (e) => {
      const r = frame.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);

      const rx = (-dy * 7).toFixed(2);
      const ry = (dx * 7).toFixed(2);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        frame.style.setProperty("--rx", `${rx}deg`);
        frame.style.setProperty("--ry", `${ry}deg`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rafId);
      frame.style.setProperty("--rx", `0deg`);
      frame.style.setProperty("--ry", `0deg`);
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
  });

  // Click outside: close all
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".office-card")) return;
    closeAll(null);
  });
})();




/* =========================
   FOOTER socials: random loop (starts when #contact reached)
   paste at end of script.js
========================= */
(() => {
  const socials = Array.from(document.querySelectorAll("footer .footer-socials .social"));
  if (!socials.length) return;

  const contactSection =
    document.getElementById("contact") ||
    (document.getElementById("leadForm") ? document.getElementById("leadForm").closest("section") : null);

  let enabled = false;
  let timer = 0;
  let last = -1;

  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduce) return;

  const stop = () => {
    enabled = false;
    clearTimeout(timer);
    timer = 0;
    socials.forEach(el => el.classList.remove("is-pulse"));
  };

  const pickIndex = () => {
    if (socials.length === 1) return 0;
    let i = Math.floor(Math.random() * socials.length);
    if (i === last) i = (i + 1) % socials.length;
    last = i;
    return i;
  };

  const pulse = (el, dur) => {
    el.style.setProperty("--pulse-dur", `${dur}ms`);
    // перезапуск анимации без "залипания"
    el.classList.remove("is-pulse");
    void el.offsetWidth;
    el.classList.add("is-pulse");

    // снять класс чуть позже, чем длительность (чтобы не было морганий)
    setTimeout(() => el.classList.remove("is-pulse"), dur + 40);
  };

  const loop = () => {
    if (!enabled) return;

    const i = pickIndex();
    const el = socials[i];

    // “горит пару секунд”
    const dur = 1600 + Math.floor(Math.random() * 2200); // было 1200..2800, станет 1600..3800

    pulse(el, dur);

    // “быстро и рандомно, не синхронно”
    const nextIn = 700 + Math.floor(Math.random() * 1400); // было 220..940, станет 700..2100

    timer = setTimeout(loop, nextIn);
  };

  const start = () => {
    if (enabled) return;
    enabled = true;
    loop();
  };

  // Запуск строго когда дошли до формы
  if ("IntersectionObserver" in window && contactSection) {
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const inView = !!(e && e.isIntersecting && e.intersectionRatio > 0.22);

        if (inView) start();
        else stop();
      },
      {
        threshold: [0, 0.22, 0.6, 1],
        rootMargin: "0px 0px -12% 0px",
      }
    );

    io.observe(contactSection);
  } else {
    // fallback: включим после первой прокрутки к низу (на старых браузерах)
    const onScroll = () => {
      const y = window.scrollY || 0;
      const vh = window.innerHeight || 0;
      if (y > vh * 0.9) {
        start();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();

/* ===== LeadForm: single-submit + optional NDA/TZ upload ===== */
(() => {
  const form = document.getElementById('leadForm');
  if (!form) return;

  // Важно: ловим submit в CAPTURE и рубим остальные обработчики (если они есть)
  let locked = false;

  const fileInput = document.getElementById('leadFile');
  const fileText  = document.getElementById('leadFileText');
  const upStatus  = document.getElementById('leadUploadStatus');
  const formStatus = document.getElementById('formStatus');

  const docIdField   = document.getElementById('docIdField');
  const docNameField = document.getElementById('docNameField');
  const docSizeField = document.getElementById('docSizeField');
  const docErrorField= document.getElementById('docErrorField');
  const docUrlField  = document.getElementById('docUrlField'); // добавим в HTML ниже

  const submitBtn = form.querySelector('button[type="submit"]');

  const MAX_MB = 50;
  const MAX_BYTES = MAX_MB * 1024 * 1024;
  const allowedExt = new Set(['pdf','doc','docx','ppt','pptx','xls','xlsx','zip']);

  const setUp = (t='') => { if (upStatus) upStatus.textContent = t; };
  const setForm = (t='') => { if (formStatus) formStatus.textContent = t; };

  const resetDocFields = () => {
    if (docIdField) docIdField.value = '';
    if (docNameField) docNameField.value = '';
    if (docSizeField) docSizeField.value = '';
    if (docErrorField) docErrorField.value = '';
    if (docUrlField) docUrlField.value = '';
  };

  const humanSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
  };

  const validateFile = (file) => {
    const name = (file?.name || '').trim();
    const ext = name.split('.').pop().toLowerCase();
    if (!allowedExt.has(ext)) return 'Формат не поддерживается. Разрешено: PDF/DOCX/PPTX/XLSX/ZIP.';
    if (file.size > MAX_BYTES) return `Файл больше ${MAX_MB} MB. Сожмите или отправьте без вложения.`;
    return '';
  };

  if (fileInput && fileText) {
    fileInput.addEventListener('change', () => {
      resetDocFields();
      setForm('');

      const file = fileInput.files?.[0];
      if (!file) {
        fileText.textContent = 'Файл не выбран';
        setUp('');
        return;
      }

      const err = validateFile(file);
      if (err) {
        fileInput.value = '';
        fileText.textContent = 'Файл не выбран';
        setUp(err);
        return;
      }

      fileText.textContent = `${file.name} — ${humanSize(file.size)}`;
      setUp('Документ будет отправлен вместе с заявкой.');
    });
  }

  async function sendToWeb3Forms() {
    // Отправляем ровно один раз через fetch (никаких form.submit)
    const fd = new FormData(form); // соберёт все поля формы (файл не включится, т.к. у input нет name)
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || 'Web3Forms: ошибка отправки');
    }
  }

  async function onSubmit(e) {
    // Режем дубли и чужие обработчики
    e.preventDefault();
    e.stopImmediatePropagation();

    if (locked) return;
    locked = true;
    if (submitBtn) submitBtn.disabled = true;

    setForm('');
    const name  = document.getElementById('name')?.value?.trim() || '';
    const phone = document.getElementById('phone')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';

    if (!name || !phone || !email) {
      setForm('Заполните имя, телефон и почту.');
      locked = false;
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    const file = fileInput?.files?.[0];

    try {
      // 1) Если файла нет — просто шлём в Web3Forms
      if (!file) {
        resetDocFields();
        await sendToWeb3Forms();
        setForm('Заявка отправлена.');
        form.reset();
        if (fileText) fileText.textContent = 'Файл не выбран';
        setUp('');
        return;
      }

      // 2) Если файл есть — сначала грузим на сервер
      const err = validateFile(file);
      if (err) {
        setUp(err);
        return;
      }

      setUp('Загружаем документ…');

      const up = new FormData();
      up.append('file', file);
      up.append('lead_name', name);
      up.append('lead_phone', phone);
      up.append('lead_email', email);

      const upRes = await fetch('/api/upload-doc.php', { method: 'POST', body: up });
      const upData = await upRes.json().catch(() => ({}));

      if (!upRes.ok || !upData.ok) {
        // Не теряем лид: отправляем без файла
        if (docErrorField) docErrorField.value = upData?.code || 'UPLOAD_FAILED';
        setUp((upData?.error || 'Не удалось загрузить документ.') + ' Отправили заявку без вложения.');
        resetDocFields();
        await sendToWeb3Forms();
        setForm('Заявка отправлена.');
        return;
      }

      // 3) Записываем в скрытые поля (уйдут в Web3Forms)
      if (docIdField) docIdField.value = upData.doc_id || '';
      if (docNameField) docNameField.value = upData.doc_name || file.name;
      if (docSizeField) docSizeField.value = String(upData.doc_size || file.size);
      if (docUrlField) docUrlField.value = upData.doc_url || '';

      setUp('Документ прикреплён. Отправляем заявку…');

      // 4) Отправляем в Web3Forms ОДИН раз
      await sendToWeb3Forms();

      setForm('Заявка отправлена.');
      form.reset();
      if (fileText) fileText.textContent = 'Файл не выбран';
      setUp('');

    } catch (err) {
      setForm('Ошибка отправки. Проверь соединение и повтори.');
    } finally {
      locked = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  // Capture = true
  form.addEventListener('submit', onSubmit, true);
})();


// File card micro-animations (safe, no submit duplication)
(() => {
  const card = document.getElementById('docCard');
  const input = document.getElementById('docFile') || card?.querySelector('input[type="file"]');
  if (!card || !input) return;

  const pulse = () => {
    card.classList.remove('pulse');
    // reflow to restart animation
    void card.offsetWidth;
    card.classList.add('pulse');
    setTimeout(() => card.classList.remove('pulse'), 1000);
  };

  input.addEventListener('change', () => {
    const has = !!(input.files && input.files.length);
    card.classList.toggle('has-file', has);
    if (has) pulse();
  });
})();

/* =========================================
   HOWPATH — Museum rail sync (minimal)
========================================= */
(() => {
  const root = document.querySelector(".howpath");
  if (!root) return;

  const railNo = root.querySelector("#howRailNo");
  const railName = root.querySelector("#howRailName");
  const items = Array.from(root.querySelectorAll(".howpath__item"));

  if (!railNo || !railName || !items.length) return;

  const setActive = (el) => {
    items.forEach(x => x.classList.toggle("is-active", x === el));
    railNo.textContent = el.dataset.no || "01";
    railName.textContent = el.dataset.name || "";
  };

  // Hover/focus = “подсветка экспоната”
  items.forEach(el => {
    el.addEventListener("mouseenter", () => setActive(el));
    el.addEventListener("focus", () => setActive(el));
    el.addEventListener("click", () => setActive(el));
  });

  // Scroll sync (choose most visible item)
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target) setActive(visible.target);
  }, {
    threshold: [0.35, 0.55, 0.75],
    rootMargin: "-10% 0px -55% 0px"
  });

  items.forEach(el => io.observe(el));
})();

/* HOW WE WORK — always replay on scroll up/down */
(() => {
  const section = document.querySelector('.howpath, section#how');
  if (!section) return;

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (prefersReduced) {
    section.classList.add('is-in');
    return;
  }

  // Выбираем элементы для анимации без правок HTML
  const candidates = section.querySelectorAll(
    '.howpath__head, .howpath__title, .howpath__meta, header, h2, ' +
    '.howpath__item, .howpath__step, .howpath__row, li'
  );

  const targets = candidates.length
    ? Array.from(new Set(candidates))
    : Array.from(section.querySelectorAll(':scope > *'));

  // Навешиваем класс + задержки
  targets.forEach((el, i) => {
    el.classList.add('how-reveal');
    el.style.setProperty('--d', `${Math.min(i * 70, 420)}ms`);
  });

  const resetOut = () => {
    section.classList.add('is-reset');
    section.classList.remove('is-in');

    // снимаем is-reset через 2 кадра — чтобы сброс был мгновенный
    requestAnimationFrame(() => {
      requestAnimationFrame(() => section.classList.remove('is-reset'));
    });
  };

  const setIn = () => {
    // на входе: сначала убедимся что нет reset,
    // затем в следующий кадр включаем is-in (гарантия проигрывания анимации)
    section.classList.remove('is-reset');
    section.classList.remove('is-in');
    requestAnimationFrame(() => section.classList.add('is-in'));
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) setIn();
      else resetOut();
    }
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -12% 0px'
  });

  io.observe(section);

  // если секция уже в кадре при загрузке
  const r = section.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (r.top < vh * 0.88 && r.bottom > vh * 0.12) setIn();
  else resetOut();
})();

/* =========================
   NEBULA SHADER (isolated THREE instance)
   Mount: #nebulaBg inside #top.hero
   Requires: three.min.js loaded -> window.THREE
========================= */
(() => {
  const mount = document.getElementById("nebulaBg");
  if (!mount) return;

  // protect from double init
  if (mount.dataset.nebulaInit === "1") return;
  mount.dataset.nebulaInit = "1";

  // respect reduced motion
  const rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rm) return;

  const THREE = window.THREE;
  if (!THREE) {
    console.warn("[Nebula] THREE not found. Load three.min.js before script.js");
    return;
  }

  const vertexShader = `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  // IMPORTANT: UV centered (fixes “shader went left”)
  const fragmentShader = `
    precision highp float;

    uniform vec2  iResolution;
    uniform float iTime;
    uniform vec2  iMouse;
    uniform bool  hasActiveReminders;
    uniform bool  hasUpcomingReminders;
    uniform bool  disableCenterDimming;

    varying vec2 vUv;

    #define t iTime
    mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

    float map(vec3 p){
      p.xz *= m(t*0.4);
      p.xy *= m(t*0.3);
      vec3 q = p*2. + t;
      return length(p + vec3(sin(t*0.7))) * log(length(p)+1.0)
           + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
    }

    void mainImage(out vec4 O, in vec2 fragCoord){
      // centered coords (no left bias)
      vec2 uv = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);

      vec3 col = vec3(0.0);
      float d = 2.5;

      for(int i=0;i<=5;i++){
        vec3 p = vec3(0,0,5.) + normalize(vec3(uv, -1.)) * d;
        float rz = map(p);
        float f  = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

        vec3 base = hasActiveReminders
          ? vec3(0.05,0.2,0.5) + vec3(4.0,2.0,5.0)*f
          : hasUpcomingReminders
          ? vec3(0.05,0.3,0.1) + vec3(2.0,5.0,1.0)*f
          : vec3(0.1,0.3,0.4) + vec3(5.0,2.5,3.0)*f;

        col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
        d += min(rz, 1.0);
      }

      // center dimming
      float dist   = distance(fragCoord, iResolution*0.5);
      float radius = min(iResolution.x, iResolution.y) * 0.5;
      float dim    = disableCenterDimming ? 1.0 : smoothstep(radius*0.3, radius*0.5, dist);

      O = vec4(col, 1.0);
      if(!disableCenterDimming){
        O.rgb = mix(O.rgb * 0.3, O.rgb, dim);
      }
    }

    void main(){
      mainImage(gl_FragColor, vUv * iResolution);
    }
  `;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x050505, 1);
  mount.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const clock  = new THREE.Clock();

  const uniforms = {
    iTime:                { value: 0 },
    iResolution:          { value: new THREE.Vector2(1, 1) },
    iMouse:               { value: new THREE.Vector2(0, 0) },
    hasActiveReminders:   { value: false },
    hasUpcomingReminders: { value: false },
    disableCenterDimming: { value: false },
  };

  function syncFromDataset(){
    const palette = (mount.dataset.palette || "default").toLowerCase();
    uniforms.hasActiveReminders.value   = palette === "active";
    uniforms.hasUpcomingReminders.value = palette === "upcoming";

    const centerDimOn = (mount.dataset.centerDim || "1") !== "0";
    uniforms.disableCenterDimming.value = !centerDimOn;
  }
  syncFromDataset();

  const mo = new MutationObserver(syncFromDataset);
  mo.observe(mount, { attributes: true, attributeFilter: ["data-palette","data-center-dim"] });

  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), material);
  scene.add(mesh);

  function onResize(){
    const w = mount.clientWidth  || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;

    renderer.setSize(w, h, false);
    uniforms.iResolution.value.set(w * dpr, h * dpr);
  }

  function onMouseMove(e){
    const r = mount.getBoundingClientRect();
    const x = (e.clientX - r.left) * dpr;
    const y = (r.height - (e.clientY - r.top)) * dpr;
    uniforms.iMouse.value.set(x, y);
  }

  window.addEventListener("resize", onResize, { passive:true });
  window.addEventListener("mousemove", onMouseMove, { passive:true });
  onResize();

  let raf = 0;
  const tick = () => {
    uniforms.iTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  // cleanup
  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMouseMove);
    mo.disconnect();

    scene.remove(mesh);
    mesh.geometry.dispose();
    material.dispose();
    renderer.dispose();

    if (renderer.domElement && renderer.domElement.parentNode === mount) {
      mount.removeChild(renderer.domElement);
    }
  }, { once:true });
})();

/* =========================
   WORK TILES — GLOW CONTROL (NO LIBS)
   Desktop: hover + pointer-follow
   Mobile: in-view + scroll-driven angle
   Scope: #work .tile
========================= */
(() => {
  const tiles = Array.from(document.querySelectorAll("#work .tile"));
  if (!tiles.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const mqDesktop = window.matchMedia("(hover: hover) and (pointer: fine)");
  const mqMobile  = window.matchMedia("(hover: none), (pointer: coarse)");

  const state = new Map();
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const normAngle = (a) => ((a % 360) + 360) % 360;
  const shortestDelta = (from, to) => {
    const a = normAngle(to) - normAngle(from);
    return ((a + 540) % 360) - 180; // [-180..180]
  };

  function ensure(el){
    if (state.has(el)) return state.get(el);
    const s = { active: 0, current: 0, target: 0, raf: 0, inView: false, hovering: false };
    state.set(el, s);
    // set initial values to avoid NaN jumps
    el.style.setProperty("--ge-angle", "0");
    el.style.setProperty("--ge-active", "0");
    return s;
  }

  function angleFromPointToCenter(el, x, y){
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width * 0.5;
    const cy = r.top  + r.height * 0.5;
    return (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90;
  }

  function start(el){
    const s = ensure(el);
    if (s.raf) return;

    const tick = () => {
      // smooth angle
      const d = shortestDelta(s.current, s.target);
      s.current = normAngle(s.current + d * 0.14);

      // smooth active (read current from CSS var, write eased)
      const curA = parseFloat(el.style.getPropertyValue("--ge-active") || "0");
      const nextA = clamp01(curA + (s.active - curA) * 0.18);

      el.style.setProperty("--ge-angle", s.current.toFixed(3));
      el.style.setProperty("--ge-active", nextA.toFixed(3));

      const still = Math.abs(d) > 0.02 || Math.abs(s.active - nextA) > 0.01;
      if (still) s.raf = requestAnimationFrame(tick);
      else {
        el.style.setProperty("--ge-angle", normAngle(s.target).toFixed(3));
        el.style.setProperty("--ge-active", clamp01(s.active).toFixed(3));
        s.raf = 0;
      }
    };

    s.raf = requestAnimationFrame(tick);
  }

  function setActive(el, on){
    const s = ensure(el);
    s.active = on ? 1 : 0;
    start(el);
  }

  function setAngle(el, angle){
    const s = ensure(el);
    s.target = normAngle(angle);
    start(el);
  }

  /* -------------------------
     DESKTOP: hover + pointer
  --------------------------*/
  function initDesktop(){
    tiles.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const s = ensure(el);
        s.hovering = true;
        setActive(el, true);
      });

      el.addEventListener("mouseleave", () => {
        const s = ensure(el);
        s.hovering = false;
        setActive(el, false);
      });

      el.addEventListener("pointermove", (e) => {
        const s = ensure(el);
        if (!s.hovering) return;
        setAngle(el, angleFromPointToCenter(el, e.clientX, e.clientY));
      });
    });
  }

  /* -------------------------
     MOBILE: in-view + scroll
  --------------------------*/
  function initMobile(){
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const s = ensure(el);
        s.inView = entry.isIntersecting && entry.intersectionRatio > 0.18;
        setActive(el, s.inView);
      });
    }, { threshold: [0, 0.18, 0.35, 0.6] });

    tiles.forEach((el) => io.observe(el));

    let raf = 0;
    const update = () => {
      raf = 0;
      const vx = window.innerWidth * 0.5;
      const vy = window.innerHeight * 0.5;

      tiles.forEach((el) => {
        const s = ensure(el);
        if (!s.inView) return;
        setAngle(el, angleFromPointToCenter(el, vx, vy));
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  if (mqDesktop.matches) initDesktop();
  if (mqMobile.matches) initMobile();
})();

/* =========================================================
   CLIENTS — Infinite Logo Marquee (rAF, perfectly smooth, moves RIGHT)
   Full replacement block. Paste at the very end of script.js
========================================================= */
(() => {
  const root = document.querySelector("#clients.clients--marquee .logo-marquee");
  if (!root) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const viewport = root.querySelector(".logo-marquee__viewport");
  const track = root.querySelector(".logo-marquee__track");
  const baseSet = root.querySelector(".logo-marquee__set");
  if (!viewport || !track || !baseSet) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  let distance = 0;     // px: width of one logo set
  let offset = 0;       // px: 0..distance (moves right)
  let speed = 80;       // px/sec: current speed
  let targetSpeed = 80; // px/sec
  let rafId = 0;
  let lastT = 0;

  // ---- helpers ----
  const waitForImages = async (container) => {
    const imgs = Array.from(container.querySelectorAll("img"));
    if (!imgs.length) return;

    await Promise.all(
      imgs.map((img) => {
        if (img.decode) return img.decode().catch(() => {});
        if (img.complete) return Promise.resolve();
        return new Promise((res) => img.addEventListener("load", () => res(), { once: true }));
      })
    );
  };

  const clearClones = () => {
    Array.from(track.querySelectorAll(".logo-marquee__set"))
      .slice(1)
      .forEach((n) => n.remove());
  };

  const cloneSet = () => {
    const c = baseSet.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    return c;
  };

  const buildLoop = () => {
    clearClones();

    // минимум 2 набора, чтобы был контент “слева” при движении вправо
    track.appendChild(cloneSet());

    // добавим ещё, если экран широкий (на всякий)
    let guard = 0;
    while (track.scrollWidth < viewport.clientWidth * 2.2 && guard < 10) {
      track.appendChild(cloneSet());
      guard++;
    }
  };

  const measure = () => {
    const rect = baseSet.getBoundingClientRect();
    distance = Math.max(320, Math.round(rect.width));
    offset = distance ? (offset % distance) : 0;
  };

  const applyTransform = () => {
    // ВАЖНО: стартуем с -distance и двигаем к 0 => логотипы “едут вправо”
    // seamless: когда offset сбрасывается, картинка та же, потому что следующий set идентичен
    const x = (-distance + offset);
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  };

  const readSpeeds = () => {
    const base = clamp(parseFloat(root.dataset.speed || "80"), 10, 400);        // px/sec
    const hover = clamp(parseFloat(root.dataset.speedHover || "25"), 10, 400); // px/sec
    targetSpeed = base;
    speed = base;
    root._marqueeBaseSpeed = base;
    root._marqueeHoverSpeed = hover;
  };

  // ---- animation ----
  const tick = (t) => {
    if (!lastT) lastT = t;
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;

    // плавное изменение скорости
    const k = 10;
    speed += (targetSpeed - speed) * (1 - Math.exp(-k * dt));

    if (distance > 0) {
      // RIGHT: offset растёт, transform становится менее отрицательным => трек едет вправо
      offset += speed * dt;
      if (offset >= distance) offset -= distance;
      applyTransform();
    }

    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    stop();
    lastT = 0;
    rafId = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };

  // ---- hover slowdown ----
  const onEnter = () => {
    targetSpeed = root._marqueeHoverSpeed ?? targetSpeed;
  };
  const onLeave = () => {
    targetSpeed = root._marqueeBaseSpeed ?? targetSpeed;
  };

  // ---- init / resize ----
  const init = async () => {
    readSpeeds();
    await waitForImages(baseSet);
    buildLoop();
    measure();
    applyTransform();
    start();
  };

  const onResize = () => {
    stop();
    buildLoop();
    measure();
    applyTransform();
    start();
  };

  root.addEventListener("mouseenter", onEnter);
  root.addEventListener("mouseleave", onLeave);

  let resizeRaf = 0;
  window.addEventListener(
    "resize",
    () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(onResize);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  init();
})();

(() => {
  const btn = document.getElementById("startProjectHowBtn");
  if (!btn) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mqMobile = window.matchMedia("(max-width: 720px)");

  // Show CTA only at top; hide immediately on scroll down.
  const TOP_THRESHOLD = 8;

  function setHidden(hidden) {
    btn.classList.toggle("is-hidden", hidden);
    if (hidden) {
      btn.style.setProperty("--mx", "0px");
      btn.style.setProperty("--my", "0px");
      btn.classList.remove("is-near");
      state.near = false;
      setTarget(0, 0, true);
    }
  }

  function onScroll() {
    setHidden(window.scrollY > TOP_THRESHOLD);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Avoid overlap with contact pill on mobile (if it exists and overlaps)
  function applyMobileOffsetIfNeeded() {
    // Reset inline bottom first (CSS controls default)
    btn.style.bottom = "";

    if (!mqMobile.matches) return;

    const pill = document.getElementById("contactPill");
    if (!pill) return;

    const pillRect = pill.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const pillVisible = pillRect.width > 0 && pillRect.height > 0;
    if (!pillVisible) return;

    const overlap =
      !(btnRect.right < pillRect.left ||
        btnRect.left > pillRect.right ||
        btnRect.bottom < pillRect.top ||
        btnRect.top > pillRect.bottom);

    if (overlap) {
      const base = 14;
      const lift = Math.round(pillRect.height + 12);
      btn.style.bottom = `calc(${base + lift}px + env(safe-area-inset-bottom))`;
    }
  }

  applyMobileOffsetIfNeeded();
  window.addEventListener("resize", applyMobileOffsetIfNeeded);
  mqMobile.addEventListener?.("change", applyMobileOffsetIfNeeded);

  // ---------------------------
  // Magnetic motion (desktop mouse only)
  // ---------------------------
  const state = {
    tx: 0, ty: 0,
    cx: 0, cy: 0,
    near: false,
    radius: 170,
    strength: 0.35,
    raf: null,
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function setVars(x, y) {
    btn.style.setProperty("--mx", `${x.toFixed(2)}px`);
    btn.style.setProperty("--my", `${y.toFixed(2)}px`);
  }

  function tick() {
    state.cx += (state.tx - state.cx) * 0.12;
    state.cy += (state.ty - state.cy) * 0.12;
    setVars(state.cx, state.cy);

    if (Math.abs(state.tx - state.cx) < 0.15 && Math.abs(state.ty - state.cy) < 0.15) {
      state.raf = null;
      return;
    }
    state.raf = requestAnimationFrame(tick);
  }

  function setTarget(x, y, immediate = false) {
    state.tx = x;
    state.ty = y;
    if (immediate) {
      state.cx = x; state.cy = y;
      setVars(x, y);
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = null;
      return;
    }
    if (!state.raf) state.raf = requestAnimationFrame(tick);
  }

  function onPointerMove(e) {
    if (prefersReduced) return;
    if (btn.classList.contains("is-hidden")) return;

    // Magnetic only on desktop mouse
    if (mqMobile.matches) return;
    if (e.pointerType && e.pointerType !== "mouse") return;

    const rect = btn.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;

    const dx = e.clientX - bx;
    const dy = e.clientY - by;
    const dist = Math.hypot(dx, dy);

    const near = dist < state.radius;
    if (near !== state.near) {
      state.near = near;
      btn.classList.toggle("is-near", near);
    }

    if (near) {
      const t = 1 - clamp(dist / state.radius, 0, 1);
      const s = state.strength * (0.35 + 0.65 * t);

      const mx = clamp(dx * s, -34, 34);
      const my = clamp(dy * s, -34, 34);
      setTarget(mx, my);
    } else {
      setTarget(0, 0);
    }
  }

  function onBlur() {
    btn.classList.remove("is-near");
    state.near = false;
    setTarget(0, 0);
  }

  if (!prefersReduced) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onBlur);
  }

  // ---------------------------
  // Click → scroll to "How we work" (#how)
  // ---------------------------
  btn.addEventListener("click", () => {
    const how = document.getElementById("how") || document.querySelector("#how");
    if (!how) return;

    how.scrollIntoView({ behavior: "smooth", block: "start" });
    setHidden(true);
  });
})();


(() => {
  const PS_UPLOAD_URL = "//api/upload-doc.php"; // <-- поставь свой реальный URL на PS.kz
  const MAX_MB = 50;

  const COUNTRIES = [
    { iso: "RU", name: "Россия", dial: "7",  flag: "🇷🇺", placeholder: "(999) 999-99-99", max: 10, fmt: (d) => fmtGroups(d, [3,3,2,2], ["(", ") ", "-", "-"]) },
    { iso: "KZ", name: "Казахстан", dial: "7", flag: "🇰🇿", placeholder: "(999) 999-99-99", max: 10, fmt: (d) => fmtGroups(d, [3,3,2,2], ["(", ") ", "-", "-"]) },
    { iso: "UZ", name: "Узбекистан", dial: "998", flag: "🇺🇿", placeholder: "(99) 999-99-99", max: 9, fmt: (d) => fmtGroups(d, [2,3,2,2], ["(", ") ", "-", "-"]) },
    { iso: "US", name: "United States", dial: "1",  flag: "🇺🇸", placeholder: "(999) 999-9999", max: 10, fmt: (d) => fmtGroups(d, [3,3,4], ["(", ") ", "-"]) },
    { iso: "DE", name: "Deutschland", dial: "49", flag: "🇩🇪", placeholder: "151 23456789", max: 11, fmt: (d) => fmtPlainGroups(d, [3,8], [" "]) },
    { iso: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧", placeholder: "20 1234 5678", max: 10, fmt: (d) => fmtPlainGroups(d, [2,4,4], [" ", " "]) },
  ];

  const contact = document.getElementById("contact");
  const successWrap = document.getElementById("contactSuccess");
  const successTextEl = document.getElementById("contactSuccessText");

  const form = document.getElementById("msfForm");
  const stepsWrap = document.getElementById("msfSteps");
  const stepBtns = stepsWrap ? Array.from(stepsWrap.querySelectorAll(".msf-step")) : [];

  const line01 = document.getElementById("msfLine01");
  const line12 = document.getElementById("msfLine12");
  const line23 = document.getElementById("msfLine23");
  const bar = document.getElementById("msfBar");

  const label = document.getElementById("msfLabel");
  const count = document.getElementById("msfCount");

  const fieldText = document.getElementById("msfFieldText");
  const fieldPhone = document.getElementById("msfFieldPhone");
  const fieldDocs = document.getElementById("msfFieldDocs");

  const textInput = document.getElementById("msfTextInput");
  const hint = document.getElementById("msfHint");

  const ccBtn = document.getElementById("msfCcBtn");
  const ccFlag = document.getElementById("msfCcFlag");
  const ccCode = document.getElementById("msfCcCode");
  const ccMenu = document.getElementById("msfCcMenu");
  const ccSearch = document.getElementById("msfCcSearch");
  const ccList = document.getElementById("msfCcList");
  const ccClose = document.getElementById("msfCcClose");

  const phoneInput = document.getElementById("msfPhoneInput");

  const fileInput = document.getElementById("msfFile");
  const docsHint = document.getElementById("msfDocsHint");
  const noDocs = document.getElementById("msfNoDocs");

  const cta = document.getElementById("msfCta");
  const ctaLabel = document.getElementById("msfCtaLabel");
  const backBtn = document.getElementById("msfBack");
  const status = document.getElementById("msfStatus");

  const hMessage = document.getElementById("msf_message_h");
  const hName = document.getElementById("msf_name_h");
  const hEmail = document.getElementById("msf_email_h");
  const hPhone = document.getElementById("msf_phone_h");
  const hPhoneE164 = document.getElementById("msf_phone_e164_h");
  const hPhoneCountry = document.getElementById("msf_phone_country_h");
  const hPhoneDial = document.getElementById("msf_phone_dial_h");
  const hNoDocs = document.getElementById("msf_no_docs_h");
  const hDocUrl = document.getElementById("msf_doc_url");
  const hDocName = document.getElementById("msf_doc_name");
  const hDocSize = document.getElementById("msf_doc_size");
  const hDocType = document.getElementById("msf_doc_type");

  if (
    !form || !label || !count || !bar || !cta || !ctaLabel || !backBtn || !status ||
    !fieldText || !fieldPhone || !fieldDocs || !textInput || !phoneInput ||
    !ccBtn || !ccMenu || !ccList || !fileInput || !docsHint || !noDocs ||
    !contact || !successWrap
  ) return;

  const steps = [
    { label: "Имя", type: "text", placeholder: "Ваше имя", hint: "Как к вам обращаться?" },
    { label: "Email", type: "email", placeholder: "you@example.com", hint: "Туда пришлем уточнения и тайминг." },
    { label: "Телефон", type: "phone", placeholder: "", hint: "Выберите страну и введите номер." },
    { label: "Документы", type: "docs", placeholder: "", hint: "Файл или «Документов нет»." },
  ];

  let current = 0;
  let busy = false;

  const data = { name: "", email: "" };

  let selected = COUNTRIES.find(c => c.iso === "RU") || COUNTRIES[0];
  let phoneDigits = "";

  const digitsOnly = (v) => (v || "").replace(/\D/g, "");
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function fmtGroups(d, groups, tokens) {
    const s = (d || "").slice(0, groups.reduce((a,b)=>a+b,0));
    const parts = [];
    let idx = 0;
    for (let g of groups) {
      const chunk = s.slice(idx, idx + g);
      if (chunk) parts.push(chunk);
      idx += g;
    }
    if (!parts.length) return "";
    if (tokens[0] === "(") {
      const a = parts[0] || "";
      const b = parts[1] || "";
      const c = parts[2] || "";
      const e = parts[3] || "";
      let out = "";
      if (a) out += `(${a}`;
      if (a && a.length === groups[0]) out += `)`;
      if (b) out += ` ${b}`;
      if (c) out += `${tokens[2] || "-"}${c}`;
      if (e) out += `${tokens[3] || "-"}${e}`;
      return out.trim();
    }
    return fmtPlainGroups(s, groups, tokens);
  }

  function fmtPlainGroups(d, groups, seps) {
    const s = (d || "").slice(0, groups.reduce((a,b)=>a+b,0));
    if (!s) return "";
    const parts = [];
    let idx = 0;
    for (let i=0;i<groups.length;i++){
      const g = groups[i];
      const chunk = s.slice(idx, idx+g);
      if (chunk) parts.push(chunk);
      idx += g;
    }
    let out = "";
    for (let i=0;i<parts.length;i++){
      out += parts[i];
      if (i < parts.length-1) out += (seps[i] || " ");
    }
    return out;
  }

  function digitIndexBeforeCaret(str, caretPos) {
    return (str.slice(0, Math.max(0, caretPos)).match(/\d/g) || []).length;
  }
  function caretFromDigitIndex(formatted, digitIndex) {
    if (digitIndex <= 0) return 0;
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) count++;
      if (count >= digitIndex) return i + 1;
    }
    return formatted.length;
  }
  function removeDigitsRange(srcDigits, startIndex, endIndex) {
    const a = srcDigits.slice(0, Math.max(0, startIndex));
    const b = srcDigits.slice(Math.min(srcDigits.length, endIndex));
    return a + b;
  }

  function e164() {
    if (!phoneDigits) return "";
    return `+${selected.dial}${phoneDigits}`;
  }
  function phoneDisplay() {
    if (!phoneDigits) return "";
    const local = selected.fmt(phoneDigits);
    return `+${selected.dial} ${local}`.trim();
  }

  function buildMessage() {
    const parts = [];
    parts.push(`Имя: ${(data.name || "").trim()}`);
    parts.push(`Email: ${(data.email || "").trim()}`);
    parts.push(`Телефон: ${phoneDisplay() || "-"}`);
    const nd = noDocs.checked ? "Да" : "Нет";
    parts.push(`Документов нет: ${nd}`);
    const url = (hDocUrl && hDocUrl.value) ? hDocUrl.value : "";
    if (url) parts.push(`Документ: ${url}`);
    return parts.join("\n");
  }

  function syncHidden() {
    if (hName) hName.value = (data.name || "").trim();
    if (hEmail) hEmail.value = (data.email || "").trim();

    if (hPhoneCountry) hPhoneCountry.value = selected.iso;
    if (hPhoneDial) hPhoneDial.value = `+${selected.dial}`;
    if (hPhoneE164) hPhoneE164.value = e164();
    if (hPhone) hPhone.value = phoneDisplay();

    if (hNoDocs) hNoDocs.value = (noDocs.checked ? "1" : "0");

    if (hMessage) hMessage.value = buildMessage();
  }

  function setLines() {
    if (line01) line01.style.transform = `scaleX(${current >= 1 ? 1 : 0})`;
    if (line12) line12.style.transform = `scaleX(${current >= 2 ? 1 : 0})`;
    if (line23) line23.style.transform = `scaleX(${current >= 3 ? 1 : 0})`;
  }

  function phoneValid() {
    return phoneDigits.length === selected.max;
  }

  function isValidStep() {
    if (current === 0) return (data.name || "").trim().length >= 2;
    if (current === 1) return isEmail((data.email || "").trim());
    if (current === 2) return phoneValid();
    if (current === 3) {
      const hasFile = fileInput.files && fileInput.files.length > 0;
      return hasFile || noDocs.checked;
    }
    return false;
  }

  function setCountry(iso) {
    const found = COUNTRIES.find(c => c.iso === iso);
    if (!found) return;

    selected = found;

    if (ccFlag) ccFlag.textContent = selected.flag;
    if (ccCode) ccCode.textContent = `+${selected.dial}`;

    phoneDigits = (phoneDigits || "").slice(0, selected.max);
    phoneInput.placeholder = selected.placeholder;
    phoneInput.value = selected.fmt(phoneDigits);

    syncHidden();
    cta.disabled = busy || !isValidStep();
  }

  function escapeHtml(s){
    return (s||"").replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m] || m));
  }

  function renderCcList(query) {
    const q = (query || "").trim().toLowerCase();
    const items = COUNTRIES.filter(c => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        (`+${c.dial}`).includes(q.replace(/\s/g,"")) ||
        c.dial.includes(q.replace(/\D/g,""))
      );
    });

    ccList.innerHTML = items.map(c => `
      <button type="button" class="msf-cc__item ${c.iso === selected.iso ? "is-active" : ""}" role="option" data-iso="${c.iso}" aria-selected="${c.iso === selected.iso ? "true" : "false"}">
        <span class="msf-cc__itemLeft">
          <span class="msf-cc__itemFlag" aria-hidden="true">${c.flag}</span>
          <span class="msf-cc__itemName">${escapeHtml(c.name)}</span>
        </span>
        <span class="msf-cc__itemCode">+${c.dial}</span>
      </button>
    `).join("");
  }

  function openCc() {
    ccMenu.hidden = false;
    ccBtn.setAttribute("aria-expanded", "true");
    renderCcList(ccSearch ? ccSearch.value : "");
    requestAnimationFrame(() => {
      if (ccSearch) ccSearch.focus({ preventScroll: true });
      document.body.style.overflow = "hidden";
    });
  }

  function closeCc() {
    ccMenu.hidden = true;
    ccBtn.setAttribute("aria-expanded", "false");
    if (ccSearch) ccSearch.value = "";
    document.body.style.overflow = "";
    requestAnimationFrame(() => phoneInput.focus({ preventScroll: true }));
  }

  ccBtn.addEventListener("click", openCc);
  if (ccClose) ccClose.addEventListener("click", closeCc);
  ccMenu.addEventListener("click", (e) => { if (e.target === ccMenu) closeCc(); });

  if (ccSearch) {
    ccSearch.addEventListener("input", () => renderCcList(ccSearch.value));
    ccSearch.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCc(); });
  }

  ccList.addEventListener("click", (e) => {
    const btn = e.target.closest(".msf-cc__item");
    if (!btn) return;
    setCountry(btn.getAttribute("data-iso"));
    closeCc();
  });

  window.addEventListener("keydown", (e) => {
    if (!ccMenu.hidden && e.key === "Escape") closeCc();
  });

  function applyPhoneRawDigits(rawDigits) {
    const d = (rawDigits || "").replace(/\D/g, "");
    phoneDigits = d.slice(0, selected.max);
    phoneInput.value = phoneDigits ? selected.fmt(phoneDigits) : "";
    syncHidden();
    cta.disabled = busy || !isValidStep();
  }

  phoneInput.addEventListener("keydown", (e) => {
    const isBackspace = e.key === "Backspace";
    const isDelete = e.key === "Delete";

    if ((isBackspace || isDelete) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();

      const val = phoneInput.value || "";
      const selStart = phoneInput.selectionStart ?? val.length;
      const selEnd = phoneInput.selectionEnd ?? val.length;

      const startDigit = digitIndexBeforeCaret(val, selStart);
      const endDigit = digitIndexBeforeCaret(val, selEnd);

      if (selEnd > selStart) {
        phoneDigits = removeDigitsRange(phoneDigits, startDigit, endDigit);
        phoneInput.value = phoneDigits ? selected.fmt(phoneDigits) : "";
        const caret = caretFromDigitIndex(phoneInput.value, startDigit);
        requestAnimationFrame(() => phoneInput.setSelectionRange(caret, caret));
        syncHidden();
        cta.disabled = busy || !isValidStep();
        return;
      }

      if (isBackspace) {
        const removeAt = startDigit - 1;
        if (removeAt >= 0) phoneDigits = removeDigitsRange(phoneDigits, removeAt, removeAt + 1);
        phoneInput.value = phoneDigits ? selected.fmt(phoneDigits) : "";
        const caret = caretFromDigitIndex(phoneInput.value, Math.max(0, startDigit - 1));
        requestAnimationFrame(() => phoneInput.setSelectionRange(caret, caret));
      }

      if (isDelete) {
        const removeAt = startDigit;
        if (removeAt < phoneDigits.length) phoneDigits = removeDigitsRange(phoneDigits, removeAt, removeAt + 1);
        phoneInput.value = phoneDigits ? selected.fmt(phoneDigits) : "";
        const caret = caretFromDigitIndex(phoneInput.value, startDigit);
        requestAnimationFrame(() => phoneInput.setSelectionRange(caret, caret));
      }

      syncHidden();
      cta.disabled = busy || !isValidStep();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (!cta.disabled) cta.click();
    }
  });

  phoneInput.addEventListener("input", () => {
    const val = phoneInput.value || "";
    const caret = phoneInput.selectionStart ?? val.length;
    const digitIndex = digitIndexBeforeCaret(val, caret);

    applyPhoneRawDigits(digitsOnly(val));

    const formatted = phoneInput.value || "";
    const newCaret = caretFromDigitIndex(formatted, Math.min(digitIndex, phoneDigits.length));
    requestAnimationFrame(() => phoneInput.setSelectionRange(newCaret, newCaret));
  });

  textInput.addEventListener("input", () => {
    if (current === 0) data.name = textInput.value;
    if (current === 1) data.email = textInput.value;
    syncHidden();
    cta.disabled = busy || !isValidStep();
  });

  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!cta.disabled) cta.click();
    }
  });

  fileInput.addEventListener("change", () => {
    const f = fileInput.files && fileInput.files[0];
    docsHint.textContent = f ? f.name : "PDF / DOCX / ZIP до 50MB";
    if (f) noDocs.checked = false;

    if (f) {
      const mb = f.size / (1024 * 1024);
      if (mb > MAX_MB) {
        fileInput.value = "";
        docsHint.textContent = `Слишком большой файл. Максимум ${MAX_MB}MB`;
      }
    }

    syncHidden();
    cta.disabled = busy || !isValidStep();
  });

  noDocs.addEventListener("change", () => {
    if (noDocs.checked) {
      fileInput.value = "";
      docsHint.textContent = "PDF / DOCX / ZIP до 50MB";
      if (hDocUrl) hDocUrl.value = "";
      if (hDocName) hDocName.value = "";
      if (hDocSize) hDocSize.value = "";
      if (hDocType) hDocType.value = "";
    }
    syncHidden();
    cta.disabled = busy || !isValidStep();
  });

  function setStepsUI() {
    label.textContent = steps[current].label;
    count.textContent = `${current + 1}/${steps.length}`;

    stepBtns.forEach((b, idx) => {
      b.classList.toggle("is-active", idx === current);
      b.classList.toggle("is-done", idx < current);
      b.toggleAttribute("disabled", idx > current);
      if (idx === current) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });

    bar.style.width = `${((current + 1) / steps.length) * 100}%`;
    setLines();

    fieldText.hidden = !(current === 0 || current === 1);
    fieldPhone.hidden = current !== 2;
    fieldDocs.hidden = current !== 3;

    if (current === 0 || current === 1) {
      textInput.type = (current === 1) ? "email" : "text";
      textInput.placeholder = steps[current].placeholder;
      textInput.value = current === 0 ? (data.name || "") : (data.email || "");
      if (hint) hint.textContent = steps[current].hint || "";
      ctaLabel.textContent = "Продолжить";
      requestAnimationFrame(() => textInput.focus({ preventScroll: true }));
    }

    if (current === 2) {
      ccMenu.hidden = true;
      ccBtn.setAttribute("aria-expanded", "false");
      phoneInput.placeholder = selected.placeholder;
      phoneInput.value = selected.fmt(phoneDigits);
      ctaLabel.textContent = "Продолжить";
      requestAnimationFrame(() => phoneInput.focus({ preventScroll: true }));
    }

    if (current === 3) ctaLabel.textContent = "Отправить";

    backBtn.hidden = current === 0;
    syncHidden();
    cta.disabled = busy || !isValidStep();
  }

  backBtn.addEventListener("click", () => {
    if (busy) return;
    current = Math.max(0, current - 1);
    setStepsUI();
  });

  function setBusy(on) {
    busy = on;
    cta.classList.toggle("is-busy", on);
    cta.disabled = on || !isValidStep();
    backBtn.disabled = on;
  }

  function showError(msg) {
    status.textContent = msg || "Ошибка отправки";
  }

  async function uploadToPs(file) {
    const mb = file.size / (1024 * 1024);
    if (mb > MAX_MB) throw new Error(`Файл слишком большой. Максимум ${MAX_MB}MB`);

    const fd = new FormData();
    fd.append("file", file, file.name);

    const res = await fetch(PS_UPLOAD_URL, { method: "POST", body: fd });
    const text = await res.text();

    try {
      const json = JSON.parse(text);
      const url = json.url || json.file_url || json.download_url;
      if (!res.ok || !url) throw new Error(json.error || "Upload failed");
      return { url, json };
    } catch (_) {
      const maybeUrl = (text || "").trim();
      if (!res.ok) throw new Error("Upload failed");
      if (/^https?:\/\/|^\//.test(maybeUrl)) return { url: maybeUrl, json: null };
      throw new Error("Сервер загрузки не вернул ссылку");
    }
  }

  async function sendToWeb3Forms() {
    const fd = new FormData(form);
    syncHidden();

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json || json.success !== true) {
      throw new Error((json && (json.message || json.error)) || "Web3Forms error");
    }
    return json;
  }

  function showFinalSuccess() {
    // 1) скрываем заголовок + форму (CSS по классу #contact.is-success)
    contact.classList.add("is-success");

    // 2) показываем премиальный успех
    if (successTextEl) successTextEl.textContent = "Приступаем к проекту";
    successWrap.hidden = false;

    // 3) приятное появление (класс для transition)
    requestAnimationFrame(() => {
      successWrap.classList.add("is-on");
    });
  }

  async function submitFlow() {
    setBusy(true);
    status.textContent = "Отправляем…";

    if (hDocUrl) hDocUrl.value = "";
    if (hDocName) hDocName.value = "";
    if (hDocSize) hDocSize.value = "";
    if (hDocType) hDocType.value = "";

    try {
      const hasFile = fileInput.files && fileInput.files[0];
      if (hasFile && !noDocs.checked) {
        status.textContent = "Загружаем документы…";
        const file = fileInput.files[0];

        const { url } = await uploadToPs(file);

        if (hDocUrl) hDocUrl.value = url;
        if (hDocName) hDocName.value = file.name;
        if (hDocSize) hDocSize.value = String(file.size);
        if (hDocType) hDocType.value = file.type || "";

        syncHidden();
      } else {
        syncHidden();
      }

      status.textContent = "Отправляем заявку…";

      // микро-пауза, чтобы busy-пульс был “виден” и не рвало UX
      await new Promise(r => setTimeout(r, 520));

      await sendToWeb3Forms();

      status.textContent = "";
      setBusy(false);
      showFinalSuccess();
    } catch (err) {
      setBusy(false);
      showError(err && err.message ? err.message : "Ошибка отправки");
    }
  }

  cta.addEventListener("click", () => {
    if (busy) return;
    if (!isValidStep()) return;

    if (current < 3) {
      if (current === 0) data.name = textInput.value;
      if (current === 1) data.email = textInput.value;
      current += 1;
      setStepsUI();
      return;
    }

    submitFlow();
  });

  // init
  successWrap.hidden = true;
  successWrap.classList.remove("is-on");

  ccMenu.hidden = true;
  if (ccSearch) ccSearch.value = "";

  renderCcList("");
  setCountry("RU");
  setStepsUI();
})();



/* =========================================================
Boot
========================================================= */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBesson);
} else {
  
  
  
  initBesson();
}
const card = document.getElementById("msfCard");
form.classList.remove("is-success", "is-successing");
if (card) card.classList.remove("is-success", "is-successing");
success.hidden = true;
