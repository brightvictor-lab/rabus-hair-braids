/* ============================================================
   RABUS HAIR BRAIDS — gallery.js
   Filter tabs + Lightbox + Cursor + Nav
   
   CATEGORY MAP:
   g1  cornrow    g2  box       g3  feed-in   g4  goddess
   g5  twists     g6  fulani    g7  feed-in   g8  knotless
   g9  twists     g10 fulani    g11 cornrow   g12 twists
   g13 feed-in    g14 fulani    g15 knotless  g16 knotless
   g17 knotless   g18 knotless  g19 box       g20 box
   g21 cornrow+feed-in          g22 box
============================================================ */

/* === GALLERY DATA — 22 items (index 0 to 21) === */
var galleryData = [
  { src: 'images/gallery1.jpg',  style: 'Intricate Cornrow',  coll: 'Cornrow Collection',  cat: ['cornrow'] },
  { src: 'images/gallery2.jpg',  style: 'Stitch Braids',      coll: 'Box Braid Series',    cat: ['box'] },
  { src: 'images/gallery3.jpg',  style: 'Feed-In Braids',     coll: 'Feed-In Collection',  cat: ['feed-in'] },
  { src: 'images/gallery4.jpg',  style: 'Goddess Braids',     coll: 'Goddess Collection',  cat: ['goddess'] },
  { src: 'images/gallery5.jpg',  style: 'Twist Style',        coll: 'Twist Collection',    cat: ['twists'] },
  { src: 'images/gallery6.jpg',  style: 'Fulani Braids',      coll: 'Heritage Collection', cat: ['fulani'] },
  { src: 'images/gallery7.jpg',  style: 'Feed-In Braids',     coll: 'Feed-In Collection',  cat: ['feed-in'] },
  { src: 'images/gallery8.jpg',  style: 'Knotless Braids',    coll: 'Knotless Collection', cat: ['knotless'] },
  { src: 'images/gallery9.jpg',  style: 'Curly Twists',       coll: 'Twist Collection',    cat: ['twists'] },
  { src: 'images/gallery10.jpg', style: 'Fulani Braids',      coll: 'Heritage Collection', cat: ['fulani'] },
  { src: 'images/gallery11.jpg', style: 'Cornrows',           coll: 'Cornrow Collection',  cat: ['cornrow'] },
  { src: 'images/gallery12.jpg', style: 'Passion Twist',      coll: 'Twist Collection',    cat: ['twists'] },
  { src: 'images/gallery13.jpg', style: 'Feed-In Braids',     coll: 'Feed-In Collection',  cat: ['feed-in'] },
  { src: 'images/gallery14.jpg', style: 'Fulani Braids',      coll: 'Heritage Collection', cat: ['fulani'] },
  { src: 'images/gallery15.jpg', style: 'Knotless Braids',    coll: 'Knotless Collection', cat: ['knotless'] },
  { src: 'images/gallery16.jpg', style: 'Knotless Braids',    coll: 'Knotless Collection', cat: ['knotless'] },
  { src: 'images/gallery17.jpg', style: 'Knotless Braids',    coll: 'Knotless Collection', cat: ['knotless'] },
  { src: 'images/gallery18.jpg', style: 'Knotless Braids',    coll: 'Knotless Collection', cat: ['knotless'] },
  { src: 'images/gallery19.jpg', style: 'Box Braids',         coll: 'Box Braid Series',    cat: ['box'] },
  { src: 'images/gallery20.jpg', style: 'Box Braids',         coll: 'Box Braid Series',    cat: ['box'] },
  { src: 'images/gallery21.jpg', style: 'Feed-In Cornrows',   coll: 'Cornrow Collection',  cat: ['cornrow', 'feed-in'] },
  { src: 'images/gallery22.jpg', style: 'Box Braids',         coll: 'Box Braid Series',    cat: ['box'] }
];

/* === CURSOR === */
var curEl = document.getElementById('cursor');
var cRing = curEl ? curEl.querySelector('.cur-ring') : null;
var cDot  = curEl ? curEl.querySelector('.cur-dot')  : null;
var mx = 0, my = 0, ox = 0, oy = 0;

