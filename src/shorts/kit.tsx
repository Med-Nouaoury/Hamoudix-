import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, ease, fonts, neon, prog, spr} from '../theme';

/* Shared building blocks for vertical Shorts (1080x1920) — extracted from Short 01 */
export const SW = 1080, SH = 1920;

/* ---------- word-by-word captions ---------- */
export type CapWord = {t: string; f: number; hi?: boolean};
export const Captions: React.FC<{pages: CapWord[][]; total: number; y: number}> = ({pages, total, y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const starts = pages.map((p) => (p.length ? p[0].f : Infinity));
  let pi = -1;
  starts.forEach((s, i) => {
    if (f >= s) pi = i;
  });
  if (pi < 0 || !pages[pi].length) return null;
  const page = pages[pi];
  const end = pi + 1 < pages.length ? starts[pi + 1] : total;
  const out = end === Infinity ? 0 : prog(f, end - 3, end, ease.in);
  let act = -1;
  page.forEach((w, i) => {
    if (f >= w.f) act = i;
  });
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl', gap: '6px 22px',
      opacity: 1 - out, transform: `scale(${1 - 0.08 * out})`}}>
      {page.map((w, i) => {
        if (f < w.f) return null;
        const s = spr(f, fps, w.f, {damping: 10, stiffness: 260});
        const isAct = i === act;
        const lat = /^[0-9A-Za-z. ]+$/.test(w.t);
        const col = w.hi ? (isAct ? '#fff' : C.gold) : '#fff';
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', fontFamily: lat ? fonts.display : fonts.arDisplay, fontSize: lat ? 140 : 104,
            lineHeight: 1.15, color: col, direction: lat ? 'ltr' : 'rtl', padding: '0 14px',
            transform: `scale(${interpolate(s, [0, 1], [0.4, isAct ? 1.08 : 1])}) rotate(${isAct ? -2 : 0}deg)`,
            WebkitTextStroke: '3px #12021f', paintOrder: 'stroke fill', textShadow: '0 8px 0 #12021f, 0 14px 30px rgba(0,0,0,.6)'}}>
            {isAct && w.hi && (
              <span style={{position: 'absolute', inset: '8px 0 4px', borderRadius: 18, background: C.pink, zIndex: -1, boxShadow: neon(C.pink, 0.8),
                transform: `scaleX(${spr(f, fps, w.f, {damping: 14, stiffness: 300})})`}} />
            )}
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

export const TopBar: React.FC<{total: number}> = ({total}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 12, background: 'rgba(0,0,0,.35)'}}>
      <div style={{height: '100%', width: `${(f / total) * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`, boxShadow: `0 0 14px ${C.pink}`}} />
    </div>
  );
};

export const BG: React.FC<{tint?: string; rays?: number; shake?: number}> = ({tint = C.pink, rays = 0, shake = 0}) => {
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
export const Embers: React.FC<{n?: number}> = ({n = 45}) => {
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
export const Burst: React.FC<{at: number; cx?: number; cy?: number; n?: number; seed: string}> = ({at, cx = SW / 2, cy = 760, n = 80, seed}) => {
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
export const FlashAt: React.FC<{at: number; max?: number; len?: number}> = ({at, max = 0.85, len = 9}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [at, at + 2, at + len], [0, max, 0], clamp), pointerEvents: 'none'}} />;
};
/* scene wrapper with zoom-blur transition in/out (local frames) */
export const Shot: React.FC<{dur: number; children: React.ReactNode; zoom?: number}> = ({dur, children, zoom = 0.06}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 8, ease.out), o = prog(f, dur - 6, dur, ease.in);
  return (
    <AbsoluteFill style={{transform: `scale(${1.25 - 0.25 * i + 0.3 * o + zoom * (f / dur)})`, filter: `blur(${(1 - i) * 26 + o * 26}px)`, opacity: Math.min(1, i * 1.6) * (1 - o * 0.4)}}>
      {children}
    </AbsoluteFill>
  );
};
export const Mascot: React.FC<{x: number; y: number; h: number; delay?: number; shake?: boolean; bubble?: string}> = ({x, y, h, delay = 0, shake, bubble}) => {
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


export const CoverBG: React.FC<{src?: string; blur?: number; dim?: number; tint?: string; rays?: number; shake?: number}> = ({src = 'art/gta6_ultimate.jpg', blur = 22, dim = 0.5, tint = C.pink, rays = 0, shake = 0}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.night, transform: `translate(${Math.sin(f * 2.3) * shake}px, ${Math.cos(f * 1.7) * shake}px)`}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: '50%', top: '50%', height: '115%', transform: `translate(-50%,-50%) scale(${1.05 + f * 0.0015})`,
        filter: `blur(${blur}px) brightness(${dim}) saturate(1.35)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 55% at 50% 40%, ${tint}55, transparent 70%), linear-gradient(180deg, rgba(14,4,24,.35), rgba(14,4,24,.15) 40%, rgba(14,4,24,.85) 100%)`}} />
      <AbsoluteFill style={{opacity: rays, mixBlendMode: 'screen', transform: `rotate(${f * 0.5}deg) scale(2.4)`,
        background: 'repeating-conic-gradient(from 0deg at 50% 42%, rgba(255,255,255,.22) 0deg 5deg, transparent 5deg 16deg)'}} />
      <Embers n={35} />
    </AbsoluteFill>
  );
};

