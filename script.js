// ─────────────────────────────────────────
// REACTIVE WHITE CURSOR + FLAME TRAIL
// ─────────────────────────────────────────
const wrap = document.getElementById('cursor-wrap');
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');

const SIZE = 140;
const CX = SIZE / 2;
const CY = SIZE / 2;

let mouseX = 0;
let mouseY = 0;
let curX = 0;
let curY = 0;
let hovered = false;
let t = 0;

const trail = [];

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  wrap.classList.add('active');
});

document.addEventListener('mouseleave', () => wrap.classList.remove('active'));

document.querySelectorAll('a, .tag, .contact-link-row, .email-protected-row').forEach(el => {
  el.addEventListener('mouseenter', () => hovered = true);
  el.addEventListener('mouseleave', () => hovered = false);
});

function spawnTrailParticle() {
  const dx = mouseX - curX;
  const dy = mouseY - curY;
  const speed = Math.min(Math.hypot(dx, dy), 24);

  trail.push({
    x: CX,
    y: CY,
    vx: -dx * 0.02 + (Math.random() - 0.5) * 1.2,
    vy: -dy * 0.02 + (Math.random() - 0.5) * 1.2,
    r: hovered ? 5 + Math.random() * 4 : 4 + Math.random() * 3,
    life: 1,
    decay: 0.03 + Math.random() * 0.02,
    heat: Math.min(1, speed / 18)
  });

  if (trail.length > 40) trail.shift();
}

function drawTrail() {
  for (let i = trail.length - 1; i >= 0; i--) {
    const p = trail[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    p.r *= 0.985;

    if (p.life <= 0) {
      trail.splice(i, 1);
      continue;
    }

    const alpha = p.life * 0.35;
    const innerAlpha = p.life * 0.55;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 170, 80, ${alpha})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 245, 225, ${innerAlpha})`;
    ctx.fill();
  }
}

function drawCursor(time) {
  ctx.clearRect(0, 0, SIZE, SIZE);

  drawTrail();

  const ringColor = hovered ? 'rgba(255,255,255,' : 'rgba(245,240,230,';
  const glowColor = hovered ? '#ffffff' : '#f5eddc';
  const radiusOuter = hovered ? 26 : 22;
  const radiusInner = hovered ? 10 : 8;

  // soft glow
  ctx.save();
  ctx.translate(CX, CY);
  ctx.beginPath();
  ctx.arc(0, 0, radiusOuter + 6, 0, Math.PI * 2);
  ctx.fillStyle = hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,235,205,0.05)';
  ctx.fill();
  ctx.restore();

  // rotating dotted ring
  ctx.save();
  ctx.translate(CX, CY);
  ctx.rotate(time * 0.9);
  ctx.beginPath();
  ctx.setLineDash([3, 8]);
  ctx.arc(0, 0, radiusOuter, 0, Math.PI * 2);
  ctx.strokeStyle = ringColor + '0.45)';
  ctx.lineWidth = 1.1;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.restore();

  // secondary arc
  ctx.save();
  ctx.translate(CX, CY);
  ctx.rotate(-time * 1.5);
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.arc(0, 0, radiusOuter - 5, 0, Math.PI * 1.15);
  ctx.strokeStyle = ringColor + '0.95)';
  ctx.lineWidth = 1.7;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.restore();

  // central ring
  ctx.save();
  ctx.translate(CX, CY);
  ctx.beginPath();
  ctx.arc(0, 0, radiusInner, 0, Math.PI * 2);
  ctx.strokeStyle = ringColor + '0.95)';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.restore();

  // center core
  ctx.save();
  ctx.translate(CX, CY);
  ctx.beginPath();
  ctx.arc(0, 0, hovered ? 3.2 : 2.8, 0, Math.PI * 2);
  ctx.fillStyle = hovered ? 'rgba(255,255,255,1)' : 'rgba(250,245,235,1)';
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.restore();
}

function loop(ts) {
  t = ts / 1000;

  curX += (mouseX - curX) * 0.14;
  curY += (mouseY - curY) * 0.14;

  wrap.style.left = curX + 'px';
  wrap.style.top = curY + 'px';

  spawnTrailParticle();
  drawCursor(t);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ─────────────────────────────────────────
// CONVEYOR BELT — stop on hover
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
