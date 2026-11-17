import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Pointer} from 'lucide-react';
import {geoNaturalEarth1, geoPath, geoCentroid} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import {C, clamp, ease, fonts, prog, spr} from '../theme';
import {Sfx} from '../fx';
import {SH, SW} from './kit';

/* =====================================================================
   SHORT 02 (PRO) — follows the user's script beat by beat.
   Cinematic dark look, hard cuts with glitch, real world map,
   seamless loop back to the hook. Voice tightened + 1.15x (42.7 s).
   ===================================================================== */
const F = (s: number) => Math.round(s * 30);
export const S2P_LEN = F(42.68) + 12;

const B = {
  allWorld: F(2.48), oneSec: F(3.5), lakin: F(4.48), press: F(4.94), sadi9ni: F(5.64), karitha: F(6.64),
  r1: F(7.18), infijar: F(7.94), count: F(9.12), fifty: F(9.56), stores: F(11.74), ps: F(12.88), xb: F(13.54),
  map: F(14.56), h24: F(15.9), midnight: F(17.36),
  r2: F(18.68), shops: F(19.84), night: F(22.52), clock: F(23.8), twelve: F(24.44), dawn: F(25.56),
  trick: F(27.66), nz: F(29.42), plus12: F(31.62), change: F(33.28),
  sub: F(35.92), ask: F(38.34), end: F(42.68),
};
const YEL = '#ffe14d';
const RED = '#ff2b3d';

