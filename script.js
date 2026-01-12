


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


/* =========================
   OFFICES: MapLibre map + premium interactions + auto-tour (no Leaflet)
========================= */
(function () {
  const OFFICES = {
    kz: {
      city: "Алматы",
      label: "Казахстан · Мынбаева 53",
      phoneDigits: "77058880678",
      lat: 43.237583,
      lng: 76.902445,
      zoom: 16,
    },
    uz: {
      city: "Ташкент",
      label: "Узбекистан · Шахрисабзская 8/1",
      phoneDigits: "998909988817",
      lat: 41.297142,
      lng: 69.271274,
      zoom: 16,
    },
    ru: {
      city: "Москва",
      label: "Россия · Переведеновский пер., 13 стр. 18",
      phoneDigits: "79850178817",
      lat: 55.7809559,
      lng: 37.6893926,
      zoom: 16,
    },
  };

  // CARTO Dark Matter GL Style (с улицами/подписями)
  const STYLE_URL = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

  // Настройки “постоянной анимации”
  const TOUR_INTERVAL_MS = 8000;      // шаг тура
  const PAUSE_AFTER_INTERACT_MS = 20000; // пауза после действий пользователя

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error("JS failed: " + src));
      document.head.appendChild(s);
    });
  }

  function loadCss(href) {
    return new Promise((resolve, reject) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.onload = resolve;
      l.onerror = () => reject(new Error("CSS failed: " + href));
      document.head.appendChild(l);
    });
  }

  async function loadMapLibre() {
    if (window.maplibregl) return;

    const css1 = "https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.css";
    const js1  = "https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js";

    const css2 = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";
    const js2  = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js";

    try {
      await loadCss(css1);
      await loadScript(js1);
    } catch (e1) {
      await loadCss(css2).catch(() => {});
      await loadScript(js2);
    }
  }

  function makePinEl(active) {
    const el = document.createElement("div");
    el.className = active ? "offices-pin is-active" : "offices-pin";
    return el;
  }

  function killBlur(mapWrap, mapEl) {
    if (mapWrap) {
      mapWrap.style.filter = "none";
      mapWrap.style.backdropFilter = "none";
      mapWrap.style.webkitBackdropFilter = "none";
    }
    if (mapEl) {
      mapEl.style.filter = "none";
      mapEl.style.backdropFilter = "none";
      mapEl.style.webkitBackdropFilter = "none";
    }
    const overlays = [];
    if (mapWrap) {
      overlays.push(
        ...mapWrap.querySelectorAll(
          ".offices__blur, .offices__veil, .offices__glass, .offices__overlay, .map-blur, .map-veil"
        )
      );
    }
    overlays.forEach((n) => n.remove());
  }

  onReady(async function () {
    const section = document.getElementById("offices");
    if (!section) return;

    const mapWrap = document.getElementById("officesMapWrap");
    const mapEl = document.getElementById("officesMap");
    const hintCity = document.getElementById("officesHintCity");
    const hintAddr = document.getElementById("officesHintAddr");

    if (!mapWrap || !mapEl) return;

    // контейнер открыт
    mapWrap.classList.add("is-open");
    killBlur(mapWrap, mapEl);

    try {
      await loadMapLibre();
    } catch (e) {
      console.warn(e);
      return;
    }

    // защита от повторной инициализации
    mapEl.innerHTML = "";

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const keys = Object.keys(OFFICES);
    let activeKey = "kz";

    // Автотур: таймеры + состояния
    let inView = true;
    let tourTimer = null;
    let resumeTimer = null;
    let tourIndex = Math.max(0, keys.indexOf(activeKey));
    let userPaused = false;

    const map = new maplibregl.Map({
      container: mapEl,
      style: STYLE_URL,
      center: [OFFICES[activeKey].lng, OFFICES[activeKey].lat],
      zoom: OFFICES[activeKey].zoom || 15,
      attributionControl: false,
      interactive: true,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      cooperativeGestures: true,
    });

    // Атрибуция без “иконок/флагов”
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "© OpenStreetMap © CARTO",
      })
    );

    // Зум вверх-вправо — не пересекаемся с капсулой “связаться”
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const markers = {};
    keys.forEach((key) => {
      const o = OFFICES[key];
      const el = makePinEl(false);
      markers[key] = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([o.lng, o.lat])
        .addTo(map);
    });

    function setPinActive(key) {
      keys.forEach((k) => {
        const m = markers[k];
        const el = m && m.getElement ? m.getElement() : null;
        if (!el) return;
        el.classList.toggle("is-active", k === key);
      });
    }

    function bumpHint() {
      section.classList.remove("is-hint-swap");
      // принудительный reflow, чтобы анимация всегда стартовала
      void section.offsetWidth;
      section.classList.add("is-hint-swap");
      clearTimeout(bumpHint._t);
      bumpHint._t = setTimeout(() => section.classList.remove("is-hint-swap"), 450);
    }

    function setActive(key, animate = true, fromTour = false) {
      const o = OFFICES[key];
      if (!o) return;

      activeKey = key;
      tourIndex = Math.max(0, keys.indexOf(key));

      section.querySelectorAll(".office").forEach((el) => {
        el.classList.toggle("is-active", el.dataset.office === key);
      });

      if (hintCity) hintCity.textContent = o.city;
      if (hintAddr) hintAddr.textContent = o.label;

      setPinActive(key);
      bumpHint();

      const center = [o.lng, o.lat];
      const zoom = o.zoom || 15;

      if (!animate || reduceMotion) {
        map.jumpTo({ center, zoom });
      } else {
        map.flyTo({
          center,
          zoom,
          duration: fromTour ? 1100 : 900,
          essential: true,
        });
      }

      killBlur(mapWrap, mapEl);
      const c = map.getCanvas && map.getCanvas();
      if (c) c.style.filter = "none";

      requestAnimationFrame(() => map.resize());
      setTimeout(() => map.resize(), 350);
    }

    function stopTour() {
      if (tourTimer) {
        clearInterval(tourTimer);
        tourTimer = null;
      }
    }

    function startTour() {
      if (reduceMotion) return;
      if (!inView) return;
      if (document.hidden) return;
      if (userPaused) return;
      if (tourTimer) return;

      tourTimer = setInterval(() => {
        const nextIndex = (tourIndex + 1) % keys.length;
        const nextKey = keys[nextIndex];
        setActive(nextKey, true, true);
      }, TOUR_INTERVAL_MS);
    }

    function pauseTour(ms = PAUSE_AFTER_INTERACT_MS) {
      userPaused = true;
      stopTour();
      if (resumeTimer) clearTimeout(resumeTimer);

      resumeTimer = setTimeout(() => {
        userPaused = false;
        startTour();
      }, ms);
    }

    // клик по карточке — ручной выбор, тур ставим на паузу
    section.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) return;

      const card = e.target.closest(".office");
      if (!card) return;

      mapWrap.classList.add("is-open");
      pauseTour();
      setActive(card.dataset.office, true, false);
    });

    // любые взаимодействия с картой = пауза тура
    const pauseEvents = [
      "dragstart",
      "zoomstart",
      "rotatestart",
      "pitchstart",
      "movestart",
    ];
    pauseEvents.forEach((evt) => map.on(evt, () => pauseTour()));

    // на тач/колесо — тоже пауза
    mapEl.addEventListener("touchstart", () => pauseTour(), { passive: true });
    mapEl.addEventListener("wheel", () => pauseTour(), { passive: true });

    // только когда блок реально виден
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          const ent = entries[0];
          inView = !!(ent && ent.isIntersecting && ent.intersectionRatio > 0.2);
          if (!inView) stopTour();
          else startTour();
        },
        { threshold: [0, 0.2, 0.6, 1] }
      );
      io.observe(section);
    }

    // вкладка/страница скрыта — останавливаем
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopTour();
      else startTour();
    });

    // init
    map.once("load", () => {
      map.resize();
      setActive("kz", false, false);
      // лёгкая пауза перед стартом — выглядит как “вдумчиво”
      setTimeout(() => startTour(), 1200);
    });

    setTimeout(() => map.resize(), 600);
    
    
  });
})();

