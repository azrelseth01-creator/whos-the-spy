# Who’s the Spy? Host Helper

A host-only helper for the party game. Open `index.html` in a browser, or deploy this folder as a static site (Vercel, Netlify, GitHub Pages). No build step.

## Structure

```
index.html        page shell (header, nav, modals, canvases)
vercel.json       static hosting config
css/
  theme.css       colors + light/dark themes (re-skin here)
  app.css         layout and components
js/               classic scripts, loaded in this order:
  words.js        question pairs for "Random pair" (add your own)
  state.js        settings (cfg), game state (G), save/load
  audio.js        sound effects (Web Audio, no files)
  music.js        background music engine and moods
  vfx.js          spotlight, confetti, shake, flash
  helpers.js      shared helpers, go(), deal()
  timer.js        discussion timer, screen wake lock
  views.js        Setup, Roles, Timer, Vote, Result screens
  settings.js     settings panel and host PIN lock
  main.js         startup, shortcuts, first render
```

## Common edits

- Add question pairs: `js/words.js`
- Change default timer, volume, theme: the `cfg` line in `js/state.js`
- Change music style or tempo: the `MOODS` table in `js/music.js`
- Add or tweak sound effects: the `sfx` object in `js/audio.js`
- Change colors: variables at the top of `css/theme.css`
- Change a screen’s layout or text: its function in `js/views.js`

Scripts share globals, so keep the load order in `index.html`.
