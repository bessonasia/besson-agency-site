/* =========================================================
Reset & base
========================================================= */
*{box-sizing:border-box;margin:0}
html,body{height:100%;scroll-behavior:smooth}
html{
  -webkit-text-size-adjust:100%;
  text-size-adjust:100%;
  -webkit-tap-highlight-color:transparent;
}
:root{
  --bg:#0a0a0a;
  --fg:#f5f5f5;
  --muted:#bdbdbd;
  --pad:clamp(16px,2.4vw,32px);
  --grid:max(68rem,74vw);
}
body{
  font-family:'Inter','Helvetica Neue','Segoe UI','Roboto',system-ui,sans-serif;
  background:var(--bg);
  color:var(--fg);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}
a{color:inherit;text-decoration:none}

/* =========================================================
Nav + burger
========================================================= */
.nav{
  position:fixed;
  inset:0 0 auto 0;
  height:76px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 var(--pad);
  z-index:1000;
  background:transparent;
  color:#f5f5f5;
  transition:
    transform .32s cubic-bezier(.19,1,.22,1),
    color .25s ease;
}
.nav--hidden{transform:translateY(-110%);}
.brand__mark{
  font-weight:800;
  letter-spacing:.18em;
  text-transform:uppercase;
  font-size:.92rem;
  transition:transform .25s,text-shadow .25s,opacity .25s;
}
.brand__mark:hover{text-shadow:0 0 8px rgba(255,255,255,.4);}

/* Десктопное меню */
.nav__group{display:flex;align-items:center;gap:20px;}
.link{
  position:relative;
  text-transform:uppercase;
  font-size:.8rem;
  letter-spacing:.18em;
  font-weight:500;
}
.link::after{
  content:"";
  position:absolute;
  left:0;right:0;
  bottom:-6px;
  height:1px;
  background:currentColor;
  opacity:.2;
  transform:scaleX(0);
  transform-origin:left;
  transition:transform .35s,opacity .35s;
}
.link:hover::after{transform:scaleX(1);opacity:.5;}

/* Бургер */
.burger{
  display:none;
  background:none;
  border:0;
  padding:0;
  width:32px;
  height:32px;
  flex-shrink:0;
  color:#e5e5e5;
  flex-direction:column;
  justify-content:center;
  gap:7px;
  cursor:pointer;
  transition:color .2s ease,transform .2s ease;
}
.burger__line{
  height:2px;
  border-radius:999px;
  background:currentColor;
  width:100%;
  transition:transform .25s ease,opacity .18s ease,background-color .2s ease;
}
.burger--active .burger__line:nth-child(1){transform:translateY(4px) rotate(45deg);}
.burger--active .burger__line:nth-child(2){transform:translateY(-4px) rotate(-45deg);}

/* Цвет шапки на светлом фоне */
.nav.nav--on-light{color:#111;}
.nav.nav--on-light .burger{color:#111;}

/* Мобильное меню */
.mobile-menu{
  position:fixed;
  top:0;right:0;bottom:0;
  width:min(80vw,320px);
  background:#000;
  color:#fff;
  padding:76px 28px 32px;
  transform:translateX(100%);
  opacity:0;
  pointer-events:none;
  transition:transform .28s ease,opacity .28s ease;
  z-index:999;
}
.mobile-menu ul{list-style:none;padding:0;margin:0;}
.mobile-menu li{margin:14px 0;}
.mobile-menu a{
  font-size:.92rem;
  letter-spacing:.18em;
  text-transform:uppercase;
  font-weight:400;
}
.mobile-menu--open{
  transform:translateX(0);
  opacity:1;
  pointer-events:auto;
}
@media (min-width:769px){
  .mobile-menu{display:none !important;}
}

/* =========================================================
Hero
========================================================= */
.hero{
  min-height:100vh;
  display:grid;
  place-items:center;
  position:relative;
  overflow:hidden;
}
.hero__content{text-align:center;padding:120px var(--pad) 80px;}
.hero__name{
  font-size:clamp(2rem,6vw,4rem);
  font-weight:800;
  letter-spacing:.22em;
  text-transform:uppercase;
  margin-bottom:16px;
}
#logoText span{display:inline-block;transition:transform .22s ease-out,text-shadow .3s ease-out;}
#logoText span[data-space="true"]{pointer-events:none;}

.hero__slogan{
  margin-top:24px;
  font-size:clamp(1.1rem,2.4vw,1.6rem);
  letter-spacing:.22em;
  text-transform:uppercase;
  opacity:0;
  transform:translateY(8px) scale(.98);
  animation:heroSloganIntro 1.2s ease forwards .4s;
  display:flex;
  justify-content:center;
  flex-wrap:wrap;
  gap:.6em;
  cursor:default;
}
.hero__slogan span{
  display:inline-block;
  transition:color .4s,text-shadow .4s;
  animation:subtleGlow 6s ease-in-out infinite alternate;
}
.hero__slogan span:hover{
  color:#fff;
  text-shadow:0 0 10px rgba(255,255,255,.45),
             0 0 20px rgba(255,255,255,.25),
             0 0 30px rgba(255,255,255,.15);
}

/* Индикатор скролла */
.hero__scroll{
  position:absolute;
  left:50%;
  bottom:40px;
  transform:translateX(-50%);
  opacity:0;
  animation:indicatorFadeIn 1.2s ease forwards .9s;
  pointer-events:none;
}
.scroll-indicator__mouse{
  width:22px;
  height:36px;
  border-radius:14px;
  border:1.5px solid rgba(255,255,255,.7);
  display:flex;
  align-items:flex-start;
  justify-content:center;
  padding-top:7px;
  box-shadow:0 0 10px rgba(0,0,0,.6);
}
.scroll-indicator__wheel{
  width:3px;
  height:7px;
  border-radius:999px;
  background:rgba(255,255,255,.9);
  animation:scrollWheel 1.5s ease-in-out infinite;
}

/* Белая панель */
.hero__reveal{
  position:absolute;
  left:0;bottom:0;
  width:100%;
  height:40vh;
  background:#ffffff;
  transform:translateY(40vh);
  pointer-events:none;
}

/* Animations */
@keyframes heroSloganIntro{to{opacity:1;transform:translateY(0) scale(1);}}
@keyframes subtleGlow{
  0%,100%{text-shadow:none}
  50%{text-shadow:0 0 6px rgba(255,255,255,.15)}
}
@keyframes indicatorFadeIn{to{opacity:1;}}
@keyframes scrollWheel{
  0%{transform:translateY(0);opacity:1;}
  60%{transform:translateY(8px);opacity:0.2;}
  100%{transform:translateY(0);opacity:0;}
}

/* =========================================================
Interlude
========================================================= */
.interlude{
  background:#fff;
  color:#0a0a0a;
  text-align:center;
  padding:140px var(--pad) 80px;
}
.hero__title{
  font-size:clamp(3rem,9.6vw,7rem);
  line-height:.9;
  font-weight:800;
  letter-spacing:-.02em;
}

/* =========================================================
About
========================================================= */
.stage{
  background:#fff;
  color:#0a0a0a;
  padding:160px var(--pad);
  text-align:center;
}

.stage#about{
  background:#fff;
  color:#0a0a0a;

  /* ✅ сокращаем нижний "белый прямоугольник" */
  padding:20px var(--pad) 170px;

  text-align:center;
  scroll-margin-top:32vh;

  position:relative;
  z-index:1; /* ✅ больше не перекрывает купол целиком */
}

.stage__title{
  max-width:52rem;
  margin:0 auto;
  font-family:
    "SF Pro Text",
    "Inter",
    "Helvetica Neue",
    "Segoe UI",
    system-ui,
    sans-serif;
  font-weight:301;
  font-size:clamp(1.02rem,1.5vw,1.26rem);
  line-height:1.8;
  letter-spacing:.01em;

  position:relative;
  z-index:4; /* ✅ текст над куполом */
}

/* =========================================================
Globe Dome between ABOUT and WORK
========================================================= */
.globe-bridge{
  position:relative;
  background:#fff;
  padding:0;
  height:clamp(220px,50vh,620px);
  overflow:visible;
  z-index:2;
}

.globe-dome{
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  width:100vw;
  height:clamp(680px,118vh,1250px);

  /* ✅ по умолчанию выше (достаём сферу вверх) */
  bottom:var(--domeBottom, -12vh);

  background:transparent; /* ✅ больше нет белой плашки */
  pointer-events:none;

  z-index:2; /* ✅ купол выше фона about, но ниже текста */
}

#globeCanvas{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  display:block;
}

