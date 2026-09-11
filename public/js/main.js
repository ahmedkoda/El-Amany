// Mobile nav toggle
document.addEventListener('click', (e) => {
  if (e.target.closest('.nav-toggle')) {
    document.querySelector('.nav-links')?.classList.toggle('open');
  }
});

// ---------- hero slider ----------
(function () {
  const slider = document.querySelector('.slider');
  if (!slider) return;
  const slides = [...slider.querySelectorAll('.slide')];
  const dotsWrap = slider.querySelector('.dots');
  let i = 0, timer;

  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'slide ' + (idx + 1));
    b.addEventListener('click', () => go(idx));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];

  function render() {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }
  function go(n) { i = (n + slides.length) % slides.length; render(); restart(); }
  function next() { go(i + 1); }
  function prev() { go(i - 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 5500); }

  slider.querySelector('.slider-next')?.addEventListener('click', next);
  slider.querySelector('.slider-prev')?.addEventListener('click', prev);
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
  render(); restart();
})();

// ---------- reveal on scroll ----------
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in')); return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item > button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

// ---------- services showcase tabs (home) ----------
(function () {
  const wrap = document.querySelector('.svc-showcase');
  if (!wrap) return;
  const tabs = [...wrap.querySelectorAll('.svc-tab')];
  const panels = [...wrap.querySelectorAll('.svc-detail')];
  let timer;

  function show(key) {
    tabs.forEach(t => {
      const on = t.dataset.svc === key;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(p => {
      const on = p.dataset.svc === key;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
  }
  function idx() { return Math.max(0, tabs.findIndex(t => t.classList.contains('is-active'))); }
  function autoplay() {
    clearInterval(timer);
    timer = setInterval(() => show(tabs[(idx() + 1) % tabs.length].dataset.svc), 4500);
  }
  function stop() { clearInterval(timer); }

  tabs.forEach(t => {
    t.addEventListener('click', () => { show(t.dataset.svc); stop(); });
    t.addEventListener('keydown', (e) => {
      const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!dir) return;
      e.preventDefault();
      const n = (idx() + dir + tabs.length) % tabs.length;
      show(tabs[n].dataset.svc); tabs[n].focus(); stop();
    });
  });
  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', () => { if (!wrap.dataset.touched) autoplay(); });
  wrap.addEventListener('click', () => { wrap.dataset.touched = '1'; });

  // start rotating only once the section is visible
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { autoplay(); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(wrap);
  } else { autoplay(); }
})();
