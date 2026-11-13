# Happy Birthday 💖

A cute, romantic birthday greeting page — plain HTML/CSS/JS, no dependencies, no build step.
Inspired by [ProgrammerGaurav/happy-birthday](https://github.com/ProgrammerGaurav/happy-birthday).

## Live link

For **Bảo Trân** (wife), from **ăm chả** (husband) 💕

https://toannguyen2k.github.io/Happy_birthday/?name=B%E1%BA%A3o%20Tr%C3%A2n&from=%C4%83m%20ch%E1%BA%A3

Short version (same result, these names are the defaults):
https://toannguyen2k.github.io/Happy_birthday/

## Personalize the link

| Param  | Meaning                         | Default    |
|--------|---------------------------------|------------|
| `name` | Birthday person's name (wife)   | `Bảo Trân` |
| `from` | Signature at end of letter      | `ăm chả`   |

Names with Vietnamese accents or spaces should be URL-encoded,
e.g. `B%E1%BA%A3o%20Tr%C3%A2n` for "Bảo Trân".

Wording uses cute husband → wife addressing ("vợ iu", "chồng", "anh – em").

## Flow

1. Gift screen → tap **Mở quà nha vợ 💝** (music starts).
2. Name, typed wishes, confetti and balloons appear.
3. After the wishes, a prompt asks her to make a wish and blow out the candles.
4. Tap each candle → photos spin in a 3D ring, and a love letter is revealed.

## Project structure

```
index.html        Page markup + love letter text
css/style.css     All styling and animations
js/config.js      ✏️ Content to edit: default names, wishes, photo list, messages
js/utils.js       Shared helpers ($, rnd, reduceMotion)
js/effects.js     Falling hearts, confetti, balloons (canvas)
js/music.js       music.mp3 playback / music-box fallback, mute button
js/main.js        Page flow: open gift → wishes → candles → photo ring + letter
images/           Photos for the ring
```

Scripts are plain (non-module) and load in the order above, because
ES modules are blocked when the page is opened via `file://`.

## Customize

- **Names, wishes, messages:** edit `js/config.js`.
- **Letter text:** edit the `<article class="letter">` block in `index.html`.
- **Photos (spinning ring after the candles are blown out):** put photos in
  `images/` named `1.jpg` … `8.jpg`, or edit `PHOTOS` in `js/config.js`
  for other names/count (6–10 looks best). Missing photos show a cute emoji
  card instead. Resize to ~600px wide so the page loads fast.
- **Music:** put a `music.mp3` next to `index.html`. Without it, a built-in
  music-box "Happy Birthday" melody (Web Audio) is played.
- **Colors / look:** CSS variables at the top of `css/style.css`.

## Run locally

Open `index.html` in a browser, or append `?name=...` to the file URL.
