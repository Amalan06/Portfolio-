// ─────────────────────────────────────────
// JARVIS / ARC-REACTOR CURSOR
// ─────────────────────────────────────────
const wrap   = document.getElementById('cursor-wrap');
const canvas = document.getElementById('cursor-canvas');
const ctx    = canvas.getContext('2d');
const SIZE   = 80;
const CX     = SIZE / 2;

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;
let hovered = false;
let t = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  wrap.classList.add('active');
});
document.addEventListener('mouseleave', () => wrap.classList.remove('active'));

document.querySelectorAll('a, .tag').forEach(el => {
  el.addEventListener('mouseenter', () => hovered = true);
  el.addEventListener('mouseleave', () => hovered = false);
});

function drawJarvis(time) {
  ctx.clearRect(0, 0, SIZE, SIZE);

  const accent  = hovered ? 'rgba(240,237,232,' : 'rgba(232,213,176,';
  const accentS = hovered ? 'rgba(240,237,232,' : 'rgba(232,213,176,';

  // Outer slow-rotating dashed ring
  ctx.save();
  ctx.translate(CX, CX);
  ctx.rotate(time * 0.3);
  ctx.beginPath();
  ctx.setLineDash([4, 6]);
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.strokeStyle = accent + '0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // Mid ring — counter-rotate
  ctx.save();
  ctx.translate(CX, CX);
  ctx.rotate(-time * 0.6);
  ctx.beginPath();
  ctx.setLineDash([8, 14]);
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.strokeStyle = accent + '0.5)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // Inner solid ring
  ctx.save();
  ctx.translate(CX, CX);
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.strokeStyle = accent + '0.85)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Glowing arc that sweeps
  ctx.save();
  ctx.translate(CX, CX);
  ctx.rotate(time * 1.2);
  const grad = ctx.createConicalGradient
    ? null
    : null;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 1.1);
  ctx.strokeStyle = accent + '1)';
  ctx.lineWidth = 2;
  ctx.shadowColor = hovered ? '#f0ede8' : '#e8d5b0';
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.restore();

  // 4 tick marks on outer ring
  ctx.save();
  ctx.translate(CX, CX);
  ctx.rotate(time * 0.3);
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((Math.PI / 2) * i);
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(36, 0);
    ctx.strokeStyle = accent + '0.7)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = hovered ? '#f0ede8' : '#e8d5b0';
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // Centre dot
  ctx.save();
  ctx.translate(CX, CX);
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = accent + '1)';
  ctx.shadowColor = hovered ? '#f0ede8' : '#e8d5b0';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();
}

function loop(ts) {
  t = ts / 1000;

  // Smooth follow
  curX += (mouseX - curX) * 0.1;
  curY += (mouseY - curY) * 0.1;
  wrap.style.left = curX + 'px';
  wrap.style.top  = curY + 'px';

  drawJarvis(t);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ─────────────────────────────────────────
// CONVEYOR BELT — pause on hover
// ─────────────────────────────────────────
document.querySelectorAll('.conveyor-row').forEach(row => {
  const track = row.querySelector('.conveyor-track');
  row.addEventListener('mouseenter', () => track.classList.add('paused'));
  row.addEventListener('mouseleave', () => track.classList.remove('paused'));
});

// ─────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────
const sections = document.querySelectorAll('section:not(#hero)');

if (!('IntersectionObserver' in window)) {
  sections.forEach(s => s.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  sections.forEach(s => observer.observe(s));
}

setTimeout(() => sections.forEach(s => s.classList.add('visible')), 1500);
