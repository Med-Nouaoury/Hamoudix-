import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
import {Gamepad2, Monitor, Joystick} from 'lucide-react';
import {C, fonts, neon} from './theme';
import {Grain, Sfx, Vignette} from './fx';
import {INTRO_LEN, EndScreen, Intro, Persistent, Subscribe} from './brand';
import {BigStat, Chapter, Corkboard, Countdown, Hook, LowerThird, MemeCard, Punch, QBoard, Reveal, TimeSkip, Versus, WallTimeline, Warning} from './elements';
import {EpisodeTag, Gameplay, MissionComplete, MissionStart, Objective, ProgressRing} from './walkthrough';

/* Small neon card used as a prop inside the documentary scenes */
const Card: React.FC<{icon: 'pad' | 'pc' | 'joy'; label: string; color?: string; w?: number}> = ({icon, label, color = C.pink, w = 260}) => {
  const I = icon === 'pc' ? Monitor : icon === 'joy' ? Joystick : Gamepad2;
  return (
    <div style={{width: w, height: w * 0.9, borderRadius: 28, background: `linear-gradient(150deg, ${C.plum}, ${C.night})`, border: `3px solid ${color}`,
      boxShadow: `${neon(color, 0.6)}, 0 30px 50px rgba(0,0,0,.4)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
      <I size={w * 0.42} color="#fff" strokeWidth={1.5} />
      <div style={{fontFamily: fonts.display, fontSize: w * 0.2, color: '#fff', letterSpacing: 3}}>{label}</div>
    </div>
  );
};
const BannerCrop: React.FC<{pos: string; zoom?: number}> = ({pos, zoom = 1.6}) => (
  <Img src={staticFile('brand/banner.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${zoom})`}} />
);

/* ---------------- timeline (30 fps) ---------------- */
const HOOK = 120;
const GP1 = 1200;
const WALL = 210, QB = 180, VS = 170, CORK = 180, CD = 90, GP2 = 260, END = 180;
let t = 0;
const at = (d: number) => {
  const s = t;
  t += d;
  return s;
};
const T = {intro: at(INTRO_LEN), hook: at(HOOK), gp1: at(GP1), wall: at(WALL), qb: at(QB), vs: at(VS), cork: at(CORK), cd: at(CD), gp2: at(GP2), end: at(END)};
export const SHOWCASE_LEN = t;

export const Showcase: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {/* 1. channel intro */}
    <Sequence from={T.intro} durationInFrames={INTRO_LEN}><Intro /></Sequence>

    {/* 2. cold-open hook */}
    <Sequence from={T.hook} durationInFrames={HOOK}>
      <Hook dur={HOOK} big="100%" line="تختيم كامل بدون توقف!" chips={['كل المهمات 🎯', 'كل الأسرار 🔑', 'حلقة يومياً 📅']} bg={<Gameplay />} />
      <Sfx n="boom" at={2} v={0.6} /><Sfx n="pop" at={36} /><Sfx n="pop" at={46} /><Sfx n="pop" at={56} />
    </Sequence>

    {/* 3. gameplay with overlays (walkthrough elements) */}
    <Sequence from={T.gp1} durationInFrames={GP1}>
      <Gameplay />
      <Sequence from={10} durationInFrames={150}><EpisodeTag dur={150} series="تختيم GTA 6" ep={1} /></Sequence>
      <Sequence from={30} durationInFrames={150}><MissionStart dur={150} n={1} title="البداية في المدينة" objectives={['اركب السيارة', 'اتبع الهدف على الخريطة']} /></Sequence>
      <Sequence from={195} durationInFrames={100}><Objective dur={100} text="اذهب إلى الميناء" /></Sequence>
      <Sequence from={305} durationInFrames={110}><Reveal dur={110} item={{kind: 'chip', label: 'PS5'}} kicker="PLATFORM" title="PLAYSTATION 5" latinTitle sub="ألعب على أعلى إعدادات" /></Sequence>
      <Sequence from={425} durationInFrames={110}><LowerThird dur={110} name="حمودي" role="HamoudiX • تختيم وريترو" /></Sequence>
      <Sequence from={545} durationInFrames={50}><Punch dur={50} text="مستحيل!" /></Sequence>
      <Sequence from={605} durationInFrames={60}><MemeCard dur={60} txt="شنو هادشي؟! 😂" /></Sequence>
      <Sequence from={675} durationInFrames={100}><Chapter dur={100} n="02" title="مطاردة على الشاطئ" /></Sequence>
      <Sequence from={785} durationInFrames={90}><Objective dur={90} text="اذهب إلى الميناء" kind="done" /></Sequence>
      <Sequence from={880} durationInFrames={120}><ProgressRing dur={120} from={0} to={37} /></Sequence>
      <Sequence from={1005} durationInFrames={90}><Warning dur={90} title="انتبه! نقطة حفظ" sub="احفظ اللعبة قبل هذه المهمة" /></Sequence>
      <Sequence from={1100} durationInFrames={100}><TimeSkip dur={100} text="بعد ساعة…" /></Sequence>
      <Persistent total={GP1} chapters={[675]} />
      <Sfx n="whoosh" at={10} /><Sfx n="riser" at={20} v={0.3} /><Sfx n="boom" at={34} v={0.45} /><Sfx n="ding" at={195} v={0.35} />
      <Sfx n="impact" at={305} v={0.5} /><Sfx n="whoosh" at={425} /><Sfx n="boom" at={545} v={0.5} /><Sfx n="pop" at={605} />
      <Sfx n="whoosh" at={675} /><Sfx n="ding" at={795} v={0.35} /><Sfx n="click" at={880} /><Sfx n="glitch" at={1005} v={0.3} /><Sfx n="whoosh" at={1100} />
    </Sequence>

    {/* 4. documentary stages (motion replaces gameplay while explaining) */}
    <Sequence from={T.wall} durationInFrames={WALL}>
      <WallTimeline dur={WALL}
        stops={[
          {year: '2013', label: 'الجزء السابق', node: <Card icon="pad" label="PS3" color={C.violet} />},
          {year: '2026', label: 'PS5 • XBOX SERIES', hot: true, node: <Card icon="pad" label="PS5" />},
          {year: '؟؟', label: 'PC', node: <Card icon="pc" label="PC" color={C.cyan} />},
        ]}
        stamp={{at: 150, text: 'غير مؤكد'}}
        phrases={[{at: 8, t: 'انتظرنا سنوات طويلة'}, {at: 70, t: 'والآن وصلت أخيراً', hi: 'أخيراً'}, {at: 140, t: 'ونسخة الـ PC؟', hi: 'PC؟'}]} />
      <Sfx n="whoosh" at={0} /><Sfx n="boom" at={150} v={0.45} />
    </Sequence>
    <Sequence from={T.qb} durationInFrames={QB}>
      <QBoard dur={QB} title="خطة السلسلة" items={['تختيم القصة كاملة', 'كل المهمات الجانبية', 'الأسرار والإيستر إيغ']} done={1} active={2} />
      <Sfx n="whoosh" at={0} /><Sfx n="pop" at={8} /><Sfx n="pop" at={16} /><Sfx n="pop" at={24} /><Sfx n="ding" at={40} v={0.35} />
    </Sequence>
    <Sequence from={T.vs} durationInFrames={VS}>
      <Versus dur={VS} a={<Card icon="joy" label="RETRO" color={C.violet} w={320} />} b={<Card icon="pad" label="NEXT-GEN" w={320} />} aLabel="الكلاسيكي" bLabel="الجديد" winAt={110}
        phrases={[{at: 10, t: 'الريترو ضد الجيل الجديد'}, {at: 100, t: 'والفائز هو…', hi: 'الفائز'}]} />
      <Sfx n="whoosh" at={0} /><Sfx n="boom" at={18} v={0.45} /><Sfx n="ding" at={110} v={0.35} />
    </Sequence>
    <Sequence from={T.cork} durationInFrames={CORK}>
      <Corkboard dur={CORK} center={<BannerCrop pos="50% 50%" zoom={1.3} />} stampAt={120} stamp="السر: هنا!"
        pins={[
          {x: 430, y: 270, cap: 'المكان', node: <BannerCrop pos="20% 50%" />},
          {x: 470, y: 760, cap: 'الدليل', node: <BannerCrop pos="35% 60%" />},
          {x: 1500, y: 270, cap: 'المفتاح', node: <BannerCrop pos="78% 50%" />},
          {x: 1460, y: 780, cap: 'النتيجة', node: <BannerCrop pos="65% 40%" />},
        ]}
        phrases={[{at: 10, t: 'كيف تحصل على السلاح السري؟'}, {at: 120, t: 'الجواب هنا!', hi: 'هنا!'}]} />
      <Sfx n="whoosh" at={0} /><Sfx n="pop" at={8} /><Sfx n="pop" at={14} /><Sfx n="pop" at={20} /><Sfx n="pop" at={26} /><Sfx n="boom" at={120} v={0.5} />
    </Sequence>
    <Sequence from={T.cd} durationInFrames={CD}>
      <Gameplay />
      <Countdown dur={CD} from={60} to={10} label="ثواني فقط!" sub="لإنهاء المهمة" />
      <Sfx n="click" at={4} /><Sfx n="boom" at={34} v={0.45} />
    </Sequence>

    {/* 5. mission complete + subscribe */}
    <Sequence from={T.gp2} durationInFrames={GP2}>
      <Gameplay />
      <Sequence from={0} durationInFrames={120}><MissionComplete dur={120} reward={25000} rating={3} /></Sequence>
      <Sequence from={120} durationInFrames={140}><Subscribe dur={140} /></Sequence>
      <Sequence from={130} durationInFrames={100}><BigStatMini /></Sequence>
      <Persistent total={GP2} />
      <Sfx n="impact" at={0} v={0.6} /><Sfx n="ding" at={30} v={0.4} /><Sfx n="click" at={146} /><Sfx n="click" at={172} /><Sfx n="ding" at={196} v={0.3} />
    </Sequence>

    {/* 6. end screen */}
    <Sequence from={T.end} durationInFrames={END}>
      <Gameplay />
      <EndScreen dur={END} line="نلتقي في الحلقة القادمة 👋" />
      <Sfx n="whoosh" at={0} />
    </Sequence>

    <Vignette strength={0.35} />
    <Grain opacity={0.05} />
  </AbsoluteFill>
);

/* tiny top banner during subscribe, reusing BigStat look would cover the CTA, so keep a small label */
const BigStatMini: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 90, color: '#fff', direction: 'rtl',
    textShadow: neon(C.pink, 0.8)}}>إذا عجبك التختيم ❤️</div>
);

/* standalone single-element preview of BigStat (kept for the Studio) */
export const StatDemo: React.FC = () => (
  <AbsoluteFill><Gameplay /><BigStat dur={120} value={100} unit="%" label="تختيم كامل" /></AbsoluteFill>
);
