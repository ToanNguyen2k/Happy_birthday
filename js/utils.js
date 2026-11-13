/* Shared helpers, loaded before the other scripts. */
const $ = s => document.querySelector(s);
const rnd = (a, b) => a + Math.random() * (b - a);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
