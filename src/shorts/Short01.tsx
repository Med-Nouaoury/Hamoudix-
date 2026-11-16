import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BellRing, Crown, Lock, ThumbsUp, Trophy} from 'lucide-react';
import {C, clamp, ease, fonts, neon, prog, spr} from '../theme';
import {Grain, Sfx} from '../fx';

/* =====================================================================
   SHORT 01 — "3 أيام على GTA 6" (1080x1920, 30 fps, ~22 s)
   Voice: Recording_17 (cleaned, trimmed 0.45 s) • synced music bed with a
   drop on the reveal • word-by-word captions • 6 beats, something new
   on screen every 1–2 s.
   ===================================================================== */
export const SW = 1080, SH = 1920;
const OFF = 0.45;
const T = (sec: number) => Math.round((sec - OFF) * 30); // raw recording seconds → frame
export const SHORT01_LEN = 658;

/* ---------- beats (frames) ---------- */
const B = {
  three: T(2.5),
  aqwa: T(4.82),
  wahiya: T(7.52),
  gta: T(8.26),
  d: T(9.52),
  akhiran: T(11.3),
  ostora: T(13.34),
  sub: T(14.3),
  subClick: T(17.46),
  likeClick: T(18.88),
  end: T(19.6),
};

/* ---------- captions (word timings from Whisper, text corrected) ---------- */
type Wd = {t: string; s: number; hi?: boolean};
const PAGES: Wd[][] = [
  [{t: 'لا', s: 0.45}, {t: 'أصدق', s: 0.76}, {t: 'يا', s: 1.3}, {t: 'شباب', s: 1.42}],
  [{t: 'تقريباً', s: 1.8}, {t: '3', s: 2.5, hi: true}, {t: 'أيام', s: 3.62, hi: true}],
  [{t: 'على', s: 4.08}, {t: 'صدور', s: 4.32}],
  [{t: 'أقوى', s: 4.82, hi: true}, {t: 'لعبة', s: 5.58}, {t: 'في', s: 5.92}, {t: 'تاريخ', s: 6.12}, {t: 'الألعاب', s: 6.54}],
  [{t: 'كلها', s: 7.0}, {t: 'وهي', s: 7.52}, {t: 'لعبة…', s: 7.88}],
  [], // GTA 6 reveal: no captions, the screen talks
  [{t: 'لا', s: 9.52}, {t: 'أصدق', s: 9.72}, {t: 'صراحةً', s: 10.34}],
  [{t: 'أننا', s: 10.86}, {t: 'أخيراً', s: 11.3, hi: true}],
  [{t: 'سنلعب', s: 12.06}, {t: 'اللعبة', s: 13.0}, {t: 'الأسطورية', s: 13.34, hi: true}],
  [{t: 'لذلك', s: 14.3}, {t: 'يا', s: 14.8}, {t: 'شباب', s: 14.96}],
  [{t: 'حتى', s: 15.62}, {t: 'لا', s: 15.96}, {t: 'تفوتوا', s: 16.2}, {t: 'أي', s: 16.68}, {t: 'شيء', s: 16.88}],
  [{t: 'اشتركوا', s: 17.06, hi: true}, {t: 'واضغطوا', s: 18.06}, {t: 'لايك', s: 18.88, hi: true}],
  [{t: 'وانتظروا', s: 19.6}, {t: 'الفيديوهات', s: 20.18}, {t: 'القادمة', s: 20.68}],
  [{t: 'بحول', s: 21.34}, {t: 'الله', s: 21.74, hi: true}],
];
const PAGE_START = PAGES.map((p, i) => (p.length ? T(p[0].s) : B.gta));
const pageEnd = (i: number) => (i + 1 < PAGES.length ? PAGE_START[i + 1] : SHORT01_LEN);