/* ---------------- captions (2–4 words, active word yellow) ---------------- */
type Wd = {t: string; f: number};
const w = (t: string, s: number): Wd => ({t, f: F(s)});
const PAGES: Wd[][] = [
  [w('Rockstar', 0), w('كان', 0.72), w('ممكن', 0.92), w('تطلق', 1.18)],
  [w('GTA 6', 1.5), w('لكل', 2.48), w('العالم', 2.84)],
  [w('في', 3.24), w('ثانية', 3.5), w('واحدة', 3.8), w('فقط', 4.24)],
  [w('لكن', 4.48), w('لو', 4.78), w('فعلت', 4.94), w('هذا', 5.32)],
  [w('صدقني', 5.64), w('ستحدث', 6.18), w('كارثة!', 6.64)],
  [],
  [w('السبب', 7.18), w('الأول', 7.52)],
  [w('انفجار', 7.94), w('السيرفرات', 8.48)],
  [w('يدخل', 9.12), w('50', 9.56), w('مليون', 10.12), w('لاعب', 10.56)],
  [w('في', 10.92), w('نفس', 11.08), w('الثانية', 11.36)],
  [w('ستسقط', 11.74), w('متاجر', 12.44)],
  [w('PlayStation', 12.88), w('و', 13.46), w('Xbox', 13.54), w('فوراً', 14.08)],
  [w('لذلك', 14.56), w('وزّعوا', 14.84), w('الإطلاق', 15.26)],
  [w('على', 15.68), w('24', 15.9), w('ساعة', 16.58)],
  [w('حسب', 17.08), w('منتصف', 17.36), w('الليل', 17.82)],
  [w('في', 18.14), w('كل', 18.32), w('دولة', 18.48)],
  [w('والسبب', 18.68), w('الثاني', 19.2)],
  [w('المحلات', 19.84), w('والنسخ', 20.4), w('الفيزيائية', 20.9)],
  [w('حتى', 21.46), w('يعيش', 21.72), w('كل', 21.98), w('بلد', 22.16)],
  [w('ليلة', 22.52), w('إطلاق', 22.88), w('خاصة', 23.26), w('به', 23.7)],
  [w('عند', 23.8), w('الساعة', 24.08), w('12', 24.44), w('ليلاً', 25.28)],
  [w('بدون', 25.56), w('أن', 25.92), w('يضطر', 26.06), w('أحد', 26.42)],
  [w('للاستيقاظ', 26.64), w('في', 27.34), w('الفجر', 27.4)],
  [w('لكن', 27.66), w('هناك', 28.08), w('خدعة', 28.56)],
  [w('لاعبو', 28.9), w('نيوزيلندا', 29.42)],
  [w('سيلعبونها', 30.02), w('قبلنا', 31.02)],
  [w('بـ', 31.4), w('12', 31.62), w('ساعة', 32.1), w('كاملة', 32.86)],
  [w('ويمكنك', 33.28), w('تغيير', 33.76), w('توقيت', 34.14), w('جهازك', 34.48)],
  [w('لتلعبها', 34.98), w('معهم', 35.56)],
  [w('اشترك', 35.92), w('الآن', 36.32)],
  [w('لنختمها', 36.66), w('معاً', 37.36), w('من', 37.7), w('الأول', 37.82)],
  [w('واكتب', 38.34), w('لي', 38.78)],
  [w('هل', 38.96), w('ستنتظر', 39.22), w('توقيت', 39.6), w('بلدك', 39.96)],
  [w('أم', 40.38), w('تسافر', 40.68), w('لنيوزيلندا؟', 41.1)],
];
const Captions: React.FC<{y: number}> = ({y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const starts = PAGES.map((p, i) => (p.length ? p[0].f : B.karitha + 1));
  let pi = -1;
  starts.forEach((s, i) => {
    if (f >= s) pi = i;
  });
  if (pi < 0 || !PAGES[pi].length || f >= B.end) return null;
  const page = PAGES[pi];
  let act = -1;
  page.forEach((x, i) => {
    if (f >= x.f) act = i;
  });
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl', gap: '0 26px'}}>
      {page.map((x, i) => {
        if (f < x.f) return null;
        const s = spr(f, fps, x.f, {damping: 12, stiffness: 320});
        const on = i === act;
        const lat = /^[0-9A-Za-z. ]+$/.test(x.t);
        return (
          <span key={i} style={{display: 'inline-block', fontFamily: lat ? fonts.display : fonts.arDisplay, fontSize: lat ? 128 : 100, lineHeight: 1.2,
            color: on ? YEL : '#fff', direction: lat ? 'ltr' : 'rtl', transform: `translateY(${(1 - s) * 40}px) scale(${on ? 1.12 : 1})`, opacity: Math.min(1, s * 2),
            WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', textShadow: '0 10px 24px rgba(0,0,0,.8)'}}>{x.t}</span>
        );
      })}
    </div>
  );
};

/* ---------------- FX ---------------- */
const Noise: React.FC<{o?: number}> = ({o = 0.07}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: o, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%"><filter id={`n${f % 5}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 5} /></filter>
        <rect width="100%" height="100%" filter={`url(#n${f % 5})`} /></svg>
    </AbsoluteFill>
  );
};
/* hard-cut glitch: RGB bars + offset slices for a few frames around each cut */
const CUTS = [B.karitha, B.r1, B.stores, B.map, B.r2, B.clock, B.dawn, B.trick, B.change, B.sub, B.ask];
const Glitch: React.FC = () => {
  const f = useCurrentFrame();
  const c = CUTS.find((x) => f >= x - 2 && f < x + 5);
  if (c === undefined) return null;
  const k = 1 - Math.abs(f - c) / 5;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 9}).map((_, i) => {
        const r = (s: string) => random(`${s}${i}${f}`);
        return <div key={i} style={{position: 'absolute', left: 0, right: 0, top: r('y') * SH, height: 8 + r('h') * 90, background: [RED, C.cyan, '#fff'][i % 3],
          opacity: 0.35 * k, mixBlendMode: 'screen', transform: `translateX(${(r('x') - 0.5) * 300 * k}px)`}} />;
      })}
      <AbsoluteFill style={{background: '#fff', opacity: f === c ? 0.35 : 0}} />
    </AbsoluteFill>
  );
};
/* camera: slow push + optional impact shake */
const Cam: React.FC<{dur: number; push?: number; shakeAt?: number[]; children: React.ReactNode}> = ({dur, push = 0.08, shakeAt = [], children}) => {
  const f = useCurrentFrame();
  let sh = 0;
  shakeAt.forEach((a) => {
    if (f >= a && f < a + 14) sh = Math.max(sh, 30 * (1 - (f - a) / 14));
  });
  const z = 1 + push * (f / dur) + shakeAt.reduce((m, a) => (f >= a && f < a + 6 ? m + 0.06 * (1 - (f - a) / 6) : m), 0);
  return <AbsoluteFill style={{transform: `translate(${Math.sin(f * 2.9) * sh}px, ${Math.cos(f * 2.3) * sh}px) scale(${z})`}}>{children}</AbsoluteFill>;
};
const Kicker: React.FC<{n: string; title: string; at?: number; color?: string}> = ({n, title, at = 0, color = RED}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spr(f, fps, at, {damping: 9, stiffness: 300});
  const bar = prog(f, at, at + 8);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{background: color, color: '#fff', fontFamily: fonts.label, fontWeight: 700, fontSize: 40, letterSpacing: '0.35em', padding: '6px 24px 6px 34px',
        transform: `scaleX(${bar})`}}>{n}</div>
      <div style={{fontFamily: fonts.arDisplay, fontSize: 132, color: '#fff', lineHeight: 1.15, direction: 'rtl', marginTop: 10,
        transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`, opacity: Math.min(1, s * 2), WebkitTextStroke: '6px #000', paintOrder: 'stroke fill',
        textShadow: `0 0 40px ${color}aa`}}>{title}</div>
    </div>
  );
};

/* ================= A. HOOK — the LAUNCH button ================= */
const Button: React.FC<{press: number; glow: number}> = ({press, glow}) => (
  <div style={{position: 'relative', width: 620, height: 420}}>
    {/* caution ring */}
    <div style={{position: 'absolute', left: 0, top: 120, width: 620, height: 300, borderRadius: '50%',
      background: 'repeating-linear-gradient(45deg, #ffcc00 0 34px, #111 34px 68px)', boxShadow: '0 40px 60px rgba(0,0,0,.8)'}} />
    <div style={{position: 'absolute', left: 50, top: 150, width: 520, height: 240, borderRadius: '50%', background: 'linear-gradient(180deg,#2a2a30,#0c0c10)'}} />
    {/* cap side + top */}
    <div style={{position: 'absolute', left: 110, top: 70 + press * 60, width: 400, height: 260 - press * 60, borderRadius: '0 0 200px 200px / 0 0 80px 80px',
      background: 'linear-gradient(90deg,#6a0010,#c3001a 40%,#ff3347 55%,#8a0012)'}} />
    <div style={{position: 'absolute', left: 110, top: press * 60, width: 400, height: 160, borderRadius: '50%',
      background: 'radial-gradient(ellipse at 40% 30%, #ff8b96 0%, #ff2b3d 35%, #b00015 80%)', boxShadow: `0 0 ${40 + glow * 80}px ${RED}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <span style={{fontFamily: fonts.display, fontSize: 84, color: 'rgba(80,0,10,.85)', letterSpacing: 8, transform: 'scaleY(.62)', textShadow: '0 2px 0 rgba(255,255,255,.35)'}}>LAUNCH</span>
    </div>
  </div>
);
const HookShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const press = B.press;
  const pressK = f >= press ? Math.min(1, (f - press) / 3) : 0;
  const hand = prog(f, B.lakin, press, ease.inOut);
  const tension = prog(f, B.sadi9ni, B.karitha);
  const one = f >= B.oneSec ? spr(f, fps, B.oneSec, {damping: 9, stiffness: 300}) : 0;
  return (
    <Cam dur={dur} push={0.12 + tension * 0.25} shakeAt={[press]}>
      <AbsoluteFill style={{background: '#050307'}}>
        {/* spotlight cone */}
        <div style={{position: 'absolute', left: SW / 2 - 520, top: -200, width: 1040, height: 1500,
          background: 'radial-gradient(ellipse 50% 70% at 50% 0%, rgba(255,255,255,.16), transparent 70%)', clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1060, height: 300, background: 'radial-gradient(ellipse 45% 50% at 50% 30%, rgba(255,43,61,.25), transparent 70%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', opacity: prog(f, 0, 10)}}>
          <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 40, letterSpacing: '0.5em', color: 'rgba(255,255,255,.6)'}}>WORLDWIDE RELEASE</div>
          <div style={{fontFamily: fonts.display, fontSize: 170, color: '#fff', letterSpacing: 6, lineHeight: 1}}>GTA <span style={{color: C.pink}}>VI</span></div>
        </div>
        {f >= B.oneSec && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: fonts.display, fontSize: 150, color: RED,
            transform: `scale(${interpolate(one, [0, 1], [2, 1])})`, letterSpacing: 4, textShadow: `0 0 30px ${RED}`}}>00:00:01</div>
        )}
        <div style={{position: 'absolute', left: SW / 2 - 310, top: 650}}><Button press={pressK} glow={0.5 + 0.5 * Math.sin(f / 4) + tension} /></div>
        {/* hand */}
        <div style={{position: 'absolute', left: interpolate(hand, [0, 1], [1100, 470]), top: interpolate(hand, [0, 1], [1300, 640 + pressK * 50]),
          transform: 'rotate(-20deg)', filter: 'drop-shadow(0 30px 30px rgba(0,0,0,.8))', opacity: f >= B.lakin - 4 ? 1 : 0}}>
          <Pointer size={300} fill="#f2f2f2" color="#111" strokeWidth={1.2} />
        </div>
        <AbsoluteFill style={{background: RED, opacity: tension * (0.12 + 0.12 * Math.sin(f / 2)), mixBlendMode: 'screen'}} />
      </AbsoluteFill>
    </Cam>
  );
};
/* black screen + ERROR */
const ErrorShot: React.FC<{dur: number}> = () => {
  const f = useCurrentFrame();
  const flick = random(`e${f}`) > 0.25 ? 1 : 0.2;
  const off = (random(`o${f}`) - 0.5) * 30;
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', opacity: flick}}>
        {[{c: C.cyan, x: -off}, {c: RED, x: off}].map((l, i) => (
          <div key={i} style={{position: 'absolute', inset: 0, fontFamily: fonts.display, fontSize: 300, color: l.c, transform: `translateX(${l.x}px)`, mixBlendMode: 'screen',
            letterSpacing: 10}}>ERROR</div>
        ))}
        <div style={{position: 'relative', fontFamily: fonts.display, fontSize: 300, color: '#fff', letterSpacing: 10}}>ERROR</div>
      </div>
      <div style={{fontFamily: 'monospace', fontSize: 38, color: RED, marginTop: 10, opacity: flick}}>SERVER_OVERLOAD // 0xGTA6</div>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 6px)'}} />
    </AbsoluteFill>
  );
};