.globe-label{
  position:absolute;
  opacity:0;
  padding:10px 14px;
  border-radius:999px;
  background:rgba(0,0,0,.88);
  color:#fff;
  font-size:.78rem;
  letter-spacing:.14em;
  text-transform:uppercase;
  white-space:nowrap;
  pointer-events:none;
  transform:translate(-50%,-140%);
  transition:opacity .2s ease, transform .2s ease;
  z-index:3;
}
.globe-label--visible{opacity:1;transform:translate(-50%,-165%);}
.globe-label--flash{animation:globeFlash .28s ease-out;}
@keyframes globeFlash{
  0%{ transform:translate(-50%,-150%) scale(.96); }
  100%{ transform:translate(-50%,-165%) scale(1); }
}

/* mobile */
@media (max-width:768px){
  .globe-bridge{height:clamp(180px,30vh,340px);}
  .globe-dome{
    height:clamp(440px,86vh,820px);
    bottom:var(--domeBottom, -18vh); /* ✅ мобила поднята */
  }
}

/* desktop */
@media (min-width:769px){
  .globe-bridge{
    height:clamp(470px,70vh,750px);
  }
  .globe-dome{
    height:1100px;
  }
}

/* Проекты выше купола */
#work{position:relative;z-index:5;}

/* =========================================================
Work — reveal animation (SAFE)
Анимация включается только при .js на <html>
========================================================= */

/* База: если JS не работает — проекты ВСЕГДА видны */
.tile{
  opacity:1;
  transform:none;
  filter:none;
}

/* Когда JS включён — стартовое скрытие */
.js .tile{
  opacity:0;
  transform:translate3d(0,18px,0) scale(.985);
  filter:blur(8px);
  will-change:transform, opacity, filter;
  transition:
    opacity .62s cubic-bezier(.19,1,.22,1),
    transform .82s cubic-bezier(.19,1,.22,1),
    filter .82s cubic-bezier(.19,1,.22,1);
  transition-delay:var(--reveal-delay, 0ms);
}

/* "Шторка" включается тоже только при JS */
.js .tile::before{
  content:"";
  position:absolute;
  inset:0;
  pointer-events:none;
  background:linear-gradient(180deg, #050505 0%, #000 100%);
  transform:translate3d(0,0,0);
  will-change:transform;
  transition:transform .92s cubic-bezier(.19,1,.22,1);
  transition-delay:calc(var(--reveal-delay, 0ms) + 60ms);
  z-index:2;
}

/* В кадре */
.js .tile.is-in{
  opacity:1;
  transform:translate3d(0,0,0) scale(1);
  filter:blur(0px);
}

/* Шторка уезжает */
.js .tile.is-in::before{
  transform:translate3d(0,-101%,0);
}

/* caption поверх */
.tile__caption{ z-index:3; }

/* Мобилка: меньше blur */
@media (max-width:768px){
  .js .tile{
    transform:translate3d(0,14px,0) scale(.99);
    filter:blur(5px);
    transition-duration:.56s, .74s, .74s;
  }
  .js .tile::before{ transition-duration:.82s; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  .js .tile,
  .js .tile::before{
    transition:none !important;
    transform:none !important;
    filter:none !important;
  }
  .js .tile{ opacity:1 !important; }
  .js .tile::before{ display:none !important; }
}


/* =========================================================
Work
========================================================= */
#work{background:#050505;padding:0;}
.wall{
  width:100%;
  margin:0 auto;
  display:grid;
  grid-template-columns:repeat(12,1fr);
}
.tile{grid-column:span 4;position:relative;overflow:hidden;}
@media (max-width:1100px){.tile{grid-column:span 6;}}
@media (max-width:680px){.tile{grid-column:1/-1;}}
.tile img{
  width:100%;
  height:auto;
  display:block;
  background:#111;
  transition:transform .7s ease;
  aspect-ratio:16/9;
  object-fit:cover;
  min-height:clamp(320px, 28vw, 460px);
}
.tile:hover img{transform:scale(1.06);}
.tile__caption{
  position:absolute;
  inset:0;
  display:grid;
  place-items:center;
  opacity:0;
  transition:opacity .35s,backdrop-filter .35s;
  background:rgba(0,0,0,.45);
  color:#fff;
  text-align:center;
  padding:12px;
}
.tile:hover .tile__caption{opacity:1;backdrop-filter:blur(2px);}




/* =========================================================
Clients
========================================================= */
.clients{
  background:#050505;
  color:#f5f5f5;
  padding:80px var(--pad) 90px;
}
.clients__inner{max-width:var(--grid);margin:0 auto;text-align:center;}
.clients__headline{
  font-size:clamp(1.4rem,3vw,2.1rem);
  font-weight:600;
  letter-spacing:.06em;
  text-transform:uppercase;
  max-width:40rem;
  line-height:1.3;
  margin:0 auto 40px;
}
.clients__grid{
  display:grid;
  grid-template-columns:repeat(6,minmax(0,1fr));
  gap:32px 48px;
  align-items:center;
  justify-items:center;
}
.clients__item{
  font-size:.9rem;
  text-transform:uppercase;
  letter-spacing:.18em;
  font-weight:500;
  white-space:nowrap;
  opacity:.9;
  transition:opacity .25s ease,transform .25s ease;
}
.clients__item:hover{opacity:1;transform:translateY(-2px);}
@media (max-width:1024px){
  .clients__grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:24px 32px;}
}
@media (max-width:680px){
  .clients{padding:60px 18px 70px;}
  .clients__grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 18px;}
  .clients__item{font-size:.75rem;letter-spacing:.16em;}
}

