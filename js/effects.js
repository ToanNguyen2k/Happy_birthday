/* =========================================================
 * Visual effects: falling hearts + confetti on a full-screen
 * canvas, and rising balloons.
 * Exposes: burst(x, y, n), launchBalloons(), W, H (viewport size)
 * ========================================================= */

const fxCanvas = $('#fx'), fx = fxCanvas.getContext('2d');
const FX_COLORS = ['#ff5c8a', '#ff9ec0', '#ffc93c', '#c9b6ff', '#ffffff', '#ff7aa8', '#c86bfa'];
let W, H, particles = [];

function resizeFx() {
  const r = devicePixelRatio || 1;
  W = innerWidth; H = innerHeight;
  fxCanvas.width = W * r; fxCanvas.height = H * r;
  fx.setTransform(r, 0, 0, r, 0, 0);
}
addEventListener('resize', resizeFx);
resizeFx();

function spawn(kind, x, y, vx, vy) {
  particles.push({
    kind, x, y, vx, vy,
    rot: rnd(0, 6.28), vr: rnd(-.15, .15),
    s: kind === 'heart' ? rnd(8, 18) : rnd(5, 10),
    c: FX_COLORS[Math.random() * FX_COLORS.length | 0],
    a: kind === 'heart' ? rnd(.5, .9) : 1,
  });
}

function heartPath(s) {
  fx.beginPath();
  fx.moveTo(0, -s / 4);
  fx.bezierCurveTo(0, -s / 2, -s / 2, -s / 2, -s / 2, -s / 4);
  fx.bezierCurveTo(-s / 2, 0, 0, s / 5, 0, s / 2);
  fx.bezierCurveTo(0, s / 5, s / 2, 0, s / 2, -s / 4);
  fx.bezierCurveTo(s / 2, -s / 2, 0, -s / 2, 0, -s / 4);
  fx.fill();
}

function tick() {
  fx.clearRect(0, 0, W, H);
  if (!reduceMotion && particles.length < 45 && Math.random() < .08) {
    spawn('heart', rnd(0, W), -20, rnd(-.3, .3), rnd(.6, 1.4));
  }
  for (const p of particles) {
    if (p.kind === 'paper') { p.vx *= .985; p.vy = Math.min(p.vy + .12, 3.2); }
    p.x += p.vx + Math.sin(p.y / 40 + p.rot) * .4;
    p.y += p.vy;
    p.rot += p.vr;
    fx.save();
    fx.globalAlpha = p.a;
    fx.fillStyle = p.c;
    fx.translate(p.x, p.y);
    if (p.kind === 'heart') {
      fx.rotate(Math.sin(p.rot) * .4);
      heartPath(p.s);
    } else {
      fx.rotate(p.rot);
      fx.scale(1, Math.cos(p.rot * 3)); // paper flip
      fx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
    }
    fx.restore();
  }
  particles = particles.filter(p => p.y < H + 40 && p.x > -60 && p.x < W + 60);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function burst(x, y, n = 140) {
  if (reduceMotion) n = 30;
  for (let i = 0; i < n; i++) {
    const ang = rnd(-Math.PI * .9, -Math.PI * .1), v = rnd(5, 13);
    spawn(Math.random() < .25 ? 'heart' : 'paper', x, y, Math.cos(ang) * v, Math.sin(ang) * v);
  }
}

function launchBalloons() {
  const box = $('.balloons');
  const tints = ['#ff5c8a', '#ff9ec0', '#c9b6ff', '#ffc93c', '#ff7aa8', '#b28dff', '#ffb3c7'];
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    b.style.cssText =
      `--x:${rnd(0, 95)}%;--c:${tints[i % tints.length]};--d:${rnd(11, 18)}s;` +
      `--delay:${rnd(0, 8)}s;--sway:${rnd(-80, 80)}px;--tilt:${rnd(-15, 15)}deg`;
    box.append(b);
  }
}
