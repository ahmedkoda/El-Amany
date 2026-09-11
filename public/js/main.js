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
