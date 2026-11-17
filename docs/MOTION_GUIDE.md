# HamoudiX — Motion Graphics Guide

How HamoudiX motion is built, what the owner approved, and what was rejected.
Code lives in `src/`; this file explains the *style* so any new edit matches it.

---

## 1. The approved "PRO" look (Short 02 PRO = reference)
- **Cinematic dark**: near-black backgrounds (`#050307`, `#06030b`), one strong accent per shot (red for danger, pink for brand, yellow for highlights, navy for maps / New Zealand).
- **Real assets first**: real gameplay clips, real product cut-outs (PS5, Xbox), real photos, real cover art. Graphics sit *on top of* reality.
- **Hard cuts every 1–3 s**, each cut hit by a **Glitch** (RGB bars + 1-frame white flash) and an SFX.
- **Camera is alive**: every shot slowly pushes in (`Cam push 0.05–0.12`), and every impact shakes it (30 px decaying over 14 frames + 6-frame zoom punch).
- **Everything keyed to a word** of the voice (Whisper word timings → frame numbers in a `B = {...}` beat table).
- **Loop**: the last 10 frames dissolve into the first shot so the Short replays seamlessly.
- Film noise overlay (`opacity .07`, overlay blend) + vignette on every frame.

### Rejected (do NOT do this again)
- Bright purple neon grid floor + rays on every shot (looked like a template).
- Flat "app UI" cards for everything, emoji as main visuals, cartoon placeholders when real assets exist.
- Slow pacing (gaps between words), one shot lasting 5+ s with nothing new.
- Denoised / sped-up voice ("under water").

---

## 2. Motion vocabulary (timings @30 fps)
| Move | How | Where |
|---|---|---|
| **Pop / slam** | `spring({damping: 8–9, stiffness: 240–300})`, scale 2–2.6 → 1 | numbers, stamps, titles on impact |
| **Smooth enter** | `spring({damping: 12–14, stiffness: 140})`, translateY 60–300 px → 0 | cards, products |
| **Expo ease** | `Easing.bezier(0.16,1,0.3,1)` (out), `(0.83,0,0.17,1)` (in-out) | counters, pans, wipes |
| **Mask rise** | text in `overflow:hidden`, translateY 110% → 0 | titles in Reveal / MissionStart |
| **Blur-zoom transition** | scale 1.25→1 + blur 26→0 in 8 f; out: scale +0.3, blur 26 in 6 f | `Shot` wrapper (Short 01) |
| **Glitch cut** | 9 random colour bars ±300 px for 7 frames + white flash on the cut frame | every hard cut (Short 02 PRO) |
| **Impact** | white flash 0.85→0 in 9 f + particle burst (80–120 sparks) + shockwave ring + shake | reveals, "BOOM" moments |
| **Stamp** | rotate −10…−14°, scale 2.4→1, thick border, red | "كارثة", "503", "غير مؤكد" |
| **Counter** | value eased with expo-out over 30–40 f, blur (1−k)·6 px while spinning | 50,000,000, 3 days, 24H, +12H |
| **3D product** | `perspective(1600px) rotateY(100→−10)` + sheen sweep + drop-shadow glow | cover reveal |
| **Ken Burns** | slow translate/scale over the shot | photos (queue), key art |

---

## 3. Captions (Shorts)
- 2–4 words per page, one page per phrase, words appear exactly on their Whisper time.
- Font Lalezar 100 px (Latin words: Bebas 128 px), **white, active word yellow `#ffe14d`**, scale 1.12 on the active word.
- 10 px black stroke (`paint-order: stroke fill`) + soft drop shadow.
- Position `top: 1300` (centre-lower, clear of YouTube's right-side buttons and bottom UI).
- Hidden during black/ERROR screens and when a big title says the same thing.
- Fix Whisper's Arabic by hand; merge Latin tokens ("GTA 6" as one word so RTL doesn't flip it).

---