/* =========================
   OFFICES: section animation only (NO map overlays, NO map logic changes)
   paste at end of script.js (after map code)
========================= */
(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(function () {
    const section = document.getElementById("offices");
    if (!section) return;

    // включаем анимационный режим (CSS завязан на это)
    section.classList.add("is-anim");

    // если старый патч уже внедрил оверлей — удаляем из DOM
    const oldNet = section.querySelector(".offices-net");
    if (oldNet) oldNet.remove();

    // индексы для stagger-анимации карточек офисов
    const cards = Array.from(section.querySelectorAll(".office"));
    cards.forEach((el, i) => el.style.setProperty("--i", String(i)));

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      section.classList.add("is-inview");
      section.classList.remove("is-out");
      return;
    }

    // reveal/out (в обе стороны)
    let inView = false;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const now = !!(e && e.isIntersecting && e.intersectionRatio > 0.22);

        if (now && !inView) {
          inView = true;
          section.classList.add("is-inview");
          section.classList.remove("is-out");
        } else if (!now && inView) {
          inView = false;
          section.classList.remove("is-inview");
          section.classList.add("is-out");
        }
      },
      { threshold: [0, 0.22, 0.6], rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(section);

    // очень мягкий параллакс (не трогаем карту, только CSS-переменную секции)
    let raf = 0;
    function updateParallax() {
      raf = 0;
      const r = section.getBoundingClientRect();
      const vh = Math.max(
        1,
        window.innerHeight || document.documentElement.clientHeight
      );
      const center = r.top + r.height * 0.5;
      const p = (vh * 0.5 - center) / (vh * 0.5);
      const clamped = Math.max(-1, Math.min(1, p));
      section.style.setProperty("--off-p", clamped.toFixed(3));
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(updateParallax);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateParallax();
  });
})();

