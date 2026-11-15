import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Check, Crosshair, Flag, MapPin, Trophy} from 'lucide-react';
import {C, H, W, clamp, ease, envelope, fonts, neon, prog, spr} from './theme';
import {Flash, Sparks} from './fx';

/* ================================================================
   NEW for HamoudiX — walkthrough (تختيم) series elements.
   Same motion language as SkyGaming (spring pops, mask-rise text,
   neon glow, blur in/out), styled in HamoudiX colours.
   ================================================================ */

/* ---------- GAMEPLAY: your capture, or an animated neon-city stand-in for previews ---------- */
export const Gameplay: React.FC<{src?: string; startFrom?: number; zoom?: number}> = ({src, startFrom = 0, zoom = 1}) => {
  const f = useCurrentFrame();
  if (src) {
    return (
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <OffthreadVideo src={staticFile(src)} startFrom={startFrom} />
      </AbsoluteFill>
    );
  }
  // Placeholder: original synthwave coastal city (no game assets) so every element can be previewed.
  const drive = f * 9;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #2b0a4f 0%, #8a1d78 38%, #ff6a7a 55%, #ffb36b 62%, #1a0630 62.2%, #0d0218 100%)', overflow: 'hidden',
      transform: `scale(${zoom})`}}>
      {/* sun with stripes */}
      <div style={{position: 'absolute', left: W / 2 - 230, top: 260, width: 460, height: 460, borderRadius: '50%',
        background: `linear-gradient(180deg, #fff3a8, #ffb347 40%, ${C.pink} 100%)`, boxShadow: `0 0 120px ${C.pink}`,
        WebkitMaskImage: 'repeating-linear-gradient(180deg, #000 0 26px, transparent 26px 34px)'}} />
      {/* skyline */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 34}).map((_, i) => {
          const w = 40 + random(`bw${i}`) * 70;
          const h = 60 + random(`bh${i}`) * 260;
          const x = ((i * 62 + random(`bx${i}`) * 30 - f * 0.6) % (W + 200) + W + 200) % (W + 200) - 100;
          return <rect key={i} x={x} y={670 - h} width={w} height={h} fill="#1a0630" />;
        })}
        {Array.from({length: 7}).map((_, i) => {
          const x = ((i * 300 - f * 2.2) % (W + 400) + W + 400) % (W + 400) - 200;
          return (
            <g key={`p${i}`} transform={`translate(${x},670)`}>
              <path d="M0 0 C 4 -120, 10 -220, 18 -300" stroke="#0d0218" strokeWidth={14} fill="none" />
              {[-60, -20, 25, 70, 120].map((a, j) => (
                <path key={j} d={`M18 -300 q ${Math.cos((a * Math.PI) / 180) * 70} ${-30 + Math.sin((a * Math.PI) / 180) * 40} ${Math.cos((a * Math.PI) / 180) * 130} 40`}
                  stroke="#0d0218" strokeWidth={10} fill="none" strokeLinecap="round" />
              ))}
            </g>
          );
        })}
      </svg>
      {/* perspective grid road */}
      <div style={{position: 'absolute', left: -W, right: -W, top: 672, height: 900, transformOrigin: '50% 0%', transform: 'perspective(500px) rotateX(70deg)',
        backgroundImage: `linear-gradient(${C.pink} 2px, transparent 2px), linear-gradient(90deg, ${C.pink} 2px, transparent 2px)`,
        backgroundSize: '120px 120px', backgroundPosition: `0 ${drive}px`, opacity: 0.55, boxShadow: `inset 0 120px 120px #0d0218`}} />
      <div style={{position: 'absolute', left: 30, bottom: 26, fontFamily: fonts.label, fontWeight: 600, fontSize: 20, color: 'rgba(255,255,255,.35)', letterSpacing: '0.3em'}}>
        GAMEPLAY PLACEHOLDER
      </div>
    </AbsoluteFill>
  );
};

/* ---------- EPISODE TAG (top-left: series + part number) ---------- */
export const EpisodeTag: React.FC<{dur: number; series: string; ep: number}> = ({dur, series, ep}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 14, 14);
  const s = spr(f, fps, 0, {damping: 13});
  return (
    <div style={{position: 'absolute', left: 50, top: 40, display: 'flex', alignItems: 'stretch', direction: 'ltr', opacity: 1 - o,
      transform: `translateX(${(1 - s) * -400 - o * 300}px)`}}>
      <div style={{background: C.pink, color: '#fff', fontFamily: fonts.display, fontSize: 64, padding: '6px 22px', lineHeight: 1, borderRadius: '14px 0 0 14px',
        boxShadow: neon(C.pink, 0.5)}}>EP {String(ep).padStart(2, '0')}</div>
      <div style={{background: 'rgba(20,6,32,.88)', border: `2px solid ${C.pink}`, borderLeft: 'none', borderRadius: '0 14px 14px 0', padding: '0 26px',
        display: 'flex', alignItems: 'center', fontFamily: fonts.arDisplay, fontSize: 44, color: '#fff', direction: 'rtl'}}>{series}</div>
    </div>
  );
};