/* =========================================================
Clients — reveal animation (repeatable, premium)
Включается только при .js на <html>
========================================================= */

/* База: если JS не работает — всё видно */
.clients__item{
  opacity: .9;
  transform: none;
  filter: none;
}

/* Стартовая поза (только когда JS включён) */
.js .clients__item{
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  filter: blur(6px);
  will-change: transform, opacity, filter;
  transition:
    opacity .55s cubic-bezier(.19,1,.22,1),
    transform .72s cubic-bezier(.19,1,.22,1),
    filter .72s cubic-bezier(.19,1,.22,1);
  transition-delay: var(--c-delay, 0ms);
}

/* Тонкая “статусная” линия — появляется слева направо */
.js .clients__item::after{
  content:"";
  display:block;
  height:1px;
  width:100%;
  margin-top:10px;
  background: currentColor;
  opacity: .22;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .75s cubic-bezier(.19,1,.22,1);
  transition-delay: calc(var(--c-delay, 0ms) + 90ms);
}

/* Когда секция в кадре — показываем элементы */
.js .clients.is-in .clients__item{
  opacity: .92;
  transform: translate3d(0,0,0);
  filter: blur(0px);
}

/* Линия раскрывается */
.js .clients.is-in .clients__item::after{
  transform: scaleX(1);
}