/* =========================
   Fix: mobile opens not from top (scroll restore / #team / bfcache)
========================= */
(function () {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile) return;

  // запретить браузеру "восстанавливать" скролл
  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  } catch (_) {}

  const startedAt = performance.now();
  let fixed = false;

  const stripTeamHash = () => {
    if (location.hash === "#team" || location.hash === "#teamRail") {
      history.replaceState(null, document.title, location.pathname + location.search);
    }
  };

  const forceTop = () => {
    stripTeamHash();

    // если пользователь реально открыл ссылку с якорем (#about и т.п.) — не мешаем
    if (location.hash) return;

    const top = () => window.scrollTo(0, 0);
    top();
    requestAnimationFrame(top);
    setTimeout(top, 60);
    setTimeout(top, 250);
  };

  // ранняя попытка
  forceTop();

  // если мобилка всё равно "подкинет" вниз через restore/layout — ловим в первые ~1.2с
  const watch = () => {
    if (fixed) return;
    if (performance.now() - startedAt > 1200) return;

    // считаем улётом только реально большой прыжок (чтобы не мешать юзерскому скроллу)
    const bigJump = (window.scrollY || 0) > (window.innerHeight * 0.6);
    if (!location.hash && bigJump) {
      fixed = true;
      forceTop();
      return;
    }
    requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);

  // iOS часто восстанавливает позицию через pageshow (bfcache)
  window.addEventListener("pageshow", forceTop);
  window.addEventListener("load", forceTop, { once: true });
})();


/* =========================
   OFFICES mobile behavior:
   - map hidden by default
   - open map on office tap
   - close map when scrolled above section
   paste at end of script.js
========================= */
(function () {
  const mql = window.matchMedia("(max-width: 900px)");

  function initMobileOfficesMapUX() {
    if (!mql.matches) return;

    const section = document.getElementById("offices");
    const mapWrap = document.getElementById("officesMapWrap");
    if (!section || !mapWrap) return;

    // старт: карта скрыта
    mapWrap.classList.remove("is-open");

    // вычисляем верх секции (для автозакрытия при уходе выше)
    let sectionTop = 0;
    const recalcTop = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
    };
    recalcTop();
    window.addEventListener("resize", recalcTop, { passive: true });

    // открываем карту по клику на карточку офиса
    section.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) return; // не мешаем tel/tg ссылкам

      const card = e.target.closest(".office");
      if (!card) return;

      mapWrap.classList.add("is-open");

      // даём Leaflet шанс пересчитать размеры (не ломая твой flyTo)
      requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
      setTimeout(() => window.dispatchEvent(new Event("resize")), 350);
    });

    // закрываем карту, если пользователь прокрутил страницу выше секции офисов
    window.addEventListener(
      "scroll",
      () => {
        // "выше" = верх страницы + небольшой зазор меньше верхней точки секции
        if (window.scrollY + 20 < sectionTop) {
          if (mapWrap.classList.contains("is-open")) {
            mapWrap.classList.remove("is-open");
          }
        }
      },
      { passive: true }
    );
  }

  // старт
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileOfficesMapUX, { once: true });
  } else {
    initMobileOfficesMapUX();
  }

  // если меняется ширина (поворот/ресайз)
  if (mql.addEventListener) {
    mql.addEventListener("change", () => {
      // при уходе в мобилку/возврате — просто переинициализируем логику
      // (без вмешательства в саму карту)
      initMobileOfficesMapUX();
    });
  }
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