const Captions: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  let pi = -1;
  PAGE_START.forEach((s, i) => {
    if (f >= s) pi = i;
  });
  if (pi < 0 || !PAGES[pi].length) return null;
  const page = PAGES[pi];
  const end = pageEnd(pi);
  const out = prog(f, end - 3, end, ease.in);
  let act = -1;
  page.forEach((w, i) => {
    if (f >= T(w.s)) act = i;
  });
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl', gap: '6px 22px',
      opacity: 1 - out, transform: `scale(${1 - 0.08 * out})`}}>
      {page.map((w, i) => {
        const st = T(w.s);
        if (f < st) return null;
        const s = spr(f, fps, st, {damping: 10, stiffness: 260});
        const isAct = i === act;
        const lat = /^[0-9A-Za-z]+$/.test(w.t);
        const col = w.hi ? (isAct ? '#fff' : C.gold) : '#fff';
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', fontFamily: lat ? fonts.display : fonts.arDisplay, fontSize: lat ? 150 : 108,
            lineHeight: 1.15, color: col, direction: lat ? 'ltr' : 'rtl', padding: '0 14px',
            transform: `scale(${interpolate(s, [0, 1], [0.4, isAct ? 1.08 : 1])}) rotate(${isAct ? -2 : 0}deg)`,
            WebkitTextStroke: '3px #12021f', paintOrder: 'stroke fill',
            textShadow: '0 8px 0 #12021f, 0 14px 30px rgba(0,0,0,.6)'}}>
            {isAct && w.hi && (
              <span style={{position: 'absolute', inset: '8px 0 4px', borderRadius: 18, background: C.pink, zIndex: -1, boxShadow: neon(C.pink, 0.8),
                transform: `scaleX(${spr(f, fps, st, {damping: 14, stiffness: 300})})`}} />
            )}
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- shared vertical background ---------- */
const BG: React.FC<{tint?: string; rays?: number; shake?: number}> = ({tint = C.pink, rays = 0, shake = 0}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 40%, ${tint}aa 0%, #4a0f73 45%, ${C.night} 100%)`, overflow: 'hidden',
      transform: `translate(${Math.sin(f * 2.3) * shake}px, ${Math.cos(f * 1.7) * shake}px)`}}>
      <AbsoluteFill style={{opacity: rays, mixBlendMode: 'screen', transform: `rotate(${f * 0.5}deg) scale(2.4)`,
        background: 'repeating-conic-gradient(from 0deg at 50% 42%, rgba(255,255,255,.22) 0deg 5deg, transparent 5deg 16deg)'}} />
      {/* perspective neon floor */}
      <div style={{position: 'absolute', left: -SW, right: -SW, top: 1250, height: 1300, transformOrigin: '50% 0%', transform: 'perspective(600px) rotateX(68deg)',
        backgroundImage: `linear-gradient(${tint} 2px, transparent 2px), linear-gradient(90deg, ${tint} 2px, transparent 2px)`, backgroundSize: '140px 140px',
        backgroundPosition: `0 ${f * 6}px`, opacity: 0.35}} />
      <Embers />
    </AbsoluteFill>
  );
};
const Embers: React.FC<{n?: number}> = ({n = 45}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const r = (k: string) => random(`se${k}${i}`);
        const life = 80 + r('l') * 120;
        const t = (f + r('o') * life) % life;
        const x = r('x') * SW + Math.sin(t / 12 + i) * 20;
        const y = SH + 40 - t * (6 + r('v') * 10);
        const col = r('c') > 0.5 ? C.ember : C.hot;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 3 + r('w') * 4, height: 10 + r('h') * 16, borderRadius: 3, background: col,
          opacity: Math.sin((t / life) * Math.PI) * 0.8, boxShadow: `0 0 10px ${col}`}} />;
      })}
    </AbsoluteFill>
  );
};
const Burst: React.FC<{at: number; cx?: number; cy?: number; n?: number; seed: string}> = ({at, cx = SW / 2, cy = 760, n = 80, seed}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 70) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: cx, top: cy, width: 1600 * prog(f, at, at + 18), height: 1600 * prog(f, at, at + 18), borderRadius: '50%',
        transform: 'translate(-50%,-50%)', border: `10px solid #fff`, opacity: 1 - prog(f, at, at + 18)}} />
      {Array.from({length: n}).map((_, i) => {
        const r = (k: string) => random(`${seed}${k}${i}`);
        const a = r('a') * Math.PI * 2;
        const d = (14 + r('v') * 30) * t * Math.exp(-t / 24) * 1.5;
        const col = r('c') > 0.5 ? C.ember : r('c') > 0.2 ? C.hot : '#fff3c4';
        return <div key={i} style={{position: 'absolute', left: cx + Math.cos(a) * d, top: cy + Math.sin(a) * d + t * t * 0.05, width: 6 + r('l') * 22, height: 4,
          borderRadius: 2, background: col, transform: `rotate(${(a * 180) / Math.PI}deg)`, opacity: Math.max(0, 1 - t / (35 + r('t') * 35)), boxShadow: `0 0 10px ${col}`}} />;
      })}
    </AbsoluteFill>
  );
};
const FlashAt: React.FC<{at: number; max?: number; len?: number}> = ({at, max = 0.85, len = 9}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [at, at + 2, at + len], [0, max, 0], clamp), pointerEvents: 'none'}} />;
};
/* scene wrapper with zoom-blur transition in/out (local frames) */
const Shot: React.FC<{dur: number; children: React.ReactNode; zoom?: number}> = ({dur, children, zoom = 0.06}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 8, ease.out), o = prog(f, dur - 6, dur, ease.in);
  return (
    <AbsoluteFill style={{transform: `scale(${1.25 - 0.25 * i + 0.3 * o + zoom * (f / dur)})`, filter: `blur(${(1 - i) * 26 + o * 26}px)`, opacity: Math.min(1, i * 1.6) * (1 - o * 0.4)}}>
      {children}
    </AbsoluteFill>
  );
};
const Mascot: React.FC<{x: number; y: number; h: number; delay?: number; shake?: boolean; bubble?: string}> = ({x, y, h, delay = 0, shake, bubble}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spr(f, fps, delay, {damping: 9, stiffness: 170});
  const t = f - delay;
  const sq = t >= 0 && t < 14 ? 1 + 0.12 * Math.sin((t / 14) * Math.PI) * Math.exp(-t / 10) : 1;
  const sh = shake && t > 0 && t < 20 ? Math.sin(t * 2.6) * 14 * (1 - t / 20) : 0;
  const bs = bubble ? spr(f, fps, delay + 10, {damping: 8, stiffness: 240}) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-100%) translate(${sh}px, ${(1 - s) * 700 + Math.sin(f / 13) * 8}px)`}}>
      <Img src={staticFile('brand/mascot.png')} style={{height: h, display: 'block', transformOrigin: '50% 100%', transform: `scaleX(${1 / sq}) scaleY(${sq})`,
        filter: `drop-shadow(0 0 40px ${C.pink}99) drop-shadow(0 30px 40px rgba(0,0,0,.5))`}} />
      {bubble && (
        <div style={{position: 'absolute', right: -40, top: h * 0.02, transform: `scale(${bs}) rotate(8deg)`, background: '#fff', borderRadius: 50, padding: '10px 30px',
          fontSize: h * 0.13, boxShadow: `0 0 0 6px ${C.pink}, 0 20px 40px rgba(0,0,0,.4)`}}>{bubble}</div>
      )}
    </div>
  );
};

/* ================= SHOT A — HOOK: countdown slams to 3 ================= */
const ShotA: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const land = B.three;
  const n = f < land ? Math.max(4, Math.round(interpolate(f, [0, land - 2], [30, 4], {...clamp, easing: ease.in}))) : 3;
  const hit = spr(f, fps, land, {damping: 7, stiffness: 260});
  const pre = f < land;
  const ring = prog(f, 0, land, ease.inOut);
  return (
    <Shot dur={dur}>
      <BG tint={C.pink} rays={f >= land ? 0.35 : 0.1} shake={f >= land && f < land + 12 ? 18 * (1 - (f - land) / 12) : 0} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', fontFamily: fonts.label, fontWeight: 600, fontSize: 44, color: C.cyan,
        letterSpacing: '0.45em', opacity: prog(f, 2, 12), textShadow: neon(C.cyan, 0.5)}}>COUNTDOWN</div>
      {/* ring */}
      <svg width={760} height={760} style={{position: 'absolute', left: SW / 2 - 380, top: 380, transform: `rotate(-90deg) scale(${pre ? 1 : 1 + 0.06 * Math.exp(-(f - land) / 6)})`}}>
        <circle cx={380} cy={380} r={340} stroke="rgba(255,255,255,.12)" strokeWidth={26} fill="none" />
        <circle cx={380} cy={380} r={340} stroke={C.pink} strokeWidth={26} fill="none" strokeLinecap="round" strokeDasharray={2 * Math.PI * 340}
          strokeDashoffset={2 * Math.PI * 340 * (1 - (pre ? ring : 0.9))} style={{filter: `drop-shadow(0 0 18px ${C.pink})`}} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 410, height: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{fontFamily: fonts.display, fontSize: pre ? 380 : 560, lineHeight: 0.8, color: '#fff', textShadow: neon(C.pink, pre ? 1 : 2.2),
          transform: `scale(${pre ? 1 : interpolate(hit, [0, 1], [2.4, 1])})`, filter: pre ? 'blur(1px)' : undefined}}>{n}</div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 130, color: C.gold, marginTop: -10, opacity: prog(f, land + 4, land + 12),
          transform: `translateY(${(1 - prog(f, land + 4, land + 14)) * 60}px)`, textShadow: '0 8px 0 #12021f'}}>أيام فقط!</div>
      </div>
      <Mascot x={SW / 2} y={SH + 60} h={460} delay={land + 6} shake bubble="😱" />
      <Burst at={land} seed="a" cy={760} />
      <FlashAt at={land} />
    </Shot>
  );
};

/* ================= SHOT B — "أقوى لعبة في التاريخ" : #1 locked card ================= */
const ShotB: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows = [
    {n: 3, w: 560, d: 10},
    {n: 2, w: 640, d: 22},
  ];
  const one = spr(f, fps, 34, {damping: 11, stiffness: 160});
  const glow = 0.6 + 0.4 * Math.sin(f / 4);
  return (
    <Shot dur={dur}>
      <BG tint={C.violet} rays={0.18} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 92, color: '#fff', direction: 'rtl',
        opacity: prog(f, 0, 10), textShadow: '0 8px 0 #12021f'}}>
        <Crown size={86} color={C.gold} style={{verticalAlign: 'middle', marginLeft: 16, filter: `drop-shadow(0 0 14px ${C.gold})`}} />
        أقوى لعبة في التاريخ
      </div>
      {/* #1 locked hero card */}
      <div style={{position: 'absolute', left: SW / 2, top: 700, transform: `translate(-50%,-50%) scale(${one}) rotate(${(1 - one) * -12}deg)`, width: 760, height: 330,
        borderRadius: 36, background: `linear-gradient(135deg, ${C.gold}, #ff9f1c)`, boxShadow: `0 0 ${60 * glow}px ${C.gold}, 0 40px 60px rgba(0,0,0,.5)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px', direction: 'ltr'}}>
        <div style={{fontFamily: fonts.display, fontSize: 230, color: '#1a1206', lineHeight: 1}}>#1</div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <Lock size={110} color="#1a1206" strokeWidth={2.4} style={{transform: `rotate(${Math.sin(f / 2) * (f > 70 ? 8 : 2)}deg)`}} />
          <div style={{fontFamily: fonts.display, fontSize: 64, color: '#1a1206', letterSpacing: 6}}>? ? ?</div>
        </div>
      </div>
      {rows.map((r, i) => {
        const s = spr(f, fps, r.d, {damping: 13});
        return (
          <div key={i} style={{position: 'absolute', left: SW / 2, top: 960 + i * 170, transform: `translate(-50%,0) translateX(${(1 - s) * (i ? 600 : -600)}px)`,
            width: r.w, height: 130, borderRadius: 26, background: 'rgba(255,255,255,.1)', border: '2px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center',
            gap: 30, padding: '0 34px', opacity: 0.75, filter: 'blur(1.5px)', direction: 'ltr'}}>
            <div style={{fontFamily: fonts.display, fontSize: 96, color: 'rgba(255,255,255,.8)'}}>#{r.n}</div>
            <div style={{flex: 1, height: 26, borderRadius: 13, background: 'rgba(255,255,255,.25)'}} />
          </div>
        );
      }).reverse()}
      <Trophy size={150} color={C.gold} style={{position: 'absolute', right: 70, top: 380, transform: `rotate(14deg) scale(${spr(f, fps, 44, {damping: 8})})`,
        filter: `drop-shadow(0 0 20px ${C.gold})`}} />
    </Shot>
  );
};

