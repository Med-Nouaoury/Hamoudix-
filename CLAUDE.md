# HamoudiX — channel & motion project (handoff notes for Claude)

Arabic gaming YouTube channel **HamoudiX** — "GAMING • WALKTHROUGHS • RETRO".
Main series right now: **full GTA 6 walkthrough (تختيم GTA 6)** + Shorts around the launch.
The owner talks to Claude in **Arabic** (Moroccan Darija / Fusha). Answer in Arabic unless asked otherwise.
Same owner also runs the older channel **Sky Gaming** (project `SkyGaming-Motion` on their PC, `C:\Users\simon\Desktop\Youtube\`).

## How the owner wants to work (non-negotiable)
1. **Before any edit: present the full plan** (montage, motion, memes, sound, moment by moment) and **wait for "OK"**.
2. **Never lower / duck the owner's voice.** Voice is always on top; music sits low under it.
3. **Never "underwater" audio**: do NOT use `afftdn` (or any denoiser) and do NOT speed the voice (`atempo`). Only: cut silences, `highpass=70`, light presence EQ (+2 dB @3.5 kHz), soft compression, `loudnorm I=-14`.
4. "Pro" means: fast cuts (something changes every 1–2 s), cinematic dark look, real assets (real gameplay/trailer clips, real product photos, real photos), word-by-word captions synced to the voice, strong hook in the first 2 s, loop at the end of Shorts.
   Flat "UI cards" / generic templates / cartoon placeholders = rejected as "not professional".
5. Follow the owner's script beat by beat when they give one.
6. Any game / console / app / company mentioned → show it (cover, product shot or logo) with a motion pop.
7. Memes: 1–2 s, no profanity, Arabic first.
8. Be honest about facts on screen (label old photos, don't invent claims; flag risky claims before publishing).

## Brand
- Avatar + banner: `public/brand/avatar_full.jpg`, `public/brand/banner.jpg`; mascot cut-out `public/brand/mascot.png` (never alter the face).
- Palette (`src/theme.ts`): night `#0e0418`, plum `#2a0b4a`, violet `#6a1fb0`, pink `#ff2fa0`, cyan `#36e0ff`, gold `#ffc94d`; Shorts captions use white + active word yellow `#ffe14d` with thick black stroke.
- Fonts (self-hosted in `public/fonts`, loaded by `src/fonts.ts`): Lalezar (Arabic display), IBM Plex Sans Arabic, Bebas Neue, Oswald, Russo One (wordmark).

## Project (Remotion 4.0.542)
- `npm install`, `npm run studio`.
- Long-form kit (16:9): `src/brand.tsx` (Intro, Wordmark, Mascot, Subscribe, EndScreen, Persistent), `src/elements.tsx` (Reveal/BOOM, Hook, LowerThird, Chapter, Punch, BigStat, Warning, TimeSkip, Countdown, QBoard, Versus, WallTimeline, Corkboard, MemeCard), `src/fx.tsx` (Stage doc backgrounds, Kinetic text, Float, Scene, Stamp, Sparks, Circuit, Sfx), `src/walkthrough.tsx` (EpisodeTag, MissionStart, Objective, MissionComplete, ProgressRing, Gameplay).
- Shorts (1080x1920): `src/shorts/kit.tsx` (shared pieces), `Short01.tsx` (3 days to GTA 6), `Short02Pro.tsx` (why not one-second worldwide launch — the approved "pro" style), `Short01Thumb.tsx` (thumbnails). `Short02.tsx` is the rejected first attempt (keep as reference of what NOT to do).
- Compositions registered in `src/Root.tsx`.
- Render (cloud used the Playwright headless shell; on Windows plain `npx remotion render` works):
  `npx remotion render Short02Pro out/raw.mp4 --crf=17` then
  `ffmpeg -i out/raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=9 -c:a aac -b:a 256k videos/<name>.mp4`
- Deliverables live in `videos/`.

## Assets in `public/`
- `art/gta6_ultimate.jpg` (Ultimate Edition cover) + panel crops `art/p_*.jpg` (Jason & Lucia, heli, bike, car, boat, gunman).
- `art/ps5.png`, `art/xbox.png` (clean cut-outs), `art/queue_gta5.jpg` (REAL launch-night queue, GTA V 2013 at GAME — label it as such).
- `clips/gta6_robbery.mp4` (20 s GTA 6 footage, muted).
- `sfx/*.wav` are synthesized placeholders (whoosh, pop, boom, impact, riser, glitch, ding, click, tick, fire, ring). Better: replace with real SFX from the owner's pack `ملحقات المونتاج` (same file names).
- `shorts/*_voice.wav` processed voices, `shorts/*_music.wav` generated beds (drop/silence placed on key beats).

## Voice pipeline (what worked)
1. Transcribe with faster-whisper `medium`, `language='ar'`, `word_timestamps=True` (pass a numpy array, CPU int8).
2. Silence gate (-40 dB, ≥0.16 s) → cut with 0.05 s pads, tiny fades.
3. Re-transcribe the processed voice for exact word timings → captions + every motion beat keyed to words.
4. Fix Whisper's Arabic mistakes by hand in the caption text.

## GTA 6 facts used (re-check before publishing)
- Release **19 Nov 2026**, PS5 / Xbox Series X|S, PC not announced. Unlocks at local midnight per region (PS5; US storefront keyed to Eastern time). New Zealand first.
- Standard $79.99 / Ultimate $99.99 (secondary sources).

## Open items
- Short 01 voice still went through `afftdn` → re-process its voice with the clean chain and re-render.
- Short 02 line «يمكنك تغيير توقيت جهازك» — the known trick is a New Zealand store account, not just the clock; owner may re-record.
- Next: thumbnails for Short 02, more launch Shorts, then EP01 of the walkthrough (send gameplay → plan → OK → edit).