## 4. Sound design rules
- Voice on top, never ducked. Music bed at volume ~0.12–0.13.
- **Music cuts to silence** right before the biggest moment (e.g. black ERROR screen), then **drops back** with kick + 808 on the next beat.
- One SFX per visual event: whoosh (cuts), impact/boom (slams), riser (before reveals), glitch (errors), click (button/hand taps), tick (clocks/counters), ding (info), fire (burning), ring (after explosion).
- Final mix `loudnorm I=-14 TP=-1`.

---

## 5. Building blocks (where to find them)
### Shorts (vertical 1080x1920)
- `src/shorts/kit.tsx`: `Captions`, `TopBar` (progress line), `BG`, `CoverBG` (blurred real art), `Embers`, `Burst`, `FlashAt`, `Shot`, `Mascot`.
- `src/shorts/Short02Pro.tsx` (reference implementation): `Cam`, `Glitch`, `Noise`, `Kicker` (REASON 01 tag + big title), `Button` (3D LAUNCH), `ErrorShot`, `DataRain`, `Counter`, `ScreenWall` (gameplay tiles multiplying), `BurningConsole` + `Flames`, `MapShot` (real world map via world-atlas + d3-geo, midnight sweep, pins), queue photo pan, `FlipDigit` clock, `Firework`, `DawnShot`, `NZFlag` (SVG, waving slices), `SettingsShot` (console time-zone list), `SubShot`, `AskShot` (split screen + loop).
- `src/shorts/Short01.tsx`: countdown hook, locked #1 card + `Mosaic` of panels, 3D cover reveal, legendary gold beat, subscribe, EP cards.

### Long videos (16:9 1920x1080)
- `src/elements.tsx`: `Reveal` (BOOM on any mention: 3D product + kicker + mask title), `Hook`, `LowerThird`, `Chapter`, `Punch`, `BigStat`, `Warning`, `TimeSkip`, `Countdown`, `QBoard` (question board + mascot), `Versus`, `WallTimeline` (3D wall with camera dolly), `Corkboard` (investigation board with red strings + stamp), `MemeCard`.
- `src/fx.tsx`: `Stage` backgrounds (neon / mist / pink / galaxy / cork / dark), `Kinetic` (narration phrases, key word highlighted), `Float`, `Scene`, `Stamp`, `Sparks`, `Circuit`.
- `src/walkthrough.tsx` (for the تختيم series): `EpisodeTag`, `MissionStart` (letterbox + MISSION 01 + objectives), `Objective` toast (new / done), `MissionComplete` (+$ reward, stars), `ProgressRing` (completion %), `Gameplay` (use `src` = the real recording).
- `src/brand.tsx`: `Intro` (4.5 s), `Wordmark`, `Mascot`, `Subscribe`, `Persistent` (watermark + progress bar), `EndScreen`.

### When to use what (long videos)
- Hook (first 3–4 s) → Intro → Chapter + LowerThird at each new part.
- Any game/console/app/company named → `Reveal`.
- Explaining / story → documentary stage (`WallTimeline`, `Corkboard`, `Versus`, `Kinetic`) may fully replace gameplay for 10–20 s.
- Walkthrough: `EpisodeTag` at start, `MissionStart` at each mission, `Objective` on new goals, `MissionComplete` on success, `ProgressRing` every few missions, `TimeSkip` over boring parts, `Punch`/`MemeCard` on funny or shocking moments, `Subscribe` after the first value (~1–2 min), `EndScreen` last 10–15 s.

---

## 6. Recipe for a new Short
1. Owner sends voice (+ script). Transcribe → cut silences (no denoise, no speed) → re-transcribe → beat table `B`.
2. One shot per script beat; every 1–3 s something new; impact on key words.
3. Use real assets; ask the owner for clips/photos if missing.
4. Captions pages from the word list; music bed with silence + drop on the biggest beat; SFX per event.
5. Render stills every ~2 s, check layout/overlaps, fix, then full render + `loudnorm`.
6. Deliver with title, description, tags, pinned-comment question, thumbnail.