/* ================= SHOT C — THE REVEAL: GTA VI ================= */
const ShotC: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = B.gta - B.wahiya;
  const pre = f < hit;
  const s = spr(f, fps, hit, {damping: 8, stiffness: 200});
  const tense = prog(f, 0, hit);
  const letters = ['G', 'T', 'A'];
  return (
    <Shot dur={dur} zoom={0.12}>
      <AbsoluteFill style={{background: pre ? '#05010a' : undefined}}>
        {!pre && <BG tint={C.pink} rays={0.45} shake={f < hit + 14 ? 22 * (1 - (f - hit) / 14) : 0} />}
        {pre && (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            {/* tension: a dot of light growing, heartbeat */}
            <div style={{width: 40 + tense * 220, height: 40 + tense * 220, borderRadius: '50%', background: `radial-gradient(circle, #fff, ${C.pink} 40%, transparent 70%)`,
              opacity: 0.4 + 0.6 * Math.abs(Math.sin(f / 3)), transform: 'translateY(-200px)'}} />
          </AbsoluteFill>
        )}
        {!pre && (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: 'translateY(-180px)'}}>
            <div style={{display: 'flex', alignItems: 'flex-end', direction: 'ltr', transform: `scale(${interpolate(s, [0, 1], [3, 1])})`}}>
              {letters.map((l, i) => (
                <span key={i} style={{fontFamily: fonts.display, fontSize: 330, lineHeight: 0.85, color: '#fff', textShadow: neon(C.cyan, 1.2), letterSpacing: 4,
                  display: 'inline-block', transform: `translateY(${(1 - spr(f, fps, hit + i * 2, {damping: 9, stiffness: 260})) * -300}px)`}}>{l}</span>
              ))}
              <span style={{fontFamily: fonts.display, fontSize: 420, lineHeight: 0.85, marginLeft: 26,
                background: `linear-gradient(160deg, #ffd1ec, ${C.pink} 50%, #8a0f62)`, WebkitBackgroundClip: 'text', color: 'transparent',
                filter: `drop-shadow(0 0 30px ${C.pink}) drop-shadow(0 0 70px ${C.pink})`,
                transform: `scale(${spr(f, fps, hit + 8, {damping: 7, stiffness: 240})}) rotate(${(1 - spr(f, fps, hit + 8)) * 40}deg)`, display: 'inline-block'}}>VI</span>
            </div>
            <div style={{fontFamily: fonts.label, fontWeight: 600, fontSize: 46, color: '#fff', letterSpacing: '0.5em', marginTop: 30, opacity: prog(f, hit + 12, hit + 22)}}>
              19 • 11 • 2026
            </div>
          </AbsoluteFill>
        )}
        <Burst at={hit} seed="c" cy={780} n={120} />
        <FlashAt at={hit} max={1} len={12} />
      </AbsoluteFill>
    </Shot>
  );
};