/* ===== LeadForm: optional NDA/TZ upload -> PS.KZ -> Web3Forms ===== */
(() => {
  const form = document.getElementById('leadForm');
  if (!form) return;

  const fileInput = document.getElementById('leadFile');
  const fileText  = document.getElementById('leadFileText');
  const upStatus  = document.getElementById('leadUploadStatus');

  const docIdField   = document.getElementById('docIdField');
  const docNameField = document.getElementById('docNameField');
  const docSizeField = document.getElementById('docSizeField');
  const docErrorField= document.getElementById('docErrorField');

  const MAX_MB = 50;
  const MAX_BYTES = MAX_MB * 1024 * 1024;
  const allowedExt = new Set(['pdf','doc','docx','ppt','pptx','xls','xlsx','zip']);

  let allowSubmitWithoutFile = false;
  let isProgrammaticSubmit = false;

  const setStatus = (t) => { if (upStatus) upStatus.textContent = t || ''; };

  const humanSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
  };

  const resetDocFields = () => {
    if (docIdField) docIdField.value = '';
    if (docNameField) docNameField.value = '';
    if (docSizeField) docSizeField.value = '';
    if (docErrorField) docErrorField.value = '';
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
      allowSubmitWithoutFile = false;

      const file = fileInput.files?.[0];
      if (!file) {
        fileText.textContent = 'Файл не выбран';
        setStatus('');
        return;
      }

      const err = validateFile(file);
      if (err) {
        fileInput.value = '';
        fileText.textContent = 'Файл не выбран';
        setStatus(err);
        return;
      }

      fileText.textContent = `${file.name} — ${humanSize(file.size)}`;
      setStatus('Документ будет отправлен вместе с заявкой.');
    });
  }

  form.addEventListener('submit', async (e) => {
    if (isProgrammaticSubmit) return;

    const name  = form.querySelector('#name')?.value?.trim() || '';
    const phone = form.querySelector('#phone')?.value?.trim() || '';
    const email = form.querySelector('#email')?.value?.trim() || '';

    // Если контактные поля пустые — не загружаем файл зря
    if (!name || !phone || !email) {
      e.preventDefault();
      setStatus('Заполните имя, телефон и почту.');
      return;
    }

    const file = fileInput?.files?.[0];

    // Без файла — отправляем как обычно (Web3Forms)
    if (!file) {
      resetDocFields();
      return;
    }

    // Если ранее загрузка упала — второй клик отправляет без вложения
    if (allowSubmitWithoutFile) {
      e.preventDefault();
      resetDocFields();
      if (docErrorField) docErrorField.value = 'UPLOAD_FAILED_USER_SENT_WITHOUT_FILE';
      setStatus('Отправили запрос без вложения.');
      isProgrammaticSubmit = true;
      form.submit();
      return;
    }

    // Пытаемся загрузить файл, затем отправляем лид
    e.preventDefault();

    const err = validateFile(file);
    if (err) {
      setStatus(err);
      return;
    }

    setStatus('Загружаем документ…');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('lead_name', name);
      fd.append('lead_phone', phone);
      fd.append('lead_email', email);

      const res = await fetch('/api/upload-doc.php', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setStatus((data?.error || 'Не удалось загрузить документ.') + ' Нажмите "Отправить" ещё раз — уйдёт без вложения.');
        if (docErrorField) docErrorField.value = data?.code || 'UPLOAD_FAILED';
        allowSubmitWithoutFile = true;
        return;
      }

      if (docIdField) docIdField.value = data.doc_id || '';
      if (docNameField) docNameField.value = data.doc_name || file.name;
      if (docSizeField) docSizeField.value = String(data.doc_size || file.size);

      setStatus('Документ прикреплён. Отправляем заявку…');

      isProgrammaticSubmit = true;
      form.submit();

    } catch {
      setStatus('Сервер недоступен. Нажмите "Отправить" ещё раз — уйдёт без вложения.');
      if (docErrorField) docErrorField.value = 'UPLOAD_EXCEPTION';
      allowSubmitWithoutFile = true;
    }
  });
})();


/* =========================================================
Boot
========================================================= */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBesson);
} else {
  
  
  
  initBesson();
}
