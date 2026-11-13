/* =========================================================
 * Music: plays music.mp3 if present, otherwise a Web Audio
 * music-box "Happy Birthday" melody. Wires the mute button.
 * Exposes: startMusic()
 * ========================================================= */

const song = $('#song');
let audioCtx, master, muted = false;
const NOTE = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
// "Happy Birthday to You" (public domain): note, beats
const MELODY = ('G4 .75 G4 .25 A4 1 G4 1 C5 1 B4 2 G4 .75 G4 .25 A4 1 G4 1 D5 1 C5 2 ' +
                'G4 .75 G4 .25 G5 1 E5 1 C5 1 B4 1 A4 2 F5 .75 F5 .25 E5 1 C5 1 D5 1 C5 3').split(' ');

function tone(f, t, d) {
  const ringOut = Math.max(d, .5) * 1.8;
  [[f, 'triangle', .16], [f * 2, 'sine', .05]].forEach(([freq, type, vol]) => {
    const o = audioCtx.createOscillator(), v = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    v.gain.setValueAtTime(0, t);
    v.gain.linearRampToValueAtTime(vol, t + .02);
    v.gain.exponentialRampToValueAtTime(.0001, t + ringOut);
    o.connect(v).connect(master);
    o.start(t); o.stop(t + ringOut + .05);
  });
}

function playMelody() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(audioCtx.destination);
  }
  audioCtx.resume();
  const beat = .45;
  let t = audioCtx.currentTime + .1;
  for (let i = 0; i < MELODY.length; i += 2) {
    const d = MELODY[i + 1] * beat;
    tone(NOTE[MELODY[i]], t, d);
    t += d;
  }
  setTimeout(playMelody, (t - audioCtx.currentTime + 2) * 1000);
}

// Must be called from a user click (browser autoplay rules)
function startMusic() {
  song.play().catch(playMelody); // no music.mp3 (or blocked) -> synth melody
  $('#mute').hidden = false;
}

$('#mute').addEventListener('click', () => {
  muted = !muted;
  song.muted = muted;
  if (master) master.gain.value = muted ? 0 : 1;
  $('#mute').textContent = muted ? '🔇' : '🎵';
});