/* ================= B. REASON 1 — servers ================= */
const DataRain: React.FC<{color?: string}> = ({color = RED}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: 0.35, overflow: 'hidden'}}>
      {Array.from({length: 22}).map((_, i) => {
        const sp = 8 + random(`dr${i}`) * 16;
        const y = ((f * sp + random(`dy${i}`) * 2000) % 2400) - 600;
        return (
          <div key={i} style={{position: 'absolute', left: i * 50, top: y, fontFamily: 'monospace', fontSize: 34, color, lineHeight: 1.1, writingMode: 'vertical-rl',
            textShadow: `0 0 8px ${color}`}}>{Array.from({length: 14}).map((__, k) => Math.floor(random(`c${i}${k}${Math.floor(f / 3)}`) * 10)).join('')}</div>
        );
      })}
    </AbsoluteFill>
  );
};
const Counter: React.FC<{from: number; to: number}> = ({from, to}) => {
  const f = useCurrentFrame();
  const k = prog(f, from, to, ease.out);
  const n = Math.round(k * 50_000_000);
  const blur = (1 - k) * 6;
  return (
    <div style={{fontFamily: fonts.display, fontSize: 210, color: '#fff', direction: 'ltr', letterSpacing: 2, filter: `blur(${blur}px)`,
      textShadow: `0 0 40px ${RED}, 0 0 90px ${RED}88`}}>{n.toLocaleString('en-US')}</div>
  );
};
const Burning: React.FC<{label: string; color: string; at: number; size: number; font: string; italic?: boolean}> = ({label, color, at, size, font, italic}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spr(f, fps, at - 10, {damping: 12});
  const burn = prog(f, at, at + 26);
  return (
    <div style={{position: 'relative', transform: `scale(${s}) rotate(${burn * (italic ? 3 : -3)}deg)`, display: 'flex', justifyContent: 'center'}}>
      {/* flames */}
      {burn > 0 && Array.from({length: 26}).map((_, i) => {
        const r = (k: string) => random(`fl${label}${k}${i}`);
        const h = (120 + r('h') * 220) * burn * (0.7 + 0.3 * Math.sin(f / 2 + i));
        return <div key={i} style={{position: 'absolute', left: `${(i / 26) * 100}%`, bottom: '30%', width: 60 + r('w') * 60, height: h, marginLeft: -40,
          borderRadius: '50% 50% 20% 20%', background: `linear-gradient(0deg, #ff3b00, #ffb000 60%, rgba(255,240,180,0))`, filter: 'blur(10px)', opacity: 0.85,
          mixBlendMode: 'screen', transform: `skewX(${Math.sin(f / 3 + i) * 10}deg)`}} />;
      })}
      <div style={{position: 'relative', fontFamily: font, fontWeight: 700, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color: burn > 0 ? '#ffd9a0' : '#fff',
        letterSpacing: 2, filter: `brightness(${1 - 0.7 * burn}) drop-shadow(0 0 ${20 + burn * 40}px ${burn > 0 ? '#ff6a00' : color})`,
        WebkitTextStroke: `3px ${color}`}}>{label}</div>
    </div>
  );
};
const ServersShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const L = (x: number) => x - B.r1;
  const showStores = f >= L(B.stores);
  return (
    <Cam dur={dur} shakeAt={[L(B.infijar), L(B.ps), L(B.xb)]}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 45%, #3a0008, #050102 75%)'}} />
      <DataRain />
      <Kicker n="REASON 01" title={f < L(B.infijar) ? 'السبب الأول' : 'انفجار السيرفرات'} at={f < L(B.infijar) ? 0 : L(B.infijar)} />
      {!showStores && f >= L(B.count) && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center'}}>
          <Counter from={L(B.count)} to={L(B.fifty) + 30} />
          <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 46, color: YEL, letterSpacing: '0.3em'}}>PLAYERS • SAME SECOND</div>
        </div>
      )}
      {showStores && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70}}>
          <Burning label="PlayStation" color="#0070d1" at={L(B.ps)} size={150} font={fonts.label} />
          <Burning label="XBOX" color="#107c10" at={L(B.xb)} size={190} font={fonts.label} italic />
        </div>
      )}
      {showStores && <Embers from={L(B.ps)} />}
    </Cam>
  );
};
const Embers: React.FC<{from: number}> = ({from}) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 50}).map((_, i) => {
        const r = (k: string) => random(`em${k}${i}`);
        const t = (f - from + r('o') * 60) % 60;
        const col = r('c') > 0.5 ? '#ff8a00' : '#ffd060';
        return <div key={i} style={{position: 'absolute', left: 150 + r('x') * 780 + Math.sin(t / 6 + i) * 30, top: 1050 - t * 14, width: 5, height: 14, borderRadius: 3,
          background: col, opacity: 1 - t / 60, boxShadow: `0 0 10px ${col}`}} />;
      })}
    </AbsoluteFill>
  );
};