/* Мобилка: блюр меньше, чтобы было легче */
@media (max-width: 768px){
  .js .clients__item{
    filter: blur(4px);
    transform: translate3d(0, 10px, 0);
    transition-duration: .5s, .64s, .64s;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
/* =========================================================
Clients — reveal animation (smooth, NO lines)
Включается только при .js на <html>
========================================================= */

/* База: если JS не работает — всё видно */
.clients__item{
  opacity:.9;
  transform:none;
  filter:none;
}

/* Стартовая поза (только когда JS включён) */
.js .clients__item{
  opacity:0;
  transform:translate3d(0,10px,0) scale(.995);
  filter:blur(4px);

  will-change:transform, opacity, filter;

  transition:
    opacity .85s cubic-bezier(.16,1,.3,1),
    transform 1.05s cubic-bezier(.16,1,.3,1),
    filter 1.05s cubic-bezier(.16,1,.3,1);

  transition-delay:var(--c-delay, 0ms);
}

/* Когда секция в кадре — показываем элементы */
.js .clients.is-in .clients__item{
  opacity:.92;
  transform:translate3d(0,0,0) scale(1);
  filter:blur(0px);
}

/* Мобилка — чуть легче */
@media (max-width: 768px){
  .js .clients__item{
    transform:translate3d(0,8px,0) scale(.996);
    filter:blur(3px);
    transition-duration:.78s, .96s, .96s;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  .js .clients__item{
    transition:none !important;
    transform:none !important;
    filter:none !important;
    opacity:.92 !important;
  }
}

}


/* =========================================================
Contact
========================================================= */
.contact{padding:120px var(--pad);text-align:center;}
.contact__grid{
  max-width:var(--grid);
  margin:0 auto;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:28px;
}
.contact__lead{
  font-weight:800;
  letter-spacing:.06em;
  text-transform:uppercase;
  font-size:clamp(1.4rem,3.6vw,2.2rem);
}
.contact__sub{color:var(--muted);margin-top:10px;max-width:52ch;}

/* Форма */
.form{
  background:linear-gradient(180deg,#0e0e0e,#0a0a0a);
  border:1px solid rgba(255,255,255,.08);
  border-radius:18px;
  padding:32px;
  box-shadow:0 10px 30px rgba(0,0,0,.35);
  max-width:460px;
  width:100%;
}
.row{display:block;}
.field{position:relative;margin-bottom:18px;}
.input{
  width:100%;
  padding:18px 16px 14px;
  border-radius:14px;
  border:1px solid #1b1b1b;
  background:#0f0f0f;
  color:#fff;
  font-size:.96rem;
  outline:none;
  -webkit-appearance:none;
  transition:border-color .25s,box-shadow .25s,background .25s,transform .18s;
}
.input::placeholder{color:transparent;}
.input:focus{
  border-color:#fff;
  box-shadow:0 0 0 2px rgba(255,255,255,.12);
  background:#111111;
  transform:translateY(-1px);
}
.label{
  position:absolute;
  left:18px;
  top:18px;
  padding:2px 6px;
  border-radius:8px;
  font-size:.82rem;
  color:#a9a9a9;
  background:rgba(255,255,255,.02);
  transform-origin:left center;
  transition:top .18s ease, transform .18s ease, opacity .18s ease, color .18s ease;
}
.field.filled .label,
.input:focus + .label{
  top:4px;
  transform:scale(.88);
  opacity:.95;
  color:#ffffff;
}
.form__status{
  min-height:20px;
  font-size:.9rem;
  color:var(--muted);
  margin-top:18px;
  transition:opacity .3s;
}
.form__status--success{color:#9be7c4;}
.form__status--error{color:#ff8a80;}
.actions{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  margin-top:24px;
  flex-wrap:wrap;
}
.btn{
  position:relative;
  padding:16px 22px;
  border-radius:999px;
  border:1px solid #fff;
  background:#fff;
  color:#000;
  font-weight:700;
  text-transform:uppercase;
  cursor:pointer;
  transition:transform .25s,box-shadow .25s;
  isolation:isolate;
}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(255,255,255,.1);}
.btn .glow{
  position:absolute;
  inset:-2px;
  border-radius:inherit;
  background:radial-gradient(280px 160px at var(--x,50%) var(--y,50%),rgba(255,255,255,.35),transparent 60%);
  opacity:0;
  transition:opacity .25s;
  filter:blur(14px);
}
.btn:hover .glow{opacity:1;}
.icon-btn{
  width:44px;height:44px;
  border:1px solid #1b1b1b;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#0f0f0f;
  color:#fff;
  transition:background .25s,border-color .25s,transform .2s;
}
.icon-btn:hover{
  background:#fff;
  color:#000;
  border-color:#fff;
  transform:translateY(-2px);
}
.icon-btn svg{width:20px;height:20px;fill:currentColor;}

/* =========================================================
Contact Pill (PREMIUM) — ONLY THIS BLOCK
========================================================= */
.contact-pill{
  --pill-x: 84px;

  position:fixed;
  right:16px;
  top:50%;
  transform:translate3d(var(--pill-x), -50%, 0);
  opacity:0;
  pointer-events:none;

  width:36px;
  height:132px;
  border-radius:999px;
  border:1px solid rgba(0,0,0,.92);

  background:linear-gradient(180deg,#151515,#000);
  color:#f5f5f5;

  display:flex;
  align-items:center;
  justify-content:center;

  z-index:1300; /* поверх сферы/куполa */
  box-shadow:
    0 10px 26px rgba(0,0,0,.28),
    0 6px 18px rgba(0,0,0,.18),
    inset 0 1px 0 rgba(255,255,255,.12);

  transition:
    transform .38s cubic-bezier(.19,1,.22,1),
    opacity .28s ease,
    background .28s ease,
    color .28s ease,
    border-color .28s ease,
    box-shadow .28s ease,
    width .38s cubic-bezier(.19,1,.22,1),
    height .38s cubic-bezier(.19,1,.22,1);
  will-change: transform, width, height;
}

.contact-pill--visible{
  --pill-x: 0px;
  opacity:1;
  pointer-events:auto;
}

.contact-pill__label{
  font-size:.74rem;
  letter-spacing:.18em;
  text-transform:uppercase;
  font-weight:500;
  line-height:1;
  user-select:none;
  white-space:nowrap;
  transform:rotate(-90deg);
  transform-origin:center;
}

/* на тёмном фоне — белая версия + подсветка */
.contact-pill--on-dark{
  background:linear-gradient(180deg,#ffffff,#e9e9e9);
  color:#111;
  border-color:rgba(255,255,255,.85);
  box-shadow:
    0 10px 26px rgba(0,0,0,.35),
    0 0 0 1px rgba(255,255,255,.7),
    0 0 28px rgba(255,255,255,.22),
    inset 0 1px 0 rgba(255,255,255,.96);
}

.contact-pill:hover{
  box-shadow:
    0 14px 34px rgba(0,0,0,.32),
    inset 0 1px 0 rgba(255,255,255,.16);
}
.contact-pill--on-dark:hover{
  box-shadow:
    0 14px 34px rgba(0,0,0,.38),
    0 0 0 1px rgba(255,255,255,.75),
    0 0 36px rgba(255,255,255,.26),
    inset 0 1px 0 rgba(255,255,255,.98);
}

/* open -> horizontal */
.contact-pill--open{
  width:236px;
  height:58px;
  justify-content:flex-start;
  padding:10px 14px;
}
.contact-pill--open .contact-pill__label{
  transform:rotate(0deg);
  font-size:.78rem;
}

/* icons inside */
.contact-pill__icons{
  position:absolute;
  top:50%;
  right:12px;
  transform:translateY(-50%) translateX(10px);
  opacity:0;
  pointer-events:none;

  display:flex;
  gap:8px;

  transition:
    opacity .22s ease,
    transform .28s cubic-bezier(.19,1,.22,1);
}
.contact-pill--open .contact-pill__icons{
  opacity:1;
  pointer-events:auto;
  transform:translateY(-50%) translateX(0);
}

/* bigger icons */
.contact-pill__icon{
  width:52px;
  height:52px;
  border-radius:999px;

  display:flex;
  align-items:center;
  justify-content:center;

  border:1px solid rgba(0,0,0,.9);
  background:#0b0b0b;
  color:#f5f5f5;

  box-shadow:
    0 10px 22px rgba(0,0,0,.22),
    inset 0 1px 0 rgba(255,255,255,.12);

  transition:
    transform .22s ease,
    background .22s ease,
    color .22s ease,
    border-color .22s ease,
    box-shadow .22s ease;
}
.contact-pill__icon svg{width:26px;height:26px;}
.contact-pill__icon:hover{transform:translateY(-2px);}

/* icons on white pill */
.contact-pill--on-dark .contact-pill__icon{
  background:#fff;
  color:#111;
  border-color:rgba(0,0,0,.12);
  box-shadow:
    0 10px 22px rgba(0,0,0,.24),
    inset 0 1px 0 rgba(255,255,255,.98);
}

/* mobile */
@media (max-width:768px){
  /* чуть меньше закрытая капсула */
  .contact-pill{
    right:12px;
    width:32px;
    height:112px;
  }

  /* ✅ открытая капсула: ширина адаптивная, чтобы текст всегда влезал
     и при этом НЕ было белых полей/горизонтального скролла */
  .contact-pill--open{
    width:min(240px, calc(100vw - 24px));
    height:56px;
  }

  /* ✅ чтобы надпись не переносилась/не обрезалась странно */
  .contact-pill__label{
    white-space:nowrap;
  }

  /* иконки НЕ трогаем (как ты просил) */
  .contact-pill__icon{
    width:48px;
    height:48px;
  }
  .contact-pill__icon svg{
    width:24px;
    height:24px;
  }
}



/* =========================================================
Footer
========================================================= */
footer{padding:48px var(--pad);color:#bdbdbd;text-align:center;}
.footer-left{font-weight:700;letter-spacing:.18em;}
.footer-contact{
  font-size:.9rem;
  display:flex;
  gap:10px;
  align-items:center;
  justify-content:center;
  margin-top:12px;
}
.footer-contact svg{width:16px;height:16px;opacity:.8;}

/* =========================================================
Premium cursor (desktop only)
========================================================= */
@media (hover:hover) and (pointer:fine){
  html,body{cursor:none !important;}
  *,
  a,
  button,
  [role="button"],
  label,
  input,
  textarea,
  select,
  summary{
    cursor:none !important;
    caret-color:transparent;
  }

  .cursor-dot,
  .cursor-ring{
    position:fixed;
    top:0;left:0;
    transform:translate(-50%,-50%);
    pointer-events:none;
    z-index:2147483647;
    transition:opacity .25s ease;
    mix-blend-mode:difference;
  }
  .cursor-dot{
    width:8px;height:8px;
    border-radius:50%;
    background:#fff;
    opacity:0;
  }
  .cursor-ring{
    width:36px;height:36px;
    border-radius:50%;
    border:1px solid rgba(255,255,255,.7);
    opacity:0;
    transition:transform .28s cubic-bezier(.16,1,.3,1),
               border-color .2s,
               opacity .2s;
  }
  .cursor-ring.cursor--hover{
    transform:translate(-50%,-50%) scale(1.4);
    border-color:#fff;
  }
}

/* Блокируем скролл при открытом мобильном меню */
body.nav-lock{overflow:hidden;}

/* =========================================================
Mobile polish
========================================================= */
@media (max-width:768px){
  .nav__group{display:none;}
  .burger{display:flex;}

  .nav.nav--menu-open .brand__mark{
    opacity:0;
    pointer-events:none;
  }
  .nav.nav--menu-open .burger{
    position:absolute;
    left:var(--pad);
    right:auto;
  }

  .stage#about{
    padding:80px 16px 120px; /* ✅ меньше прямоугольник + не мешает куполу */
    scroll-margin-top:32vh;
  }
}

/* =========================================================
Reduced motion
========================================================= */
@media (prefers-reduced-motion:reduce){
  *{animation:none !important;transition:none !important;}
}
/* =========================================================
CONTACT — Underlap from CLIENTS (Variant A) + repeatable motion
========================================================= */

/* Настройка глубины "из-за клиентов" */
:root{
  --contact-overlap: clamp(72px, 12vh, 140px);
}

/* Clients всегда сверху (чтобы Contact был "за ним") */
.clients{
  position:relative;
  z-index:6;
  /* тонкая глубина (почти невидимо, но даёт ощущение слоя) */
  box-shadow: 0 48px 110px rgba(0,0,0,.55);
}

/* Contact уходит под Clients за счёт отрицательного отступа */
.contact{
  position:relative;
  z-index:4;

  /* подныриваем под Clients */
  margin-top: calc(var(--contact-overlap) * -1);

  /* компенсируем, чтобы контент не залез под Clients */
  padding-top: calc(120px + var(--contact-overlap));

  /* якорь #contact не должен прилипать под фикс-нав */
  scroll-margin-top: 110px;
}

/* Мобилка: чуть меньше перекрытие */
@media (max-width: 768px){
  :root{ --contact-overlap: clamp(56px, 10vh, 110px); }
  .contact{ padding-top: calc(96px + var(--contact-overlap)); }
}

/* ===== Reveal (repeatable) ===== */
/* База: если JS не работает — всё видно */
.contact__lead,
.contact__sub{
  opacity:1;
  transform:none;
  filter:none;
}

/* Заголовок + подзаголовок мягко входят */
.js .contact__lead,
.js .contact__sub{
  opacity:0;
  transform: translate3d(0, 10px, 0);
  filter: blur(4px);
  will-change: transform, opacity, filter;
  transition:
    opacity .75s cubic-bezier(.16,1,.3,1),
    transform .95s cubic-bezier(.16,1,.3,1),
    filter .95s cubic-bezier(.16,1,.3,1);
}

.js .contact.is-in .contact__lead{
  opacity:1;
  transform: translate3d(0,0,0);
  filter: blur(0px);
}
.js .contact.is-in .contact__sub{
  opacity:1;
  transform: translate3d(0,0,0);
  filter: blur(0px);
  transition-delay: 70ms;
}

/* =========================================================
VIDEO REVIEWS (B) — safe isolated block
========================================================= */
.reviews{
  background:#050505;
  color:#f5f5f5;

  /* “выезд из-за клиентов” */
  margin-top:-64px;
  padding:120px var(--pad) 110px;

  position:relative;
  z-index:6;
}

.reviews__inner{
  max-width:var(--grid);
  margin:0 auto;

  display:grid;
  gap:18px;
  align-items:start;
}

@media (min-width:980px){
  .reviews__inner{
    grid-template-columns: 1.05fr 0.95fr;
    grid-template-areas:
      "head card"
      "tabs card";
    column-gap: clamp(26px, 4vw, 64px);
    row-gap: 18px;
    align-items:center;
  }
  .reviews__head{ grid-area: head; }
  .reviews__card{ grid-area: card; }
  .reviews__tabs{ grid-area: tabs; }
}

.reviews__kicker{
  font-size:.78rem;
  letter-spacing:.22em;
  text-transform:uppercase;
  opacity:.75;
  margin:0 0 10px;
}

.reviews__title{
  font-size:clamp(1.6rem, 3.4vw, 2.4rem);
  font-weight:800;
  letter-spacing:.06em;
  text-transform:uppercase;
  margin:0 0 12px;
}

.reviews__lead{
  color:#cfcfcf;
  max-width:52ch;
  line-height:1.75;
  margin:0;
}

/* card */
.reviews__card{
  position:relative;
  overflow:hidden;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.10);
  background:#0b0b0b;

  width:100%;
  min-height: clamp(280px, 34vw, 420px);

  cursor:pointer;
  display:grid;
  place-items:center;

  box-shadow: 0 18px 54px rgba(0,0,0,.55);
  transition: transform .55s cubic-bezier(.19,1,.22,1), box-shadow .55s ease;
}
.reviews__card:hover{
  transform: translateY(-3px);
  box-shadow: 0 28px 80px rgba(0,0,0,.65);
}

.reviews__thumb{
  position:absolute;
  inset:0;
  background:
    radial-gradient(900px 520px at 30% 20%, rgba(255,255,255,.08), transparent 55%),
    radial-gradient(700px 420px at 80% 70%, rgba(255,255,255,.06), transparent 60%),
    linear-gradient(180deg, #0c0c0c, #070707);
  transform: scale(1.04);
}
.reviews__card::after{
  content:"";
  position:absolute;
  inset:0;
  background: radial-gradient(80% 70% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,.60) 72%, rgba(0,0,0,.82) 100%);
  pointer-events:none;
}

.reviews__play{
  position:relative;
  width:86px;
  height:86px;
  display:grid;
  place-items:center;
  border-radius:999px;
  z-index:2;
}
.reviews__playRing{
  position:absolute;
  inset:0;
  border-radius:inherit;
  border:1px solid rgba(255,255,255,.58);
  box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 14px 34px rgba(0,0,0,.55);
  backdrop-filter: blur(6px);
}
.reviews__playTri{
  width:0;height:0;
  border-left:14px solid rgba(255,255,255,.92);
  border-top:9px solid transparent;
  border-bottom:9px solid transparent;
  transform: translateX(2px);
}

.reviews__caption{
  position:absolute;
  left:16px;
  right:16px;
  bottom:16px;
  z-index:2;

  border:1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.30);
  backdrop-filter: blur(8px);
  border-radius:16px;
  padding:14px 14px 12px;

  text-align:left;
}
.reviews__quote{
  display:block;
  color:#e9e9e9;
  line-height:1.55;
  margin-bottom:8px;
}
.reviews__meta{
  display:block;
  color:#bdbdbd;
  font-size:.78rem;
  letter-spacing:.18em;
  text-transform:uppercase;
}

/* tabs */
.reviews__tabs{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}
.reviews__tab{
  border:1px solid rgba(255,255,255,.12);
  background: rgba(0,0,0,.22);
  color:#e9e9e9;

  padding:10px 12px;
  border-radius:999px;

  font-size:.82rem;
  letter-spacing:.16em;
  text-transform:uppercase;

  cursor:pointer;
  transition: transform .35s cubic-bezier(.19,1,.22,1), background .35s ease, border-color .35s ease;
}
.reviews__tab:hover{ transform: translateY(-1px); }
.reviews__tab span{ opacity:.72; margin-right:8px; }
.reviews__tab.is-active{
  background:#fff;
  color:#000;
  border-color:#fff;
}

/* =========================================================
Repeatable reveal (SAFE): by default everything visible.
JS adds .rv-ready to #reviews to enable animation.
========================================================= */
#reviews.rv-ready [data-rv]{
  opacity:0;
  transform: translateY(16px);
  filter: blur(3px);
  transition:
    opacity .85s cubic-bezier(.19,1,.22,1),
    transform .85s cubic-bezier(.19,1,.22,1),
    filter .85s cubic-bezier(.19,1,.22,1);
  will-change: opacity, transform, filter;
}
#reviews.rv-ready [data-rv].is-inview{
  opacity:1;
  transform: translateY(0);
  filter: blur(0);
}

/* =========================================================
Modal — isolated and НЕ использует твой nav-lock
========================================================= */
body.reviews-lock{ overflow:hidden; }

.reviews-modal{
  position:fixed;
  inset:0;
  z-index:2200;
  display:none;
}
.reviews-modal.is-open{ display:block; }

.reviews-modal__bg{
  position:absolute;
  inset:0;
  background:rgba(0,0,0,.72);
  backdrop-filter: blur(8px);
}

.reviews-modal__panel{
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  width:min(980px, calc(100vw - 28px));
  border-radius:22px;
  border:1px solid rgba(255,255,255,.10);
  background:#050505;
  overflow:hidden;
  box-shadow: 0 24px 90px rgba(0,0,0,.65);
}

.reviews-modal__frame{
  aspect-ratio: 16/9;
  width:100%;
  background:#000;
}
.reviews-modal__frame iframe,
.reviews-modal__frame video{
  width:100%;
  height:100%;
  display:block;
  border:0;
}

.reviews-modal__close{
  position:absolute;
  top:14px;
  right:14px;
  width:44px;
  height:44px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.16);
  background: rgba(0,0,0,.35);
  color:#fff;
  cursor:pointer;
  z-index:2;
}
.reviews-modal__close::before,
.reviews-modal__close::after{
  content:"";
  position:absolute;
  left:50%;
  top:50%;
  width:18px;
  height:2px;
  background:currentColor;
  transform-origin:center;
}
.reviews-modal__close::before{ transform:translate(-50%,-50%) rotate(45deg); }
.reviews-modal__close::after{  transform:translate(-50%,-50%) rotate(-45deg); }

@media (prefers-reduced-motion:reduce){
  #reviews.rv-ready [data-rv]{ transition:none; filter:none; }
  .reviews__card{ transition:none; }
}


/* =========================================================
CONTACT — Variant A (REAL underlap behind Clients)
========================================================= */
:root{
  --contact-overlap: clamp(90px, 13vh, 160px);
}

/* Clients сверху и закрывает то, что "под ним" */
.clients{
  position:relative;
  z-index:6;

  /* важно: чтобы маска не накрыла контент, добавляем снизу место */
  padding-bottom: calc(90px + var(--contact-overlap));

  /* лёгкая глубина */
  box-shadow: 0 48px 110px rgba(0,0,0,.55);
}

/* Маска снизу (именно она создаёт "из-за блока") */
.clients::after{
  content:"";
  position:absolute;
  left:0; right:0;
  bottom:0;
  height: var(--contact-overlap);
  background:#050505;          /* фон Clients */
  pointer-events:none;
  z-index:2;
}

/* Contact реально подныривает под Clients */
.contact{
  position:relative;
  z-index:4;
  margin-top: calc(var(--contact-overlap) * -1);

  /* НЕ добавляем overlap в padding-top — иначе ничего "из-за" не будет */
  padding-top: 120px;

  scroll-margin-top: 110px;
}

/* мобилка */
@media (max-width: 768px){
  :root{ --contact-overlap: clamp(72px, 12vh, 130px); }
  .contact{ padding-top: 96px; }
}
/* ===== Форма: выезд "из-за Clients" (повторяемо) ===== */
.js .contact .form{
  --form-enter: calc(var(--contact-overlap) * -0.55); /* старт за маской (выше) */
  --form-float: 0px;                                  /* микродвижение по скроллу (JS) */

  opacity:0;
  transform: translate3d(0, calc(var(--form-enter) + var(--form-float)), 0) scale(.99);
  filter: blur(10px);

  will-change: transform, opacity, filter;

  transition:
    opacity .85s cubic-bezier(.16,1,.3,1),
    transform 1.15s cubic-bezier(.16,1,.3,1),
    filter 1.15s cubic-bezier(.16,1,.3,1);
}

.js .contact.is-in .form{
  opacity:1;
  transform: translate3d(0, var(--form-float), 0) scale(1);
  filter: blur(0px);
}

/* мобилка — легче */
@media (max-width: 768px){
  .js .contact .form{
    filter: blur(7px);
    transition-duration: .78s, 1.02s, 1.02s;
  }
  
}
:root{
  --stack-overlap: clamp(48px, 7vw, 140px);  /* насколько отзывы “залезают” под клиентов */
  --rv-shift: clamp(70px, 9vw, 170px);       /* сила выезда */
}

/* КЛИЕНТЫ — верхний слой, с “юбкой” снизу */
.clients{
  position: relative;
  z-index: 5;
  background: var(--bg, #050505);
  padding-bottom: var(--stack-overlap);
}

/* ВИДЕО-ОТЗЫВЫ — начинаются под клиентами */
.video-reviews{
  position: relative;
  z-index: 1;
  background: var(--bg, #050505);
  margin-top: calc(-1 * var(--stack-overlap));
  padding-top: var(--stack-overlap);
}

/* Анимируем не всю секцию, а внутренний контейнер */
.video-reviews__inner{
  transform: translate3d(0, var(--rv-shift), 0);
  opacity: 0;
  filter: blur(10px);
  transition:
    transform 1.1s cubic-bezier(.22,.61,.36,1),
    opacity  1.1s cubic-bezier(.22,.61,.36,1),
    filter   1.1s cubic-bezier(.22,.61,.36,1);
  will-change: transform, opacity, filter;
}

.video-reviews.is-inview .video-reviews__inner{
  transform: translate3d(0, 0, 0);
  opacity: 1;
  filter: blur(0);
}

/* На мобиле делаем перекрытие мягче (или вообще можно выключить, если захочешь) */
@media (max-width: 820px){
  :root{
    --stack-overlap: 28px;
    --rv-shift: 90px;
  }
}
/* =========================
   TEAM (premium carousel)
========================= */
.team{
  position: relative;
  padding: clamp(56px, 7vw, 96px) 0;
}

.team__inner{
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.team__kicker{
  font-size: 12px;
  letter-spacing: .28em;
  opacity: .72;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.team__headRow{
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
}

.team__title{
  margin: 0;
  font-size: clamp(28px, 4.2vw, 52px);
  letter-spacing: .06em;
  text-transform: uppercase;
  line-height: 1.05;
}

.team__sub{
  margin: 12px 0 0;
  max-width: 760px;
  opacity: .70;
  line-height: 1.6;
}

.team__controls{
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* Кнопки навигации — премиальные круги */
.team-nav-btn{
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.28);
  background: rgba(0,0,0,.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  color: rgba(255,255,255,.92);
  transition: transform .25s ease, border-color .25s ease, background .25s ease, box-shadow .25s ease;
}

.team-nav-btn svg{
  width: 20px;
  height: 20px;
}

.team-nav-btn:hover{
  transform: translateY(-1px);
  border-color: rgba(255,255,255,.42);
  background: rgba(0,0,0,.46);
  box-shadow: 0 18px 40px rgba(0,0,0,.45);
}

.team-nav-btn:active{
  transform: translateY(0);
}

.team__railWrap{
  position: relative;
  margin-top: 28px;
}

/* “Виньетка” по краям, чтобы выглядело дороже */
.team__railWrap::before,
.team__railWrap::after{
  content:"";
  position:absolute;
  top:0;
  bottom:44px;
  width: 64px;
  pointer-events:none;
  z-index: 2;
}
.team__railWrap::before{
  left: -6px;
  background: linear-gradient(90deg, rgba(0,0,0,.85), rgba(0,0,0,0));
}
.team__railWrap::after{
  right: -6px;
  background: linear-gradient(270deg, rgba(0,0,0,.85), rgba(0,0,0,0));
}

.team__rail{
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 6px 18px;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.team__rail::-webkit-scrollbar{ display:none; }

/* Карточка */
.team-card{
  scroll-snap-align: start;
  flex: 0 0 clamp(250px, 28vw, 320px);
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.12);
  background:
    radial-gradient(120% 120% at 20% 10%, rgba(255,255,255,.08), rgba(255,255,255,0) 55%),
    rgba(255,255,255,.03);
  box-shadow: 0 30px 80px rgba(0,0,0,.55);
  overflow: hidden;
  position: relative;
  transform: translateZ(0);
  transition: transform .45s cubic-bezier(.22,.61,.36,1), border-color .45s cubic-bezier(.22,.61,.36,1);
}

/* Постоянная “живая” микродинамика карточек */
@keyframes teamFloat{
  0%   { transform: translateY(0) }
  50%  { transform: translateY(-6px) }
  100% { transform: translateY(0) }
}
.team-card{
  animation: teamFloat 7.5s ease-in-out infinite;
}
.team-card:nth-child(2n){ animation-duration: 8.6s; animation-delay: -1.8s; }
.team-card:nth-child(3n){ animation-duration: 9.3s; animation-delay: -3.1s; }

.team-card::after{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius: 24px;
  background: radial-gradient(70% 60% at 30% 0%, rgba(255,255,255,.18), rgba(255,255,255,0) 55%);
  opacity: .55;
  pointer-events:none;
  mix-blend-mode: screen;
}

.team-card:hover{
  transform: translateY(-4px);
  border-color: rgba(255,255,255,.22);
}

.team-card__media{
  aspect-ratio: 4 / 5;
  background: rgba(255,255,255,.04);
  position: relative;
  overflow: hidden;
}

.team-card__media img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display:block;
  transform: scale(1.02);
  filter: grayscale(1) contrast(1.08) brightness(.92);
}

/* Если фото уже подготовлено “ч/б + красный акцент” — фильтр не трогаем */
.team-card.is-colorpop .team-card__media img{
  filter: none;
}

/* Текст */
.team-card__body{
  padding: 16px 16px 18px;
}

.team-card__name{
  font-size: 14px;
  letter-spacing: .22em;
  text-transform: uppercase;
  opacity: .95;
}

.team-card__role{
  margin-top: 8px;
  font-size: 16px;
  letter-spacing: .02em;
  opacity: .86;
}

.team-card__meta{
  margin-top: 12px;
  display:flex;
  align-items:center;
  gap: 10px;
  font-size: 13px;
  opacity: .72;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.team-card__dot{
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255,255,255,.45);
}

/* “Колёсики” */
.team__dots{
  display:flex;
  justify-content: center;
  gap: 10px;
  padding-top: 10px;
}

.team-dot{
  width: 7px;
  height: 7px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.35);
  background: rgba(255,255,255,.08);
  cursor: pointer;
  padding: 0;
  transition: transform .25s ease, background .25s ease, border-color .25s ease;
}

.team-dot.is-active{
  background: rgba(255,255,255,.85);
  border-color: rgba(255,255,255,.85);
  transform: scale(1.25);
}

/* Мобилка: стрелки можно оставить, но если захочешь — можно скрыть */
@media (max-width: 680px){
  .team__headRow{
    align-items: flex-start;
  }
  .team-nav-btn{
    width: 52px;
    height: 52px;
  }
}

/* Уважение к prefers-reduced-motion */
@media (prefers-reduced-motion: reduce){
  .team-card{ animation: none; }
  .team__rail{ scroll-behavior: auto; }
}

/* =========================
   TEAM — reveal on scroll (repeat)
========================= */

/* Базовое состояние (скрыто) */
.team .reveal {
  opacity: 0;
  transform: translateY(18px);
  filter: blur(8px);
  transition:
    transform 1.05s cubic-bezier(.22,.61,.36,1),
    opacity 1.05s cubic-bezier(.22,.61,.36,1),
    filter 1.05s cubic-bezier(.22,.61,.36,1);
  will-change: transform, opacity, filter;
}

/* Видимое состояние */
.team .reveal.is-inview {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* Ступеньки (если задано из JS) */
.team .reveal.is-inview {
  transition-delay: var(--td, 0s);
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce){
  .team .reveal,
  .team .reveal.is-inview{
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
/* =========================================
   LIGHT SHEET: clients + reviews одним цветом
   (глобус/другие секции не трогаем)
========================================= */

#clients[data-theme="light"],
#reviews[data-theme="light"]{
  background: #f6f4f1 !important;     /* единый премиальный off-white */
  background-image: none !important;
  box-shadow: none !important;
  color: #0b0b0b !important;

  margin: 0 !important;              /* чтобы не светился body */
  position: relative;
  z-index: 5;
  isolation: isolate;
}

/* убираем любые “переходы” и оверлеи, которые рисуют полосу */
#clients[data-theme="light"]::before,
#clients[data-theme="light"]::after,
#reviews[data-theme="light"]::before,
#reviews[data-theme="light"]::after,
#clients[data-theme="light"] .clients__inner::before,
#clients[data-theme="light"] .clients__inner::after,
#reviews[data-theme="light"] .reviews__inner::before,
#reviews[data-theme="light"] .reviews__inner::after{
  content: none !important;
}

/* контент поверх всего (на случай, если что-то “накрывает”) */
#clients[data-theme="light"] .clients__inner,
#reviews[data-theme="light"] .reviews__inner{
  position: relative;
  z-index: 6;
}
/* ====== TEAM mobile: smooth swipe + centered cards ====== */
@media (max-width: 768px){
  /* класс .team-snap мы повесим через JS на правильный контейнер */
  #team .team-snap{
    display: flex !important;
    gap: 14px;
    overflow-x: auto !important;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scroll-snap-stop: always;
    overscroll-behavior-x: contain;
    touch-action: pan-x;

    /* чтобы крайние карточки тоже вставали по центру */
    padding-inline: calc((100vw - min(78vw, 360px)) / 2);
    scroll-padding-inline: calc((100vw - min(78vw, 360px)) / 2);

    /* если твоя текущая карусель двигается transform'ом — глушим на мобилке */
    transform: none !important;
  }

  #team .team-snap::-webkit-scrollbar{ display: none; }
  #team .team-snap{ scrollbar-width: none; }

  #team .team-card{
    flex: 0 0 min(78vw, 360px);
    scroll-snap-align: center;
  }
}
/* === TEAM x CONTACT: нормальная пагинация + воздух между секциями === */

/* 1) Чётко отделяем Team от формы */
#team { padding-bottom: clamp(64px, 8vw, 120px) !important; }
#contact { padding-top: clamp(64px, 8vw, 120px) !important; }

/* 2) Колёсики (dots) — НЕ absolute, всегда под карточками */
#team .team__dots,
#teamDots.team__dots {
  position: relative !important;
  top: auto !important;
  right: auto !important;
  bottom: auto !important;
  left: auto !important;
  transform: none !important;

  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  margin-top: 18px;
  margin-bottom: 0;
  padding-bottom: 18px; /* чтобы точки не прилипали к следующей секции */
  z-index: 3;
}
/* =========================
   OFFICES (accordion + map)
========================= */
.offices{
  position: relative;
  background: #050505;
  color: rgba(255,255,255,.92);
  padding-block: clamp(56px, 7vw, 96px);
  border-top: 1px solid rgba(255,255,255,.10);
  border-bottom: 1px solid rgba(255,255,255,.10);
}

.offices__inner{
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
}

.offices__head{ margin-bottom: clamp(18px, 3vw, 28px); }
.offices__kicker{
  margin: 0 0 10px;
  letter-spacing: .22em;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(255,255,255,.55);
}
.offices__title{
  margin: 0 0 10px;
  font-size: clamp(26px, 4vw, 44px);
  line-height: 1.05;
  letter-spacing: .02em;
}
.offices__lead{
  margin: 0;
  max-width: 60ch;
  color: rgba(255,255,255,.62);
}

.offices__layout{
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: clamp(14px, 2.2vw, 22px);
  align-items: start;
  margin-top: clamp(18px, 3vw, 26px);
}

.offices__list{
  display: grid;
  gap: 12px;
}

.office{
  appearance: none;
  width: 100%;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.04);
  border-radius: 18px;
  padding: 16px 16px 14px;
  text-align: left;
  cursor: pointer;
  transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;
  position: relative;
  overflow: hidden;
}