/* ================= SHOT D — "أخيراً… الأسطورية" ================= */
const ShotD: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ak = B.akhiran - B.d;
  const os = B.ostora - B.d;
  const p = spr(f, fps, ak, {damping: 7, stiffness: 240});
  const gold = prog(f, os, os + 10);
  return (
    <Shot dur={dur}>
      <BG tint={gold > 0 ? '#ffb000' : C.pink} rays={0.15 + 0.4 * gold} />
      <Mascot x={SW / 2} y={1300} h={760} delay={0} />
      {f >= ak && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 210, color: '#fff', direction: 'rtl',
          transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) rotate(-4deg)`, opacity: Math.min(1, p * 2) * (1 - gold),
          textShadow: `0 10px 0 ${C.pink}, 0 20px 40px rgba(0,0,0,.6)`, WebkitTextStroke: '4px #12021f', paintOrder: 'stroke fill'}}>أخيراً!</div>
      )}
      {f >= os && (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', transform: `scale(${spr(f, fps, os, {damping: 9, stiffness: 220})})`}}>
            <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 48, color: '#fff', letterSpacing: '0.4em'}}>LEGENDARY</div>
            <div style={{fontFamily: fonts.arDisplay, fontSize: 170, color: C.gold, direction: 'rtl', lineHeight: 1.1,
              textShadow: `0 0 40px ${C.gold}, 0 10px 0 #3a2400`, WebkitTextStroke: '3px #3a2400', paintOrder: 'stroke fill'}}>الأسطورية 👑</div>
          </div>
          {/* release ticket */}
          <div style={{position: 'absolute', left: SW / 2, top: 1540, transform: `translate(-50%,0) translateY(${(1 - spr(f, fps, os + 8, {damping: 12})) * 300}px) rotate(-3deg)`,
            display: 'flex', alignItems: 'center', gap: 30, background: '#fff', borderRadius: 30, padding: '20px 40px', boxShadow: `0 0 40px ${C.gold}, 0 30px 50px rgba(0,0,0,.5)`,
            direction: 'rtl', border: `6px dashed ${C.pink}`}}>
            <div style={{fontFamily: fonts.arDisplay, fontSize: 64, color: C.night}}>موعد الصدور</div>
            <div style={{fontFamily: fonts.display, fontSize: 92, color: C.pink, direction: 'ltr'}}>19.11.2026</div>
          </div>
        </>
      )}
      <Burst at={os} seed="d" cy={330} n={70} />
      <FlashAt at={ak} max={0.5} len={7} />
    </Shot>
  );
};

