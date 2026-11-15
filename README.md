# HamoudiX Motion 🎮✨

حزمة الموشن جرافيك والأنيميشن لقناة **HamoudiX** (تختيم GTA 6 والألعاب • ريترو).
نفس أسلوب **SkyGaming-Motion** (Remotion): نفس الحركة (spring pop، نص يصعد من قناع، blur in/out، توهج، مؤثرات صوتية)،
لكن بهوية HamoudiX: بنفسجي غامق، وردي نيون، سماوي، شرارات، وخطوط "circuit" من البانر.

## التشغيل

```bash
npm install
npm run studio            # معاينة وتعديل كل العناصر
npm run render:intro      # out/HamoudiX_Intro.mp4  (انترو القناة 4.5 ث)
npm run render:showcase   # out/HamoudiX_Showcase.mp4 (ديمو لكل الأساليب)
npm run still:thumb       # out/HamoudiX_Thumbnail.jpg (قالب الصورة المصغرة 1280×720)
```

الخطوط محفوظة داخل `public/fonts` (تعمل بدون إنترنت). المقاس **1920×1080 / 30fps** (لقطات الكونسول).

## العناصر

| الملف | العناصر | من SkyGaming؟ |
|---|---|---|
| `brand.tsx` | `Intro` (انترو اللوغو + X نيون + شرارات)، `Wordmark`، `Mascot` (شخصية القناة مقصوصة)، `Subscribe`، `Persistent` (علامة مائية + شريط تقدم)، `EndScreen` | نفس الفكرة، تصميم جديد |
| `elements.tsx` | `Reveal` (BOOM عند ذكر لعبة/جهاز)، `Hook`، `LowerThird`، `Chapter`، `Punch`، `BigStat`، `Warning`، `TimeSkip`، `Countdown`، `QBoard`، `Versus`، `WallTimeline`، `Corkboard`، `MemeCard` | ✅ نفس الأساليب |
| `fx.tsx` | `Stage` (neon / mist / pink / galaxy / cork / dark)، `Kinetic` (نص متزامن مع الصوت)، `Float`، `Scene`، `Stamp`، `Sparks`، `Circuit`، `Grain`، `Sfx` | ✅ نفس الأسلوب الوثائقي |
| `walkthrough.tsx` | **جديد للتختيم:** `EpisodeTag` (رقم الحلقة)، `MissionStart` (بطاقة المهمة + الأهداف)، `Objective` (هدف جديد / تم)، `MissionComplete` (المهمة نجحت + المكافأة)، `ProgressRing` (نسبة التختيم %)، `Gameplay` | 🆕 |

## استعمال لقطاتك

ضع الفيديو في `public/gameplay/ep01.mp4` ثم:

```tsx
<Gameplay src="gameplay/ep01.mp4" />
```

بدون `src` يظهر مشهد مدينة نيون مؤقت (placeholder) للمعاينة فقط.

## ملاحظات
- المؤثرات الصوتية في `public/sfx` مولّدة (whoosh, pop, boom, ding, click, riser, glitch, impact). يمكنك استبدالها بملفات من حزمة الملحقات بنفس الأسماء.
- `public/brand/mascot.png` مقصوصة من صورة القناة بدون تغيير الملامح.

## الفيديوهات الجاهزة (`videos/`)
- `HamoudiX_Intro.mp4` — انترو القناة (4.5 ث)
- `HamoudiX_Showcase.mp4` — ديمو لكل أساليب الموشن (1:31)
- `HamoudiX_Thumbnail.jpg` — قالب الصورة المصغرة