/* ================= C. world map — midnight wave over 24h ================= */
const geo = feature(world as any, (world as any).objects.countries) as any;
const MAP_W = 1000, MAP_H = 560;
const proj = geoNaturalEarth1().fitSize([MAP_W, MAP_H], geo);
const path = geoPath(proj);
const COUNTRIES = (geo.features as any[]).map((g) => ({d: path(g) || '', lon: geoCentroid(g)[0]}));
const PINS = [
  {lon: 174.8, lat: -41.3, t: 'نيوزيلندا'}, {lon: 46.7, lat: 24.7, t: 'السعودية'}, {lon: -7.6, lat: 33.6, t: 'المغرب'}, {lon: -74, lat: 40.7, t: 'أمريكا'},
];
const MapShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = (x: number) => x - B.map;
  const k = prog(f, 6, dur - 4, ease.inOut);
  const line = interpolate(k, [0, 1], [185, -130]); // midnight sweeps east → west
  const hours = Math.round(k * 24);
  const lx = proj([line, 0])![0];
  return (
    <Cam dur={dur} push={0.06}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 45%, #10142e, #030308 80%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center'}}>
        <div style={{fontFamily: fonts.display, fontSize: 220, color: '#fff', lineHeight: 0.9, direction: 'ltr', transform: `scale(${spr(f, fps, L(B.h24), {damping: 10})})`,
          textShadow: `0 0 40px ${C.pink}`}}>{String(hours).padStart(2, '0')}<span style={{fontSize: 90, color: C.pink}}>H</span></div>
        <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,.6)', letterSpacing: '0.4em'}}>MIDNIGHT • LOCAL TIME</div>
      </div>
      <div style={{position: 'absolute', left: (SW - MAP_W) / 2, top: 560, width: MAP_W, height: MAP_H, transform: 'perspective(1400px) rotateX(18deg)'}}>
        <svg width={MAP_W} height={MAP_H} style={{overflow: 'visible'}}>
          {COUNTRIES.map((c, i) => {
            const lit = c.lon > line;
            return <path key={i} d={c.d} fill={lit ? C.pink : '#1d2140'} stroke={lit ? '#ffb3dd' : '#2c3260'} strokeWidth={0.8} opacity={lit ? 0.95 : 0.9}
              style={lit ? {filter: `drop-shadow(0 0 4px ${C.pink})`} : undefined} />;
          })}
          {/* the midnight line */}
          <line x1={lx} y1={-20} x2={lx} y2={MAP_H + 20} stroke={YEL} strokeWidth={5} style={{filter: `drop-shadow(0 0 12px ${YEL})`}} />
          <rect x={lx} y={-20} width={MAP_W - lx + 40} height={MAP_H + 40} fill="rgba(0,0,0,.25)" />
          {PINS.map((p, i) => {
            const [x, y] = proj([p.lon, p.lat])!;
            const on = p.lon > line;
            if (!on) return null;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={10} fill={YEL} />
                <circle cx={x} cy={y} r={10 + ((f * 1.5) % 30)} fill="none" stroke={YEL} strokeWidth={3} opacity={1 - ((f * 1.5) % 30) / 30} />
              </g>
            );
          })}
        </svg>
        {PINS.map((p, i) => {
          const [x, y] = proj([p.lon, p.lat])!;
          if (!(p.lon > line)) return null;
          return (
            <div key={i} style={{position: 'absolute', left: Math.min(MAP_W - 70, Math.max(70, x)), top: y - 96, transform: 'translateX(-50%)', background: '#000', border: `2px solid ${YEL}`, borderRadius: 10,
              padding: '2px 12px', whiteSpace: 'nowrap', textAlign: 'center'}}>
              <div style={{fontFamily: fonts.display, fontSize: 36, color: YEL, lineHeight: 1}}>00:00</div>
              <div style={{fontFamily: fonts.arDisplay, fontSize: 24, color: '#fff', lineHeight: 1.1}}>{p.t}</div>
            </div>
          );
        })}
      </div>
    </Cam>
  );
};

