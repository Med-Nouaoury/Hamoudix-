import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, H, W, clamp, ease, fonts, prog, spr} from './theme';
import type {Phrase} from './theme';

/* ================= FILM GRAIN / VIGNETTE ================= */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`grain${f % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 6} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${f % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.5}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at center, transparent 50%, rgba(8,0,14,${strength}) 100%)`}} />
);

/* ================= SPARKS / EMBERS (the banner's orange-pink sparks) ================= */
export const Sparks: React.FC<{n?: number; seed?: string; burstAt?: number; cx?: number; cy?: number; opacity?: number}> = ({
  n = 70, seed = 's', burstAt, cx = W / 2, cy = H / 2, opacity = 1,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      {Array.from({length: n}).map((_, i) => {
        const r = (k: string) => random(`${seed}${k}${i}`);
        const col = r('c') > 0.55 ? C.ember : r('c') > 0.25 ? C.hot : '#ffd9a8';
        const len = 4 + r('l') * 18;
        let x: number, y: number, ang: number, a: number;
        if (burstAt !== undefined) {
          const t = f - burstAt;
          if (t < 0) return null;
          ang = r('a') * Math.PI * 2;
          const sp = 8 + r('v') * 26;
          const d = sp * t * Math.exp(-t / 28) * 1.6;
          x = cx + Math.cos(ang) * d;
          y = cy + Math.sin(ang) * d + t * t * 0.04;
          a = Math.max(0, 1 - t / (30 + r('t') * 40));
        } else {
          ang = -Math.PI / 2 - 0.6 + r('a') * 1.2;
          const life = 90 + r('t') * 120;
          const t = (f + r('o') * life) % life;
          x = r('x') * W + Math.cos(ang) * t * (1 + r('v') * 2);
          y = H + 40 - t * (3 + r('v') * 6) + Math.sin(t / 9 + i) * 10;
          a = Math.sin((t / life) * Math.PI) * (0.4 + r('b') * 0.6);
        }
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: len, height: 3, borderRadius: 2, background: col, opacity: a,
            transform: `rotate(${(ang * 180) / Math.PI}deg)`, boxShadow: `0 0 8px ${col}, 0 0 16px ${col}`}} />
        );
      })}
    </AbsoluteFill>
  );
};

/* ================= CIRCUIT LINES (tech HUD lines from the banner) ================= */
export const Circuit: React.FC<{p?: number; color?: string; opacity?: number}> = ({p = 1, color = C.pink, opacity = 0.55}) => {
  const paths = [
    'M0 330 H260 L300 290 H520', 'M0 760 H180 L230 810 H470', 'M1920 300 H1680 L1640 260 H1380', 'M1920 780 H1700 L1650 830 H1420',
    'M60 120 H360', 'M1560 120 H1860', 'M80 980 H420', 'M1500 980 H1840',
  ];
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg width={W} height={H}>
        {paths.map((d, i) => (
          <path key={i} d={d} stroke={color} strokeWidth={2} fill="none" strokeDasharray={900} strokeDashoffset={900 * (1 - Math.min(1, p * 1.3 - i * 0.04))}
            style={{filter: `drop-shadow(0 0 6px ${color})`}} />
        ))}
        {[[300, 290], [470, 810], [1640, 260], [1650, 830]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill={color} opacity={p > 0.7 ? 1 : 0} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* ================= SHEEN (light sweep across an element) ================= */
export const Sheen: React.FC<{p: number; opacity?: number}> = ({p, opacity = 0.4}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
    background: `linear-gradient(105deg, transparent ${p * 140 - 40}%, rgba(255,255,255,.9) ${p * 140 - 25}%, transparent ${p * 140 - 10}%)`}} />
);

/* ================= STAGES (documentary backgrounds — same 5 as SkyGaming + HamoudiX "neon") ================= */
export type Variant = 'neon' | 'mist' | 'pink' | 'galaxy' | 'cork' | 'dark';
const BG: Record<Variant, string> = {
  neon: `radial-gradient(ellipse 70% 80% at 50% 40%, #c2188a 0%, #5a127f 42%, #1a0630 100%)`,
  mist: 'radial-gradient(ellipse 70% 80% at 50% 45%, #ecebf2 0%, #c9c4d6 45%, #8f87a3 100%)',
  pink: 'radial-gradient(ellipse 70% 80% at 50% 45%, #ff6fb3 0%, #e0347f 50%, #7d1250 100%)',
  galaxy: 'radial-gradient(ellipse 80% 90% at 50% 50%, #7b35d6 0%, #4a1a9b 40%, #1a0838 100%)',
  cork: 'radial-gradient(ellipse 80% 90% at 50% 45%, #5a4632 0%, #3a2c1f 55%, #120d09 100%)',
  dark: 'radial-gradient(ellipse 80% 90% at 50% 45%, #1e1426 0%, #0c0711 70%, #000 100%)',
};

const Particles: React.FC<{n?: number; color?: string; seed?: string}> = ({n = 60, color = '#fff', seed = 'p'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const big = random(seed + 'b' + i) > 0.86;
        const sz = big ? 10 + random(seed + 's' + i) * 26 : 2 + random(seed + 's' + i) * 5;
        const x = (random(seed + 'x' + i) * W + f * (0.2 + random(seed + 'v' + i) * 0.8)) % W;
        const y = (random(seed + 'y' + i) * H - f * (0.15 + random(seed + 'u' + i) * 0.5) + H * 10) % H;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (20 + (i % 17)) + i));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%', background: color,
          opacity: (big ? 0.18 : 0.55) * tw, filter: `blur(${big ? 8 : 0.6}px)`}} />;
      })}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{v: Variant; children?: React.ReactNode}> = ({v, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BG[v], overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${40 + Math.sin(f / 60) * 12}% ${35 + Math.cos(f / 70) * 8}%, rgba(255,255,255,${v === 'mist' ? 0.35 : 0.16}), transparent 45%)`}} />
      {v === 'galaxy' && <Particles n={140} seed="g" />}
      {(v === 'mist' || v === 'pink' || v === 'dark') && <Particles n={70} seed={v} />}
      {v === 'neon' && (
        <>
          <Circuit p={1} opacity={0.35} />
          <Sparks n={50} seed="stage" opacity={0.8} />
        </>
      )}
      {v === 'cork' && (
        <AbsoluteFill style={{opacity: 0.35, mixBlendMode: 'overlay'}}>
          <svg width="100%" height="100%"><filter id="cork"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" /></filter>
            <rect width="100%" height="100%" filter="url(#cork)" /></svg>
        </AbsoluteFill>
      )}
      {children}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.35) 100%)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

/* ================= KINETIC PHRASES (synced to the narration, key word highlighted) ================= */
export const Kinetic: React.FC<{phrases: Phrase[]; y?: number; size?: number; dark?: boolean; hiColor?: string}> = ({phrases, y = 760, size = 92, dark, hiColor = C.gold}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  let idx = -1;
  phrases.forEach((p, i) => {
    if (f >= p.at) idx = i;
  });
  if (idx < 0) return null;
  const p = phrases[idx];
  const next = phrases[idx + 1];
  const out = next ? prog(f, next.at - 5, next.at, ease.in) : 0;
  const words = p.t.split(' ');
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', direction: 'rtl', gap: `0 ${Math.round(size * 0.3)}px`,
      opacity: 1 - out, transform: `translateY(${-out * 30}px)`, filter: out ? `blur(${out * 10}px)` : undefined}}>
      {words.map((w, i) => {
        const s = spr(f, fps, p.at + i * 3, {damping: 18, stiffness: 150});
        const isHi = p.hi && w.includes(p.hi);
        const lat = /^[A-Za-z0-9 .%$+-]+$/.test(w);
        return (
          <span key={i} style={{fontFamily: isHi ? fonts.arDisplay : fonts.ar, fontWeight: 700, fontSize: isHi ? size * 1.25 : size, lineHeight: 1.2,
            color: isHi ? hiColor : dark ? '#1b1b1f' : '#fff', direction: lat ? 'ltr' : 'rtl', unicodeBidi: 'isolate',
            textShadow: dark ? '0 6px 24px rgba(255,255,255,.5)' : '0 6px 24px rgba(0,0,0,.45)', display: 'inline-block',
            opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.92 + 0.08 * s})`, filter: `blur(${(1 - s) * 12}px)`}}>{w}</span>
        );
      })}
    </div>
  );
};

