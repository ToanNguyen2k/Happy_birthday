/* =========================================================
 * Page flow: gift screen -> wishes -> blow candles ->
 * photo ring + love letter.
 * ========================================================= */

/* ---------- names from the link ---------- */
const params = new URLSearchParams(location.search);
const toName = params.get('name')?.trim() || DEFAULT_NAME;
const fromName = params.get('from')?.trim() || DEFAULT_FROM;

// textContent, never innerHTML: names come from the URL
document.querySelectorAll('[data-name]').forEach(el => el.textContent = toName);
document.querySelectorAll('[data-from]').forEach(el => el.textContent = fromName);
document.title = `Happy Birthday ${toName} 💖`;

/* ---------- typewriter ---------- */
const wishChars = WISHES.map(s => Array.from(s)); // split by code point so emoji never break in half
const typedEl = $('.typed');
let wi = 0, ci = 0, deleting = false;

// Types each wish once; the last one stays, then the candle prompt appears.
function typeWishes() {
  const s = wishChars[wi];
  typedEl.textContent = s.slice(0, ci).join('');
  if (!deleting && ci < s.length) { ci++; return setTimeout(typeWishes, 70); }
  if (wi === wishChars.length - 1) {
    typedEl.classList.add('done');
    return setTimeout(() => { $('#hint').hidden = false; }, 600);
  }
  if (!deleting) { deleting = true; return setTimeout(typeWishes, 1500); }
  if (ci > 0) { ci--; return setTimeout(typeWishes, 28); }
  deleting = false;
  wi++;
  setTimeout(typeWishes, 400);
}

/* ---------- photo ring ---------- */
function buildRing() {
  const ring = $('.ring'), n = PHOTOS.length;
  const r = Math.round(55 / Math.tan(Math.PI / Math.max(n, 3))) + 24; // half card width / tan(half step)
  const fallback = ['💖', '🥰', '🌸', '✨', '💌', '🎀', '🌷', '💕'];
  PHOTOS.forEach((src, i) => {
    const fig = document.createElement('figure');
    fig.className = 'photo';
    fig.style.cssText = `--a:${i * 360 / n}deg;--r:${r}px`;
    const img = new Image();
    img.alt = '';
    img.onerror = () => { img.remove(); fig.textContent = fallback[i % fallback.length]; };
    img.src = src;
    fig.append(img);
    ring.append(fig);
  });
}

/* ---------- candles ---------- */
const candles = document.querySelectorAll('.candle');
candles.forEach(c => c.addEventListener('click', () => {
  if (c.classList.contains('out')) return;
  c.classList.add('out');
  c.setAttribute('aria-label', 'Nến đã tắt');
  if ([...candles].every(x => x.classList.contains('out'))) celebrate();
}));

function celebrate() {
  const r = $('.cake').getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + 40);
  setTimeout(() => { burst(W * .15, H); burst(W * .85, H); }, 500);
  $('#hint').hidden = false;
  $('#hint').textContent = CELEBRATE_TEXT;
  buildRing();
  setTimeout(() => {
    $('#memories').hidden = false;
    $('#letter').hidden = false;
    $('#memories').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }, 1200);
}

/* ---------- open gift ---------- */
$('#open').addEventListener('click', () => {
  startMusic();
  $('#intro').classList.add('leave');
  setTimeout(() => $('#intro').remove(), 1300);
  $('#main').hidden = false;
  $('#main').classList.add('enter');
  launchBalloons();
  burst(W / 2, H * .6);
  typeWishes();
}, { once: true });