/* ================= D. REASON 2 — midnight queues ================= */
const Person: React.FC<{h: number; seed: string}> = ({h, seed}) => {
  const f = useCurrentFrame();
  const phone = random(seed + 'p') > 0.55;
  const hue = Math.floor(random(seed + 'c') * 4);
  const bob = Math.sin(f / (8 + random(seed + 'b') * 6)) * 3;
  return (
    <div style={{position: 'relative', width: h * 0.32, height: h, transform: `translateY(${bob}px)`}}>
      <div style={{position: 'absolute', left: '22%', top: 0, width: '56%', height: h * 0.2, borderRadius: '50%', background: '#0b0812'}} />
      <div style={{position: 'absolute', left: 0, top: h * 0.2, width: '100%', height: h * 0.8, borderRadius: `${h * 0.12}px ${h * 0.12}px 6px 6px`,
        background: ['#140d20', '#1a1028', '#0f0b18', '#1d1230'][hue], boxShadow: 'inset 4px 0 0 rgba(255,47,160,.35)'}} />
      {phone && <div style={{position: 'absolute', left: '55%', top: h * 0.3, width: 14, height: 22, borderRadius: 3, background: '#bfe8ff', boxShadow: '0 0 30px 8px rgba(160,220,255,.55)'}} />}
    </div>
  );
};
const QueueShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = (x: number) => x - B.r2;
  const pan = interpolate(f, [L(B.shops), dur], [0, -900], clamp);
  const party = f >= L(B.night);
  return (
    <Cam dur={dur} push={0.05}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #07051a 0%, #1a0b30 55%, #0a0612 56%, #050309 100%)'}} />
      {/* street layer */}
      <div style={{position: 'absolute', left: 0, top: 560, width: 3000, height: 760, transform: `translateX(${pan}px)`}}>
        {/* store front */}
        <div style={{position: 'absolute', left: 1500, top: 0, width: 1100, height: 620, background: '#0d0818', border: '6px solid #24123a'}}>
          <div style={{position: 'absolute', left: 60, right: 60, top: 30, height: 120, borderRadius: 14, border: `5px solid ${C.pink}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: fonts.display, fontSize: 96, letterSpacing: 10, color: '#fff', textShadow: `0 0 20px ${C.pink}, 0 0 50px ${C.pink}`,
            boxShadow: `0 0 30px ${C.pink}, inset 0 0 30px ${C.pink}`, opacity: random(`ns${Math.floor(f / 4)}`) > 0.06 ? 1 : 0.4}}>GAME STORE</div>
          <div style={{position: 'absolute', left: 60, top: 190, display: 'flex', gap: 30}}>
            {[0, 1, 2].map((i) => <Img key={i} src={staticFile('art/gta6_ultimate.jpg')} style={{width: 300, height: 300, boxShadow: `0 0 40px ${C.pink}88`}} />)}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(0deg, rgba(255,47,160,.25), transparent)'}} />
        </div>
        {/* the queue */}
        <div style={{position: 'absolute', left: 80, top: 330, display: 'flex', alignItems: 'flex-end', gap: 26}}>
          {Array.from({length: 22}).map((_, i) => <Person key={i} h={300 + random(`ph${i}`) * 80} seed={`q${i}`} />)}
        </div>
        <div style={{position: 'absolute', left: 0, top: 700, width: 3000, height: 60, background: 'linear-gradient(180deg, rgba(255,47,160,.18), transparent)'}} />
      </div>
      <Kicker n="REASON 02" title={f < L(B.shops) ? 'السبب الثاني' : 'طوابير منتصف الليل'} at={f < L(B.shops) ? 0 : L(B.shops)} color={C.pink} />
      {party && Array.from({length: 4}).map((_, i) => <Firework key={i} at={L(B.night) + i * 8} x={200 + i * 230} y={560 + (i % 2) * 90} />)}
      {f >= L(B.night) && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 90, color: YEL,
          transform: `scale(${spr(f, fps, L(B.night), {damping: 10})})`, WebkitTextStroke: '5px #000', paintOrder: 'stroke fill'}}>ليلة الإطلاق 🎉</div>
      )}
    </Cam>
  );
};
const Firework: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 40) return null;
  const col = [C.pink, YEL, C.cyan][Math.floor(random(`fw${at}`) * 3)];
  return (
    <>
      {Array.from({length: 24}).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const d = 160 * (1 - Math.exp(-t / 7));
        return <div key={i} style={{position: 'absolute', left: x + Math.cos(a) * d, top: y + Math.sin(a) * d + t * t * 0.06, width: 8, height: 8, borderRadius: 4,
          background: col, opacity: 1 - t / 40, boxShadow: `0 0 12px ${col}`}} />;
      })}
    </>
  );
};
/* flip clock 23:59:5x → 00:00:00 */
const FlipDigit: React.FC<{v: string; flipAt: number}> = ({v, flipAt}) => {
  const f = useCurrentFrame();
  const k = prog(f, flipAt, flipAt + 5, ease.inOut);
  return (
    <div style={{position: 'relative', width: 118, height: 190, borderRadius: 16, background: 'linear-gradient(180deg,#1b1b22 50%,#121218 50%)', boxShadow: '0 20px 40px rgba(0,0,0,.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transform: `rotateX(${k > 0 && k < 1 ? Math.sin(k * Math.PI) * 30 : 0}deg)`}}>
      <span style={{fontFamily: fonts.display, fontSize: 180, color: '#fff', lineHeight: 1}}>{v}</span>
      <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: '#000'}} />
    </div>
  );
};
const ClockShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = (x: number) => x - B.clock;
  const zero = L(B.twelve);
  const sec = f < zero ? 57 + Math.min(2, Math.floor(f / Math.max(1, zero / 3))) : 0;
  const t = f < zero ? `2359${String(sec).padStart(2, '0')}` : '000000';
  const hit = f >= zero;
  return (
    <Cam dur={dur} shakeAt={[zero]}>
      <AbsoluteFill style={{background: hit ? `radial-gradient(ellipse 80% 50% at 50% 45%, ${C.pink}66, #0a0512 75%)` : '#07050c'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, direction: 'ltr', perspective: 800}}>
        {t.split('').map((d, i) => (
          <React.Fragment key={i}>
            <FlipDigit v={d} flipAt={hit ? zero : f - (f % 10)} />
            {(i === 1 || i === 3) && <span style={{fontFamily: fonts.display, fontSize: 130, color: hit ? YEL : '#555'}}>:</span>}
          </React.Fragment>
        ))}
      </div>
      {hit && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: fonts.display, fontSize: 120, color: YEL, letterSpacing: 8,
          transform: `scale(${interpolate(spr(f, fps, zero, {damping: 8, stiffness: 300}), [0, 1], [2, 1])})`, textShadow: `0 0 40px ${YEL}`}}>IT'S TIME</div>
      )}
      {hit && Array.from({length: 60}).map((_, i) => {
        const r = (k: string) => random(`cf${k}${i}`);
        const tt = f - zero;
        return <div key={i} style={{position: 'absolute', left: r('x') * SW, top: -40 + tt * (14 + r('v') * 14), width: 16, height: 28, background: [C.pink, YEL, C.cyan, '#fff'][i % 4],
          transform: `rotate(${tt * 20 * (r('r') - 0.5)}deg)`, opacity: 0.9}} />;
      })}
      {f >= zero && <Firework at={zero + 2} x={SW / 2} y={500} />}
    </Cam>
  );
};
const DawnShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const x = spr(f, fps, 14, {damping: 9, stiffness: 300});
  return (
    <Cam dur={dur} shakeAt={[14]}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #2a3c7a 0%, #e98a5a 55%, #2a1630 56%, #0d0812 100%)'}} />
      <div style={{position: 'absolute', left: SW / 2 - 170, top: 640, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, #fff3c0, #ffb347 60%, transparent 72%)',
        transform: `translateY(${-f * 2}px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: fonts.display, fontSize: 260, color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,.5)',
        transform: `rotate(${Math.sin(f * 2.4) * 2}deg)`}}>05:00</div>
      <div style={{position: 'absolute', left: SW / 2, top: 520, width: 760, height: 34, borderRadius: 17, background: RED, transform: `translate(-50%,-50%) rotate(-12deg) scaleX(${x})`,
        boxShadow: `0 0 30px ${RED}`}} />
    </Cam>
  );
};

/* ================= E. THE TRICK — New Zealand ================= */
const NZFlag: React.FC<{w: number}> = ({w}) => {
  const f = useCurrentFrame();
  const h = w / 2;
  const star = (cx: number, cy: number, r: number) => {
    const pts = Array.from({length: 10}).map((_, i) => {
      const rr = i % 2 ? r * 0.4 : r;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
    }).join(' ');
    return <polygon points={pts} fill="#cc142b" stroke="#fff" strokeWidth={r * 0.18} />;
  };
  const N = 24;
  return (
    <div style={{display: 'flex', width: w, height: h + 40, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.6))'}}>
      {Array.from({length: N}).map((_, i) => (
        <div key={i} style={{width: w / N, height: h, overflow: 'hidden', transform: `translateY(${Math.sin(f / 6 - i * 0.35) * 14}px)`,
          filter: `brightness(${1 + Math.sin(f / 6 - i * 0.35) * 0.12})`}}>
          <svg width={w} height={h} viewBox="0 0 1200 600" style={{marginLeft: -(i * w) / N}}>
            <rect width="1200" height="600" fill="#00247d" />
            <path d="M0 0 L600 300 M600 0 L0 300" stroke="#fff" strokeWidth="60" />
            <path d="M0 0 L600 300 M600 0 L0 300" stroke="#cf142b" strokeWidth="20" />
            <path d="M300 0 V300 M0 150 H600" stroke="#fff" strokeWidth="100" />
            <path d="M300 0 V300 M0 150 H600" stroke="#cf142b" strokeWidth="60" />
            {star(900, 480, 50)}{star(810, 260, 42)}{star(1000, 230, 38)}{star(900, 110, 42)}
          </svg>
        </div>
      ))}
    </div>
  );
};
const TrickShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = (x: number) => x - B.trick;
  const nz = f >= L(B.nz);
  const p12 = f >= L(B.plus12);
  const hrs = Math.round(interpolate(f, [L(B.plus12), L(B.plus12) + 20], [0, 12], {...clamp, easing: ease.out}));
  return (
    <Cam dur={dur} push={0.1} shakeAt={[L(B.plus12)]}>
      <AbsoluteFill style={{background: nz ? 'radial-gradient(ellipse 80% 60% at 50% 40%, #0b2f5a, #020611 80%)' : '#030206'}} />
      {!nz && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 46, color: 'rgba(255,255,255,.5)', letterSpacing: '0.5em', marginBottom: 20}}>SECRET</div>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 170, color: '#fff', transform: `scale(${1 + f * 0.004})`, textShadow: '0 0 40px rgba(255,255,255,.3)'}}>الخدعة 🤫</div>
        </AbsoluteFill>
      )}
      {nz && (
        <div style={{position: 'absolute', left: SW / 2, top: 560, transform: `translate(-50%,-50%) scale(${spr(f, fps, L(B.nz), {damping: 12})}) rotate(-3deg)`}}>
          <NZFlag w={820} />
        </div>
      )}
      {nz && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontFamily: fonts.label, fontWeight: 700, fontSize: 64, color: '#fff', letterSpacing: '0.35em'}}>
          NEW ZEALAND
        </div>
      )}
      {p12 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', transform: `scale(${interpolate(spr(f, fps, L(B.plus12), {damping: 8, stiffness: 300}), [0, 1], [2.4, 1])})`}}>
          <span style={{fontFamily: fonts.display, fontSize: 280, color: YEL, textShadow: `0 0 50px ${YEL}`, direction: 'ltr'}}>+{hrs}H</span>
        </div>
      )}
    </Cam>
  );
};
const SettingsShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zones = ['(GMT+00:00) Casablanca', '(GMT+03:00) Riyadh', '(GMT+04:00) Dubai', '(GMT+09:00) Tokyo', '(GMT+11:00) Sydney', '(GMT+13:00) Auckland'];
  const sel = Math.min(zones.length - 1, Math.floor(interpolate(f, [16, 50], [0, zones.length - 1], clamp)));
  const done = f >= 56;
  return (
    <Cam dur={dur} push={0.08}>
      <AbsoluteFill style={{background: 'linear-gradient(160deg, #0d1b3d, #04060d 70%)'}} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 220, transform: `translateY(${(1 - spr(f, fps, 0, {damping: 14})) * 200}px)`, direction: 'ltr'}}>
        <div style={{fontFamily: fonts.label, fontWeight: 500, fontSize: 34, color: 'rgba(255,255,255,.55)', letterSpacing: 2}}>Settings › System › Date and Time</div>
        <div style={{fontFamily: fonts.label, fontWeight: 600, fontSize: 64, color: '#fff', margin: '10px 0 26px'}}>Time Zone</div>
        <div style={{borderRadius: 18, overflow: 'hidden', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)'}}>
          {zones.map((z, i) => {
            const on = i === sel;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', height: 112,
                background: on ? 'linear-gradient(90deg, rgba(255,255,255,.95), rgba(220,235,255,.95))' : 'transparent', transform: `scale(${on ? 1.02 : 1})`,
                borderBottom: '1px solid rgba(255,255,255,.07)', fontFamily: fonts.label, fontWeight: 500, fontSize: 42, color: on ? '#0b1530' : 'rgba(255,255,255,.85)'}}>
                <span>{z}</span>
                {on && done && <span style={{fontSize: 48, color: '#0a7cff'}}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
      {done && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1080, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 84, color: YEL,
          transform: `scale(${spr(f, fps, 56, {damping: 9})})`, WebkitTextStroke: '5px #000', paintOrder: 'stroke fill'}}>العب مع نيوزيلندا 🎮</div>
      )}
    </Cam>
  );
};

/* ================= F. END — subscribe → question → loop ================= */
const SubShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const click = 14;
  const subbed = f >= click;
  return (
    <Cam dur={dur} push={0.06}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img src={staticFile('art/p_jason_lucia.jpg')} style={{position: 'absolute', left: '50%', top: 0, height: '75%', transform: 'translateX(-50%) scale(1.2)', filter: 'brightness(.55) saturate(1.2)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.2), rgba(0,0,0,.4) 50%, #000 75%)'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center'}}>
        <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 44, color: '#fff', letterSpacing: '0.45em'}}>FULL WALKTHROUGH</div>
        <div style={{fontFamily: fonts.display, fontSize: 180, color: '#fff', lineHeight: 1}}>GTA <span style={{color: C.pink}}>VI</span> • EP01</div>
      </div>
      <div style={{position: 'absolute', left: SW / 2, top: 760, transform: `translate(-50%,0) scale(${spr(f, fps, 2, {damping: 11}) * (f >= click && f < click + 5 ? 0.92 : 1)})`,
        display: 'flex', alignItems: 'center', gap: 26, background: subbed ? '#272727' : '#ff0000', borderRadius: 80, padding: '22px 60px 22px 26px', direction: 'rtl'}}>
        <div style={{width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff'}}>
          <Img src={staticFile('brand/avatar_full.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <span style={{fontFamily: fonts.arDisplay, fontSize: 76, color: '#fff', whiteSpace: 'nowrap'}}>{subbed ? 'تم الاشتراك' : 'اشترك'}</span>
        <span style={{fontFamily: fonts.logo, fontSize: 40, color: 'rgba(255,255,255,.7)', direction: 'ltr'}}>HamoudiX</span>
      </div>
      <div style={{position: 'absolute', left: interpolate(f, [0, click], [980, 800], {...clamp, easing: ease.inOut}), top: interpolate(f, [0, click], [1250, 820], {...clamp, easing: ease.inOut}),
        transform: 'rotate(-20deg)', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,.8))'}}>
        <Pointer size={170} fill="#f2f2f2" color="#111" strokeWidth={1.2} />
      </div>
    </Cam>
  );
};
const AskShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spr(f, fps, 0, {damping: 12});
  const b = spr(f, fps, F(41.1) - B.ask, {damping: 12});
  const loop = prog(f, dur - 10, dur, ease.in);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: 1 - loop}}>
        {/* split: left = your country, right = NZ */}
        <div style={{position: 'absolute', left: 0, top: 0, width: SW / 2, height: SH, background: 'linear-gradient(180deg,#0a2a6b,#04102b)', transform: `translateX(${(1 - a) * -540}px)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, paddingBottom: 500}}>
          <div style={{fontSize: 200}}>⏰</div>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 80, color: '#fff', textAlign: 'center', lineHeight: 1.1}}>توقيت<br />بلدك</div>
        </div>
        <div style={{position: 'absolute', left: SW / 2, top: 0, width: SW / 2, height: SH, background: 'linear-gradient(180deg,#00247d,#000d2e)', transform: `translateX(${(1 - Math.max(a, b * 0.0 + a)) * 540}px)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, paddingBottom: 500, overflow: 'hidden'}}>
          <div style={{transform: `scale(${0.48 + 0.04 * b})`}}><NZFlag w={820} /></div>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 80, color: YEL, textAlign: 'center', lineHeight: 1.1, marginTop: -110}}>خدعة<br />نيوزيلندا</div>
        </div>
        <div style={{position: 'absolute', left: SW / 2, top: 560, transform: `translate(-50%,-50%) scale(${spr(f, fps, 8, {damping: 8, stiffness: 300})})`, width: 190, height: 190,
          borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.arDisplay, fontSize: 96, color: '#000',
          boxShadow: '0 0 0 10px #000, 0 0 60px rgba(255,255,255,.5)'}}>أم</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 92, color: '#fff', WebkitTextStroke: '6px #000',
          paintOrder: 'stroke fill', transform: `scale(${spr(f, fps, 4, {damping: 10})})`}}>ماذا ستختار؟ 👇</div>
      </AbsoluteFill>
      {/* loop: fade back into the hook's first frame */}
      <AbsoluteFill style={{opacity: loop}}><HookShot dur={60} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================= TIMELINE ================= */
const SHOTS: {C: React.FC<{dur: number}>; from: number; to: number}[] = [
  {C: HookShot, from: 0, to: B.karitha},
  {C: ErrorShot, from: B.karitha, to: B.r1},
  {C: ServersShot, from: B.r1, to: B.map},
  {C: MapShot, from: B.map, to: B.r2},
  {C: QueueShot, from: B.r2, to: B.clock},
  {C: ClockShot, from: B.clock, to: B.dawn},
  {C: DawnShot, from: B.dawn, to: B.trick},
  {C: TrickShot, from: B.trick, to: B.change},
  {C: SettingsShot, from: B.change, to: B.sub},
  {C: SubShot, from: B.sub, to: B.ask},
  {C: AskShot, from: B.ask, to: S2P_LEN},
];

export const Short02Pro: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SHOTS.map(({C: S, from, to}, i) => (
      <Sequence key={i} from={from} durationInFrames={to - from}>
        <S dur={to - from} />
      </Sequence>
    ))}
    <Glitch />
    <Captions y={1300} />
    <Noise />
    <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.6) 100%)'}} />

    <Audio src={staticFile('shorts/s02p_voice.wav')} />
    <Audio src={staticFile('shorts/s02p_music.wav')} volume={0.13} />
    <Sfx n="riser" at={B.lakin - 6} v={0.35} />
    <Sfx n="click" at={B.press} v={0.9} />
    <Sfx n="boom" at={B.karitha} v={0.95} />
    <Sfx n="ring" at={B.karitha + 2} v={0.25} />
    <Sfx n="glitch" at={B.karitha} v={0.5} />
    <Sfx n="impact" at={B.r1} v={0.6} />
    <Sfx n="boom" at={B.infijar} v={0.55} />
    <Sfx n="tick" at={B.count} v={0.3} />
    <Sfx n="whoosh" at={B.stores} v={0.4} />
    <Sfx n="fire" at={B.ps} v={0.5} />
    <Sfx n="fire" at={B.xb} v={0.5} />
    <Sfx n="whoosh" at={B.map} v={0.4} />
    <Sfx n="pop" at={B.h24} v={0.35} />
    <Sfx n="impact" at={B.r2} v={0.55} />
    <Sfx n="boom" at={B.night} v={0.35} />
    <Sfx n="tick" at={B.clock} v={0.5} />
    <Sfx n="tick" at={B.clock + 10} v={0.5} />
    <Sfx n="impact" at={B.twelve} v={0.7} />
    <Sfx n="ding" at={B.dawn} v={0.4} />
    <Sfx n="glitch" at={B.trick} v={0.4} />
    <Sfx n="whoosh" at={B.nz} v={0.4} />
    <Sfx n="boom" at={B.plus12} v={0.6} />
    <Sfx n="click" at={B.change + 16} v={0.4} />
    <Sfx n="click" at={B.change + 33} v={0.4} />
    <Sfx n="ding" at={B.change + 56} v={0.4} />
    <Sfx n="whoosh" at={B.sub} v={0.4} />
    <Sfx n="click" at={B.sub + 14} v={0.8} />
    <Sfx n="whoosh" at={B.ask} v={0.45} />
  </AbsoluteFill>
);