/* ================= FLOAT (cut-out prop: pop + bob + tilt + shadow + DOF) ================= */
export const Float: React.FC<{x: number; y: number; delay?: number; rot?: number; depth?: number; children: React.ReactNode; out?: number}> = ({
  x, y, delay = 0, rot = 0, depth = 0, children, out = 0,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spr(f, fps, delay, {damping: 12, stiffness: 140});
  const bob = Math.sin((f + delay * 7) / 24) * 12;
  const tilt = Math.sin((f + delay * 5) / 40) * 4;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translateY(${bob + (1 - s) * 120}px) rotate(${rot + tilt + (1 - s) * -25}deg) scale(${s * (1 - out * 0.3)})`,
      opacity: Math.min(1, s * 1.4) * (1 - out), filter: `drop-shadow(0 30px 40px rgba(0,0,0,.45)) blur(${depth + out * 10}px)`}}>
      {children}
    </div>
  );
};

/* ================= SCENE WRAPPER (blur-zoom in / out between full-screen scenes) ================= */
export const Scene: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, 12, ease.out);
  const o = prog(f, dur - 10, dur, ease.in);
  return (
    <AbsoluteFill style={{transform: `scale(${1.15 - 0.15 * i + 0.12 * o})`, filter: `blur(${(1 - i) * 22 + o * 22}px)`, opacity: Math.min(i * 1.5, 1) * (1 - o)}}>
      {children}
    </AbsoluteFill>
  );
};

/* ================= STAMP (rubber-stamp slam) ================= */
export const Stamp: React.FC<{at: number; text: string; x: number; y: number; size?: number; color?: string; rot?: number}> = ({at, text, x, y, size = 76, color = C.red, rot = -12}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const st = spr(f, fps, at, {damping: 9, stiffness: 260});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * st})`, opacity: Math.min(1, st * 2),
      border: `8px solid ${color}`, color, padding: '4px 28px', fontFamily: fonts.arDisplay, fontSize: size, direction: 'rtl', whiteSpace: 'nowrap',
      background: 'rgba(255,255,255,.1)', borderRadius: 10, textShadow: '0 0 1px #000'}}>{text}</div>
  );
};

/* ================= SFX helper ================= */
export const Sfx: React.FC<{n: string; at: number; v?: number}> = ({n, at, v = 0.4}) => (
  <Sequence from={at} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
  </Sequence>
);

/* ================= FLASH CUT ================= */
export const Flash: React.FC<{at: number; len?: number; color?: string; max?: number}> = ({at, len = 8, color = '#fff', max = 0.8}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none', background: color, opacity: interpolate(f, [at, at + 2, at + len], [0, max, 0], clamp)}} />;
};

export const BrandImg: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => <Img src={staticFile(src)} style={style} />;