document.addEventListener('mousemove', function(e) {
  mx = e.clientX; my = e.clientY;
  if (cDot) { cDot.style.left = mx + 'px'; cDot.style.top = my + 'px'; }
});
(function moveCursor() {
  ox += (mx - ox) * 0.1; oy += (my - oy) * 0.1;
  if (cRing) { cRing.style.left = ox + 'px'; cRing.style.top = oy + 'px'; }
  requestAnimationFrame(moveCursor);
})();

document.querySelectorAll('.g-item, .btn-pink, .nav-book, .ftab, .lb-prev, .lb-next, .lb-close').forEach(function(el) {
  el.addEventListener('mouseenter', function() { document.body.classList.add('hov'); });
  el.addEventListener('mouseleave', function() { document.body.classList.remove('hov'); });
});

/* === NAVBAR === */
var navEl = document.getElementById('nav');
window.addEventListener('scroll', function() {
  if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* === HAMBURGER === */
var burger  = document.getElementById('burger');
var mobMenu = document.getElementById('mobMenu');
if (burger && mobMenu) {
  burger.addEventListener('click', function() {
    burger.classList.toggle('open');
    mobMenu.classList.toggle('open');
  });
  mobMenu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      burger.classList.remove('open');
      mobMenu.classList.remove('open');
    });
  });
}

/* === SCROLL REVEAL === */
var revObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(function(el) { revObs.observe(el); });

/* ============================================================
   FILTER TABS
   - Splits data-cat by space to support dual categories (g21)
   - Updates count display after each filter
============================================================ */
var ftabs      = document.querySelectorAll('.ftab');
var gItems     = document.querySelectorAll('.g-item');
var gCountEl   = document.getElementById('gCount');
var activeFilter = 'all';

ftabs.forEach(function(tab) {
  tab.addEventListener('click', function() {
    ftabs.forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    applyFilter(activeFilter);
  });
});

function applyFilter(filter) {
  var count = 0;
  gItems.forEach(function(item) {
    /* Split data-cat by space — handles "cornrow feed-in" for g21 */
    var cats = item.dataset.cat.split(' ');
    if (filter === 'all' || cats.indexOf(filter) !== -1) {
      item.classList.remove('hidden');
      count++;
    } else {
      item.classList.add('hidden');
    }
  });
  if (gCountEl) gCountEl.textContent = count;
}

/* Run on load */
applyFilter('all');

/* ============================================================
   LIGHTBOX
============================================================ */
var currentIdx = 0;
var lightbox   = document.getElementById('lightbox');
var lbImg      = document.getElementById('lbImg');
var lbStyle    = document.getElementById('lbStyle');
var lbColl     = document.getElementById('lbColl');
var lbCount    = document.getElementById('lbCount');

function openLb(idx) {
  currentIdx = idx;
  updateLb();
  if (lightbox) lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (lightbox) lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(dir) {
  /* Navigate only through visible items */
  var visible = [];
  gItems.forEach(function(item) {
    if (!item.classList.contains('hidden')) {
      visible.push(parseInt(item.dataset.idx));
    }
  });
  if (visible.length === 0) return;
  var pos = visible.indexOf(currentIdx);
  if (pos === -1) pos = 0;
  var newPos = (pos + dir + visible.length) % visible.length;
  currentIdx = visible[newPos];
  updateLb();
}

function updateLb() {
  var data = galleryData[currentIdx];
  if (!data) return;
  lbImg.src   = data.src;
  lbImg.alt   = data.style;
  lbStyle.textContent = data.style;
  lbColl.textContent  = data.coll;

  /* Counter */
  var visible = [];
  gItems.forEach(function(item) {
    if (!item.classList.contains('hidden')) visible.push(parseInt(item.dataset.idx));
  });
  var pos = visible.indexOf(currentIdx);
  if (lbCount) lbCount.textContent = (pos + 1) + ' / ' + visible.length;
}

/* Close on backdrop click */
if (lightbox) {
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
}

/* Keyboard navigation */
document.addEventListener('keydown', function(e) {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft')  lbNav(-1);
  if (e.key === 'Escape')     closeLightbox();
});