.office::before{
  content:"";
  position:absolute;
  inset:-1px;
  background: radial-gradient(600px 200px at 20% 0%, rgba(255,255,255,.10), transparent 60%);
  opacity: 0;
  transition: opacity .18s ease;
  pointer-events:none;
}

.office:hover{
  transform: translateY(-1px);
  border-color: rgba(255,255,255,.22);
  background: rgba(255,255,255,.06);
}
.office:hover::before{ opacity: 1; }

.office.is-active{
  border-color: rgba(255,255,255,.36);
  background: rgba(255,255,255,.08);
  box-shadow: 0 18px 40px rgba(0,0,0,.35);
}

.office__top{
  display:flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
  margin-bottom: 10px;
}
.office__city{
  font-size: 16px;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.office__country{
  font-size: 12px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(255,255,255,.55);
}
.office__addr{
  display:block;
  color: rgba(255,255,255,.78);
  margin-bottom: 8px;
}
.office__phone{
  display:block;
  color: rgba(255,255,255,.55);
  font-size: 13px;
}

.offices__mapWrap{
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.03);
  border-radius: 22px;
  overflow: hidden;
  position: relative;

  /* “раскрытие” */
  max-height: 0;
  transition: max-height .45s cubic-bezier(.2,.8,.2,1), border-color .2s ease;
}
.offices__mapWrap.is-open{
  max-height: 720px;
  border-color: rgba(255,255,255,.20);
}