/* ---------- MISSION START (cinematic title card over gameplay) ---------- */
export const MissionStart: React.FC<{dur: number; n: number; title: string; objectives: string[]}> = ({dur, n, title, objectives}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [i, o] = envelope(f, dur, 14, 14);
  const bars = prog(f, 0, 16, ease.inOut) * (1 - o);
  const t1 = prog(f, 10, 28);
  const num = spr(f, fps, 4, {damping: 10, stiffness: 200});
  return (
    <AbsoluteFill>
      {/* letterbox bars */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120 * bars, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 * bars, background: '#000'}} />
      <AbsoluteFill style={{background: `linear-gradient(270deg, rgba(14,4,24,.85) 0%, rgba(14,4,24,.4) 55%, transparent 80%)`, opacity: i * (1 - o)}} />
      <div style={{position: 'absolute', right: 140, top: 250, width: 1000, direction: 'rtl', opacity: 1 - o, filter: `blur(${o * 10}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <Flag size={46} color={C.cyan} />
          <div style={{fontFamily: fonts.label, fontWeight: 600, fontSize: 34, color: C.cyan, letterSpacing: '0.4em', direction: 'ltr'}}>MISSION</div>
          <div style={{fontFamily: fonts.display, fontSize: 120, lineHeight: 0.9, color: C.pink, transform: `scale(${num})`, textShadow: neon(C.pink, 0.8), direction: 'ltr'}}>
            {String(n).padStart(2, '0')}
          </div>
        </div>
        <div style={{overflow: 'hidden', paddingBottom: 10}}>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 130, color: '#fff', lineHeight: 1.1, transform: `translateY(${(1 - t1) * 110}%)`,
            textShadow: '0 10px 40px rgba(0,0,0,.6)', unicodeBidi: 'plaintext'}}>{title}</div>
        </div>
        <div style={{height: 4, width: 360 * prog(f, 20, 40, ease.inOut), background: `linear-gradient(270deg, ${C.pink}, ${C.cyan})`, margin: '10px 0 26px'}} />
        {objectives.map((ob, k) => {
          const s = spr(f, fps, 30 + k * 8, {damping: 14});
          return (
            <div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14, opacity: s, transform: `translateX(${(1 - s) * -80}px)`}}>
              <Crosshair size={38} color={C.pink} />
              <div style={{fontFamily: fonts.ar, fontWeight: 700, fontSize: 44, color: '#fff', unicodeBidi: 'plaintext'}}>{ob}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- OBJECTIVE TOAST (top-right: new objective / checkpoint) ---------- */
export const Objective: React.FC<{dur: number; text: string; kind?: 'new' | 'done'}> = ({dur, text, kind = 'new'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 14, 14);
  const s = spr(f, fps, 0, {damping: 12, stiffness: 180});
  const done = kind === 'done';
  const col = done ? '#2ecc71' : C.cyan;
  const tick = done ? spr(f, fps, 10, {damping: 8, stiffness: 260}) : 0;
  return (
    <div style={{position: 'absolute', right: 60, top: 120, display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl', padding: '18px 30px 18px 40px',
      background: 'rgba(14,4,24,.88)', borderRadius: 20, border: `2px solid ${col}88`, boxShadow: `0 0 30px ${col}44, 0 20px 40px rgba(0,0,0,.5)`,
      transform: `translateX(${(1 - s) * 500 + o * 500}px)`, opacity: 1 - o}}>
      <div style={{width: 64, height: 64, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {done ? <Check size={42} color="#fff" strokeWidth={4} style={{transform: `scale(${tick})`}} /> : <MapPin size={38} color="#0e0418" />}
      </div>
      <div>
        <div style={{fontFamily: fonts.ar, fontWeight: 700, fontSize: 24, color: col}}>{done ? 'تم الإنجاز' : 'هدف جديد'}</div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 46, color: '#fff', unicodeBidi: 'plaintext', textDecoration: done && tick > 0.8 ? 'line-through' : 'none',
          textDecorationColor: col}}>{text}</div>
      </div>
    </div>
  );
};

/* ---------- MISSION COMPLETE (big neon success + reward counter) ---------- */
export const MissionComplete: React.FC<{dur: number; reward?: number; rating?: number}> = ({dur, reward = 0, rating = 3}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = prog(f, 0, 8) * (1 - prog(f, dur - 12, dur, ease.in));
  const s = spr(f, fps, 2, {damping: 9, stiffness: 200});
  const money = Math.round(interpolate(f, [24, 60], [0, reward], {...clamp, easing: ease.out}));
  return (
    <AbsoluteFill style={{opacity: k}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 45% at 50% 45%, ${C.pink}55, rgba(14,4,24,.75) 75%)`}} />
      <AbsoluteFill style={{opacity: 0.3, mixBlendMode: 'screen', transform: `rotate(${f * 0.6}deg) scale(2.2)`,
        background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,.3) 0deg 5deg, transparent 5deg 18deg)'}} />
      <Sparks n={110} seed="mc" burstAt={2} cx={W / 2} cy={430} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: 'translateY(-40px)'}}>
        <Trophy size={130} color={C.gold} style={{transform: `scale(${s}) rotate(${(1 - s) * -30}deg)`, filter: `drop-shadow(0 0 30px ${C.gold})`}} />
        <div style={{fontFamily: fonts.display, fontSize: 210, lineHeight: 0.95, color: '#fff', letterSpacing: interpolate(s, [0, 1], [60, 8]),
          transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})`, textShadow: neon(C.pink, 1.4), direction: 'ltr'}}>MISSION COMPLETE</div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 80, color: C.cyan, direction: 'rtl', opacity: prog(f, 14, 26), textShadow: neon(C.cyan, 0.5)}}>المهمة نجحت!</div>
        <div style={{display: 'flex', gap: 40, alignItems: 'center', marginTop: 20, opacity: prog(f, 22, 32)}}>
          {reward > 0 && <div style={{fontFamily: fonts.display, fontSize: 110, color: '#2ecc71', textShadow: '0 0 30px rgba(46,204,113,.7)', direction: 'ltr'}}>+${money.toLocaleString('en-US')}</div>}
          <div style={{display: 'flex', gap: 10}}>
            {Array.from({length: 3}).map((_, i) => {
              const st = spr(f, fps, 34 + i * 7, {damping: 8, stiffness: 260});
              return <div key={i} style={{fontSize: 90, transform: `scale(${st})`, filter: i < rating ? `drop-shadow(0 0 16px ${C.gold})` : 'grayscale(1) opacity(.35)'}}>⭐</div>;
            })}
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={2} len={10} max={0.7} />
    </AbsoluteFill>
  );
};

/* ---------- PROGRESS RING (walkthrough completion %) ---------- */
export const ProgressRing: React.FC<{dur: number; from: number; to: number; label?: string}> = ({dur, from, to, label = 'نسبة التختيم'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 14, 14);
  const s = spr(f, fps, 0, {damping: 12});
  const v = interpolate(f, [10, 50], [from, to], {...clamp, easing: ease.out});
  const R = 120, L = 2 * Math.PI * R;
  return (
    <div style={{position: 'absolute', left: 80, bottom: 110, display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl', opacity: 1 - o,
      transform: `scale(${s}) translateY(${o * 80}px)`, transformOrigin: 'left bottom', background: 'rgba(14,4,24,.85)', padding: '24px 40px 24px 30px',
      borderRadius: 30, border: `2px solid ${C.cyan}55`, boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
      <div style={{position: 'relative', width: 280, height: 280}}>
        <svg width={280} height={280} style={{transform: 'rotate(-90deg)'}}>
          <circle cx={140} cy={140} r={R} stroke="rgba(255,255,255,.12)" strokeWidth={22} fill="none" />
          <circle cx={140} cy={140} r={R} stroke={`url(#pg)`} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - v / 100)}
            style={{filter: `drop-shadow(0 0 10px ${C.pink})`}} />
          <defs><linearGradient id="pg"><stop offset="0%" stopColor={C.cyan} /><stop offset="100%" stopColor={C.pink} /></linearGradient></defs>
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 110,
          color: '#fff', direction: 'ltr'}}>{Math.round(v)}<span style={{fontSize: 56, color: C.pink}}>%</span></div>
      </div>
      <div style={{fontFamily: fonts.arDisplay, fontSize: 60, color: '#fff'}}>{label}</div>
    </div>
  );
};
