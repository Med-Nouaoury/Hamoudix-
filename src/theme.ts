import './fonts';
import {Easing, interpolate, spring} from 'remotion';

/* Same font system as SkyGaming-Motion (Lalezar, IBM Plex Sans Arabic, Bebas Neue, Oswald) + Russo One for the HamoudiX wordmark */
export const fonts = {
  arDisplay: "'Lalezar', sans-serif",
  ar: "'IBM Plex Sans Arabic', sans-serif",
  display: "'Bebas Neue', sans-serif",
  label: "'Oswald', sans-serif",
  logo: "'Russo One', sans-serif",
};

/* HamoudiX palette — taken from the channel banner + avatar (deep purple, hot pink, neon cyan, controller green) */
export const C = {
  night: '#0e0418',
  ink: '#14051f',
  plum: '#2a0b4a',
  violet: '#6a1fb0',
  pink: '#ff2fa0',
  hot: '#ff3d8b',
  cyan: '#36e0ff',
  green: '#7cff4f',
  gold: '#ffc94d',
  ember: '#ff8a3d',
  white: '#ffffff',
  soft: 'rgba(255,255,255,.78)',
  red: '#ff2b4a',
};

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-out, AE "easy ease" feel
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 eased progress between frames a..b */
export const prog = (f: number, a: number, b: number, e = ease.out) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

export const spr = (frame: number, fps: number, delay = 0, cfg: Record<string, number> = {}) =>
  spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 140, mass: 0.8, ...cfg}});

/** in/out envelope: returns [inProgress, outProgress] */
export const envelope = (f: number, dur: number, inLen = 18, outLen = 14) => [prog(f, 0, inLen), prog(f, dur - outLen, dur, ease.in)];

export const neon = (c: string, k = 1) => `0 0 ${10 * k}px ${c}, 0 0 ${28 * k}px ${c}, 0 0 ${60 * k}px ${c}88`;

export type Phrase = {at: number; t: string; hi?: string};