.offices__map{
  height: clamp(280px, 44vh, 420px);
  width: 100%;
  position: relative;
}

/* тонкая “премиальная” зернистость поверх карты */
.offices__map::after{
  content:"";
  position:absolute;
  inset:0;
  background:
    radial-gradient(600px 220px at 30% 0%, rgba(255,255,255,.10), transparent 60%),
    linear-gradient(to bottom, rgba(0,0,0,.10), rgba(0,0,0,.35));
  pointer-events:none;
  mix-blend-mode: soft-light;
}

/* нижняя мета-панель */
.offices__meta{
  padding: 14px 16px 16px;
  border-top: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(10px);
}
.offices__metaTitle{
  font-size: 13px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(255,255,255,.80);
  margin-bottom: 10px;
}
.offices__metaRow{
  display:flex;
  align-items:center;
  gap: 12px;
  flex-wrap: wrap;
}
.offices__metaLink,
.offices__metaTel{
  color: rgba(255,255,255,.70);
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,.22);
  padding-bottom: 2px;
  transition: color .18s ease, border-color .18s ease;
}
.offices__metaLink:hover,
.offices__metaTel:hover{
  color: rgba(255,255,255,.92);
  border-color: rgba(255,255,255,.45);
}
.offices__metaSep{
  width: 28px;
  height: 1px;
  background: rgba(255,255,255,.18);
}

/* Leaflet: минимальный UI + “black & white” ощущение */
#officeMap .leaflet-control-container{ filter: grayscale(1); opacity: .85; }
#officeMap .leaflet-bar a{
  background: rgba(0,0,0,.55);
  color: rgba(255,255,255,.85);
  border: 1px solid rgba(255,255,255,.20);
}
#officeMap .leaflet-bar a:hover{ background: rgba(0,0,0,.75); }
#officeMap .leaflet-control-attribution{
  background: transparent;
  color: rgba(255,255,255,.45);
}

/* делаем тайлы “дизайнерски-ч/б” */
#officeMap .leaflet-tile{
  filter: grayscale(1) invert(1) contrast(.95) brightness(.86);
}

/* адаптив */
@media (max-width: 860px){
  .offices__layout{ grid-template-columns: 1fr; }
  .offices__map{ height: 320px; }
}
