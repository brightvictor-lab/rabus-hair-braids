/* ============================================================
   RABUS HAIR BRAIDS — script.js FINAL
============================================================ */

/* ============================================================
   LOADER
============================================================ */
setTimeout(function() {
  var loader = document.getElementById('loader');
  if (loader) loader.classList.add('done');
}, 2500);

/* ============================================================
   CURSOR (desktop only)
============================================================ */
var curEl = document.getElementById('cursor');
if (curEl) {
  var cRing = curEl.querySelector('.cur-ring');
  var cDot  = curEl.querySelector('.cur-dot');
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
  document.querySelectorAll('.svc-card,.gp-card,.rv-card,.btn-pink,.nav-book,.svc-btn,.call-btn,.view-all,.bk-submit').forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('hov'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('hov'); });
  });
}

/* ============================================================
   NAVBAR
============================================================ */
var navEl = document.getElementById('nav');
if (navEl) {
  window.addEventListener('scroll', function() {
    navEl.classList.toggle('scrolled', window.scrollY > 70);
  }, { passive: true });
}

/* ============================================================
   HAMBURGER
============================================================ */
var burger  = document.getElementById('burger');
var mobMenu = document.getElementById('mobMenu');
if (burger && mobMenu) {
  burger.addEventListener('click', function() {
    burger.classList.toggle('open');
    mobMenu.classList.toggle('open');
  });
  mobMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      burger.classList.remove('open');
      mobMenu.classList.remove('open');
    });
  });
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  var revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function(el) { el.classList.add('animate-in'); });
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(function(el) { obs.observe(el); });
});

/* ============================================================
   SMOOTH SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ============================================================
   SET MIN DATE
============================================================ */
window.addEventListener('DOMContentLoaded', function() {
  var dateEl = document.getElementById('bkDate');
  if (dateEl) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateEl.min = tomorrow.toISOString().split('T')[0];
  }
});

/* ============================================================
   SUBMIT BOOKING
============================================================ */
window.submitBooking = function() {

  var first = document.getElementById('bkFirst').value.trim();
  var last  = document.getElementById('bkLast').value.trim();
  var phone = document.getElementById('bkPhone').value.trim();
  var style = document.getElementById('bkStyle').value;
  var date  = document.getElementById('bkDate').value;
  var time  = document.getElementById('bkTime').value;
  var notes = document.getElementById('bkNotes').value.trim();

  if (!first || !last || !phone || !style || !date || !time) {
    showToast('Missing fields', 'Please fill in all required fields.', true);
    return false;
  }

  var btn = document.getElementById('bkSubmit');
  var txt = document.getElementById('bkSubmitTxt');
  if (btn) btn.disabled = true;
  if (txt) txt.textContent = 'Sending...';

  fetch('/.netlify/functions/send-sms', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:  first + ' ' + last,
      phone: phone,
      style: style,
      date:  date,
      time:  time,
      notes: notes || 'None'
    })
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    if (!result.success) {
      throw new Error(result.error || 'SMS failed');
    }

    /* Fill receipt */
    document.getElementById('rName').textContent  = first + ' ' + last;
    document.getElementById('rPhone').textContent = phone;
    document.getElementById('rStyle').textContent = style;
    document.getElementById('rDate').textContent  = date;
    document.getElementById('rTime').textContent  = time;

    var notesRow = document.getElementById('rNotesRow');
    if (notes) {
      document.getElementById('rNotes').textContent = notes;
      if (notesRow) notesRow.style.display = 'flex';
    } else {
      if (notesRow) notesRow.style.display = 'none';
    }

    /* Show receipt */
    document.getElementById('successOverlay').classList.add('show');
    document.getElementById('bkForm').reset();

    if (btn) btn.disabled = false;
    if (txt) txt.textContent = 'Request Appointment';
  })
  .catch(function(err) {
    console.error('Booking error:', err);
    showToast('Something went wrong', 'Please call us at +1 (312) 647-0604.', true);
    if (btn) btn.disabled = false;
    if (txt) txt.textContent = 'Request Appointment';
  });

};

/* ============================================================
   CLOSE RECEIPT
============================================================ */
function closeSuccess() {
  var overlay = document.getElementById('successOverlay');
  if (overlay) overlay.classList.remove('show');
}

/* ============================================================
   TOAST
============================================================ */
function showToast(title, msg, isErr) {
  var toast = document.getElementById('toast'); if (!toast) return;
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent   = msg;
  document.getElementById('toastIcon').textContent  = isErr ? '✗' : '✦';
  toast.classList.toggle('err', !!isErr);
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 5500);
}