/* ================= SHOT E — subscribe + like (big vertical CTA) ================= */
const ShotE: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = B.subClick - B.sub, lc = B.likeClick - B.sub;
  const subbed = f >= sc, liked = f >= lc;
  const cx = interpolate(f, [0, sc - 4, sc, lc - 8, lc, dur], [900, 560, 560, 300, 300, 420], {...clamp, easing: ease.inOut});
  const cy = interpolate(f, [0, sc - 4, sc, lc - 8, lc, dur], [1500, 860, 860, 1130, 1130, 1300], {...clamp, easing: ease.inOut});
  const tap = (at: number) => (f >= at && f < at + 6 ? 0.88 : 1);
  const ring = (at: number, x: number, y: number) => {
    const r = prog(f, at, at + 18);
    return r > 0 && r < 1 ? <div style={{position: 'absolute', left: x - 120 * r, top: y - 120 * r, width: 240 * r, height: 240 * r, borderRadius: '50%',
      border: `6px solid ${C.cyan}`, opacity: 1 - r}} /> : null;
  };
  const card = spr(f, fps, 0, {damping: 12});
  const bell = spr(f, fps, lc + 12, {damping: 8});
  return (
    <Shot dur={dur}>
      <BG tint={C.violet} rays={subbed ? 0.3 : 0.1} />
      <div style={{position: 'absolute', left: SW / 2, top: 360, transform: `translate(-50%,0) scale(${card})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: 300, height: 300, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${C.cyan}`, boxShadow: neon(C.pink, 1.2)}}>
          <Img src={staticFile('brand/avatar_full.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div style={{fontFamily: fonts.logo, fontSize: 84, color: '#fff', marginTop: 20, direction: 'ltr', letterSpacing: 2}}>
          HAMOUDI<span style={{color: C.pink, textShadow: neon(C.pink, 0.7)}}>X</span>
        </div>
      </div>
      {/* subscribe button */}
      <div style={{position: 'absolute', left: SW / 2, top: 800, transform: `translate(-50%,0) scale(${spr(f, fps, 6, {damping: 11}) * tap(sc)})`, width: 700, height: 130,
        borderRadius: 65, background: subbed ? '#2a1838' : '#e1182a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
        boxShadow: subbed ? 'none' : '0 0 50px rgba(225,24,42,.7)', fontFamily: fonts.arDisplay, fontSize: 70, color: '#fff', direction: 'rtl'}}>
        {subbed ? 'تم الاشتراك ✔' : 'اشترك الآن'}
      </div>
      {/* like + bell */}
      <div style={{position: 'absolute', left: SW / 2, top: 1070, transform: `translate(-50%,0) scale(${spr(f, fps, 12, {damping: 11})})`, display: 'flex', gap: 40}}>
        <div style={{width: 330, height: 130, borderRadius: 65, background: liked ? '#fff' : 'rgba(20,6,32,.9)', border: `3px solid ${C.cyan}`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 18, transform: `scale(${tap(lc) * (liked ? 1 + 0.15 * Math.exp(-(f - lc) / 6) : 1)})`,
          fontFamily: fonts.arDisplay, fontSize: 60, color: liked ? C.night : '#fff'}}>
          <ThumbsUp size={64} fill={liked ? C.pink : 'none'} color={liked ? C.pink : '#fff'} /> لايك
        </div>
        <div style={{width: 130, height: 130, borderRadius: '50%', background: f >= lc + 12 ? C.pink : 'rgba(20,6,32,.9)', border: `3px solid ${C.cyan}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <BellRing size={64} color="#fff" style={{transform: `rotate(${f >= lc + 12 ? Math.sin((f - lc) * 0.9) * 24 * Math.exp(-(f - lc - 12) / 18) : 0}deg) scale(${0.8 + 0.2 * bell})`}} />
        </div>
      </div>
      {ring(sc, 560, 865)}
      {ring(lc, 300, 1135)}
      {/* hand cursor */}
      <div style={{position: 'absolute', left: cx, top: cy, fontSize: 120, transform: `scale(${f % 40 < 4 ? 0.9 : 1})`, filter: 'drop-shadow(0 10px 14px rgba(0,0,0,.6))'}}>👆</div>
      {liked && <Burst at={lc} seed="e" cx={300} cy={1135} n={50} />}
    </Shot>
  );
};

/* ================= SHOT F — end card: series coming ================= */
const ShotF: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const eps = [1, 2, 3];
  return (
    <Shot dur={dur} zoom={0.04}>
      <BG tint={C.pink} rays={0.2} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', direction: 'rtl'}}>
        <div style={{fontFamily: fonts.label, fontWeight: 600, fontSize: 46, color: C.cyan, letterSpacing: '0.45em', direction: 'ltr', opacity: prog(f, 0, 10)}}>COMING SOON</div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 130, color: '#fff', lineHeight: 1.1, transform: `scale(${spr(f, fps, 2, {damping: 10})})`,
          textShadow: `0 10px 0 ${C.pink}`}}>تختيم GTA 6</div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 96, color: C.gold, opacity: prog(f, 8, 18)}}>كامل على القناة</div>
      </div>
      {eps.map((e, i) => {
        const s = spr(f, fps, 10 + i * 6, {damping: 11});
        return (
          <div key={i} style={{position: 'absolute', left: SW / 2 + (i - 1) * 330, top: 640, transform: `translate(-50%,0) rotate(${(i - 1) * 6}deg) translateY(${(1 - s) * 500 + Math.abs(i - 1) * 40}px)`,
            width: 290, height: 380, borderRadius: 28, background: `linear-gradient(160deg, ${C.plum}, ${C.night})`, border: `4px solid ${i === 0 ? C.pink : C.cyan}`,
            boxShadow: i === 0 ? neon(C.pink, 0.8) : '0 20px 40px rgba(0,0,0,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: fonts.display, fontSize: 130, color: '#fff', lineHeight: 1}}>EP{e}</div>
            <div style={{fontFamily: fonts.arDisplay, fontSize: 46, color: i === 0 ? C.pink : C.cyan}}>{i === 0 ? 'قريباً 🔥' : '🔒'}</div>
          </div>
        );
      })}
    </Shot>
  );
};

/* ================= TIMELINE ================= */
const sc = [
  {C: ShotA, from: 0, to: B.aqwa - 2},
  {C: ShotB, from: B.aqwa - 2, to: B.wahiya},
  {C: ShotC, from: B.wahiya, to: B.d},
  {C: ShotD, from: B.d, to: B.sub},
  {C: ShotE, from: B.sub, to: B.end},
  {C: ShotF, from: B.end, to: SHORT01_LEN},
];

const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 12, background: 'rgba(0,0,0,.35)'}}>
      <div style={{height: '100%', width: `${(f / SHORT01_LEN) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`, boxShadow: `0 0 14px ${C.pink}`}} />
    </div>
  );
};

export const Short01: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {sc.map(({C: S, from, to}, i) => (
      <Sequence key={i} from={from} durationInFrames={to - from}>
        <S dur={to - from} />
      </Sequence>
    ))}
    <Captions y={1310} />
    <TopBar />
    <Grain opacity={0.05} />
    <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 55%, rgba(5,0,10,.55) 100%)'}} />

    {/* audio: voice on top, music under, SFX on every beat */}
    <Audio src={staticFile('shorts/s01_voice.wav')} volume={1} />
    <Audio src={staticFile('shorts/s01_music.wav')} volume={0.13} />
    <Sfx n="riser" at={B.three - 26} v={0.35} />
    <Sfx n="impact" at={B.three} v={0.7} />
    <Sfx n="whoosh" at={B.aqwa - 4} v={0.35} />
    <Sfx n="pop" at={B.aqwa + 32} v={0.4} />
    <Sfx n="riser" at={B.gta - 24} v={0.4} />
    <Sfx n="boom" at={B.gta} v={0.8} />
    <Sfx n="whoosh" at={B.d - 4} v={0.35} />
    <Sfx n="impact" at={B.akhiran} v={0.5} />
    <Sfx n="ding" at={B.ostora} v={0.45} />
    <Sfx n="whoosh" at={B.sub - 4} v={0.35} />
    <Sfx n="click" at={B.subClick} v={0.7} />
    <Sfx n="click" at={B.likeClick} v={0.7} />
    <Sfx n="ding" at={B.likeClick + 12} v={0.3} />
    <Sfx n="whoosh" at={B.end - 4} v={0.35} />
  </AbsoluteFill>
);
