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
    { name: 'Алматы',  lat: 31.0, lon: 20.0 },
    { name: 'Москва',  lat: 60.0, lon: -5.0 },
    { name: 'Ташкент', lat: 25.0, lon: -10.0 }
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
Boot
========================================================= */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBesson);
} else {
  initBesson();
}
