import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AlertTriangle, Check, Gamepad2} from 'lucide-react';
import {C, W, clamp, ease, envelope, fonts, neon, prog, spr} from './theme';
import type {Phrase} from './theme';
import {Float, Kinetic, Scene, Sparks, Stage, Stamp} from './fx';
import {Mascot} from './brand';

/* ================================================================
   REVEAL — premium product reveal on every mention (the "BOOM")
   game / console / app / company → cover or chip floats in 3D,
   title rises from a mask, kicker line + sheen, video dims behind.
   ================================================================ */
export type RItem = {kind: 'img'; src: string; w: number; round?: boolean} | {kind: 'chip'; label: string};
export const Reveal: React.FC<{dur: number; item: RItem; kicker: string; title: string; sub?: string; latinTitle?: boolean; color?: string}> = ({
  dur, item, kicker, title, sub, latinTitle, color = C.pink,
}) => {
  const f = useCurrentFrame();
  const inK = prog(f, 0, 14, ease.out);
  const outK = prog(f, dur - 12, dur, ease.in);
  const k = inK * (1 - outK);
  const e = prog(f, 2, 26, ease.out);
  const t1 = prog(f, 8, 26, ease.out);
  const t2 = prog(f, 16, 32, ease.out);
  const line = prog(f, 4, 22, ease.inOut);
  const sheen = prog(f, 18, 44, ease.inOut);
  const ry = interpolate(e, [0, 1], [38, -10]) + Math.sin(f / 40) * 3;
  const fy = Math.sin(f / 30) * 6;
  const IX = 600, IY = 470;
  const art = item.kind === 'img' ? (
    <div style={{position: 'relative', width: item.w}}>
      <Img src={staticFile(item.src)} style={{width: '100%', display: 'block', borderRadius: item.round ? 40 : 12}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: item.round ? 40 : 12,
        background: `linear-gradient(105deg, transparent ${sheen * 140 - 40}%, rgba(255,255,255,.5) ${sheen * 140 - 25}%, transparent ${sheen * 140 - 10}%)`}} />
    </div>
  ) : (
    <div style={{width: 380, height: 380, borderRadius: 70, background: 'linear-gradient(145deg, rgba(255,255,255,.16), rgba(255,255,255,.04))',
      border: `2px solid ${color}88`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
      boxShadow: `0 40px 80px rgba(0,0,0,.5), inset 0 0 60px ${color}33`}}>
      <Gamepad2 size={150} color="#fff" strokeWidth={1.4} />
      <div style={{fontFamily: fonts.label, fontWeight: 600, fontSize: 40, color: '#fff', letterSpacing: '0.25em'}}>{item.label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: k}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 60% at ${(IX / W) * 100}% 45%, ${color}40, transparent 70%), linear-gradient(90deg, rgba(14,4,24,.6), rgba(14,4,24,.82))`}} />
      <div style={{position: 'absolute', left: IX - 420, top: 800, width: 840, height: 2, opacity: line,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`, boxShadow: `0 0 18px ${color}`}} />
      <div style={{position: 'absolute', left: IX, top: IY, transform: `translate(-50%,-50%) perspective(1600px) translateY(${(1 - e) * 70 + fy - outK * 30}px) rotateY(${ry}deg) scale(${(0.86 + 0.14 * e) * (1 - 0.06 * outK)})`,
        opacity: e, filter: `blur(${(1 - e) * 10 + outK * 12}px) drop-shadow(0 40px 50px rgba(0,0,0,.6))`}}>
        {art}
      </div>
      <div style={{position: 'absolute', right: 130, top: 0, bottom: 0, width: 900, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end',
        transform: `translateY(${-outK * 30}px)`, opacity: 1 - outK, filter: `blur(${outK * 8}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14, direction: 'ltr'}}>
          <div style={{width: 90 * line, height: 2, background: color}} />
          <div style={{fontFamily: fonts.label, fontWeight: 600, fontSize: 24, letterSpacing: `${0.6 - 0.25 * line}em`, color, opacity: line, whiteSpace: 'nowrap'}}>{kicker}</div>
        </div>
        <div style={{overflow: 'hidden', paddingBottom: 8}}>
          <div style={{transform: `translateY(${(1 - t1) * 110}%)`, fontFamily: latinTitle ? fonts.display : fonts.arDisplay, fontSize: latinTitle ? 150 : 104,
            lineHeight: 1.05, color: '#fff', letterSpacing: latinTitle ? 4 : 0, direction: latinTitle ? 'ltr' : 'rtl', unicodeBidi: 'plaintext', whiteSpace: 'nowrap',
            textShadow: `0 10px 40px rgba(0,0,0,.5), 0 0 30px ${color}66`}}>{title}</div>
        </div>
        <div style={{height: 4, width: 220 * prog(f, 18, 36, ease.inOut), background: `linear-gradient(90deg, ${C.cyan}, ${color})`, borderRadius: 2, margin: '18px 0'}} />
        {sub && <div style={{fontFamily: fonts.ar, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,.85)', direction: 'rtl', unicodeBidi: 'plaintext',
          opacity: t2, transform: `translateY(${(1 - t2) * 24}px)`, filter: `blur(${(1 - t2) * 6}px)`}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

/* ================= LOWER THIRD (name / topic) ================= */
export const LowerThird: React.FC<{dur: number; name: string; role: string}> = ({dur, name, role}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 18, 14);
  const bar = prog(f, 0, 16, ease.inOut);
  const t = spr(f, fps, 8, {damping: 15});
  return (
    <div style={{position: 'absolute', right: 90, bottom: 120, direction: 'rtl', opacity: 1 - o, transform: `translateX(${o * 80}px)`, filter: `blur(${o * 8}px)`}}>
      <div style={{position: 'relative', padding: '18px 40px 18px 50px', overflow: 'hidden', borderRadius: 14}}>
        <div style={{position: 'absolute', inset: 0, transformOrigin: 'right', transform: `scaleX(${bar})`,
          background: `linear-gradient(270deg, rgba(20,6,32,.92), rgba(42,11,74,.85))`, borderRight: `6px solid ${C.pink}`, boxShadow: `0 0 30px ${C.pink}55`}} />
        <div style={{position: 'relative', fontFamily: fonts.arDisplay, fontSize: 64, color: '#fff', lineHeight: 1.1, transform: `translateY(${(1 - t) * 60}px)`, opacity: t}}>{name}</div>
        <div style={{position: 'relative', fontFamily: fonts.ar, fontWeight: 600, fontSize: 32, color: C.cyan, transform: `translateY(${(1 - t) * 40}px)`, opacity: t,
          unicodeBidi: 'plaintext'}}>{role}</div>
      </div>
    </div>
  );
};

/* ================= CHAPTER (big side wipe with number) ================= */
export const Chapter: React.FC<{dur: number; n: string; title: string}> = ({dur, n, title}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 16, 14);
  const bar = prog(f, 0, 18, ease.inOut);
  const t = spr(f, fps, 10, {damping: 14});
  return (
    <div style={{position: 'absolute', right: 0, top: 150, opacity: 1 - o, transform: `translateX(${o * 200}px)`}}>
      <div style={{position: 'relative', height: 130, width: 860, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, transformOrigin: 'right', transform: `scaleX(${bar}) skewX(-12deg)`,
          background: `linear-gradient(270deg, ${C.plum}, ${C.ink}ee)`, borderLeft: `8px solid ${C.cyan}`}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 26, paddingRight: 70, direction: 'rtl'}}>
          <div style={{fontFamily: fonts.display, fontSize: 110, color: C.pink, lineHeight: 1, opacity: prog(f, 8, 20), textShadow: neon(C.pink, 0.6)}}>{n}</div>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 60, color: '#fff', transform: `translateY(${(1 - t) * 80}px)`, opacity: t}}>{title}</div>
        </div>
      </div>
    </div>
  );
};

/* ================= PUNCH (one huge word hits the screen) ================= */
export const Punch: React.FC<{dur: number; text: string; color?: string; y?: number; latin?: boolean}> = ({dur, text, color = '#fff', y = 700, latin}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 10, 12);
  const s = spr(f, fps, 0, {damping: 9, stiffness: 220});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: 1 - o, direction: latin ? 'ltr' : 'rtl',
      transform: `scale(${interpolate(s, [0, 1], [1.8, 1])}) rotate(-3deg)`, filter: `blur(${(1 - Math.min(1, s)) * 10 + o * 10}px)`}}>
      <span style={{fontFamily: latin ? fonts.display : fonts.arDisplay, fontSize: latin ? 170 : 130, color, lineHeight: 1, letterSpacing: latin ? 6 : 0,
        textShadow: `0 6px 0 ${C.pink}, 0 12px 0 rgba(0,0,0,.35), 0 20px 50px rgba(0,0,0,.7)`}}>{text}</span>
    </div>
  );
};

/* ================= BIG STAT (animated number) ================= */
export const BigStat: React.FC<{dur: number; value: number; prefix?: string; unit?: string; label: string; decimals?: number}> = ({dur, value, prefix = '', unit = '', label, decimals = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 18, 14);
  const s = spr(f, fps, 0, {damping: 13});
  const n = interpolate(f, [4, 40], [0, value], {...clamp, easing: ease.out});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: `rgba(14,4,24,${0.55 * (1 - o) * Math.min(1, s)})`, opacity: 1 - o}}>
      <div style={{transform: `scale(${s})`, textAlign: 'center'}}>
        <div style={{fontFamily: fonts.display, fontSize: 300, lineHeight: 0.9, color: '#fff', textShadow: neon(C.pink, 1.2), direction: 'ltr'}}>
          {prefix}{n.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals})}<span style={{fontSize: 140, color: C.cyan}}>{unit}</span>
        </div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 70, color: '#fff', direction: 'rtl', opacity: prog(f, 14, 26)}}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= WARNING (red alert box) ================= */
export const Warning: React.FC<{dur: number; title: string; sub?: string}> = ({dur, title, sub}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 14, 12);
  const s = spr(f, fps, 0, {damping: 10, stiffness: 200});
  const blink = 0.6 + 0.4 * Math.abs(Math.sin(f / 5));
  return (
    <div style={{position: 'absolute', left: '50%', top: 140, transform: `translateX(-50%) scale(${s})`, opacity: 1 - o, display: 'flex', alignItems: 'center', gap: 28,
      direction: 'rtl', background: 'rgba(30,4,10,.9)', border: `4px solid ${C.red}`, borderRadius: 24, padding: '24px 46px', boxShadow: `0 0 ${40 * blink}px ${C.red}`}}>
      <AlertTriangle size={90} color={C.red} style={{opacity: blink}} />
      <div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 66, color: '#fff'}}>{title}</div>
        {sub && <div style={{fontFamily: fonts.ar, fontWeight: 600, fontSize: 34, color: '#ffb3c1'}}>{sub}</div>}
      </div>
    </div>
  );
};

/* ================= TIME SKIP (boring part removed) ================= */
export const TimeSkip: React.FC<{dur: number; text: string}> = ({dur, text}) => {
  const f = useCurrentFrame();
  const k = prog(f, 0, 8) * (1 - prog(f, dur - 8, dur, ease.in));
  const spin = f * 24;
  return (
    <AbsoluteFill style={{background: `rgba(14,4,24,${0.7 * k})`, alignItems: 'center', justifyContent: 'center', opacity: k}}>
      <AbsoluteFill style={{opacity: 0.25, transform: `scale(${1 + f * 0.01})`,
        background: `repeating-radial-gradient(circle at 50% 50%, ${C.pink}33 0 2px, transparent 2px 60px)`}} />
      <svg width={220} height={220} style={{transform: `rotate(${spin}deg)`}}>
        <circle cx={110} cy={110} r={96} fill="none" stroke={C.cyan} strokeWidth={8} strokeDasharray="60 30" />
        <line x1={110} y1={110} x2={110} y2={40} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
      </svg>
      <div style={{fontFamily: fonts.arDisplay, fontSize: 96, color: '#fff', direction: 'rtl', marginTop: 20, textShadow: neon(C.pink, 0.7)}}>{text}</div>
    </AbsoluteFill>
  );
};

/* ================= COUNTDOWN (e.g. days to release / seconds left) ================= */
export const Countdown: React.FC<{dur: number; from: number; to: number; label: string; sub?: string}> = ({dur, from, to, label, sub}) => {
  const f = useCurrentFrame();
  const k = prog(f, 0, 8) * (1 - prog(f, dur - 10, dur, ease.in));
  const n = Math.round(interpolate(f, [4, 34], [from, to], {...clamp, easing: ease.out}));
  return (
    <AbsoluteFill style={{background: `rgba(14,4,24,${0.6 * k})`, alignItems: 'center', justifyContent: 'center', opacity: k}}>
      <Sparks n={40} seed="cd" burstAt={34} />
      <div style={{display: 'flex', alignItems: 'center', gap: 50, direction: 'rtl'}}>
        <div style={{fontFamily: fonts.display, fontSize: 380, lineHeight: 0.85, color: '#fff', textShadow: neon(C.pink, 2)}}>{n}</div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 110, color: '#fff', lineHeight: 1.05}}>{label}</div>
          {sub && <div style={{fontFamily: fonts.ar, fontWeight: 700, fontSize: 48, color: C.cyan, unicodeBidi: 'plaintext'}}>{sub}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= HOOK (cold open before the intro) ================= */
export const Hook: React.FC<{dur: number; big: string; line: string; chips: string[]; bg?: React.ReactNode}> = ({dur, big, line, chips, bg}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = prog(f, dur - 8, dur, ease.in);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${1.15 + f * 0.002 + out})`, filter: `blur(${4 + out * 20}px) brightness(.55) saturate(1.3)`}}>{bg}</AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 3, 10], [0, 0.85, 0], clamp)}} />
      <Sparks n={60} seed="hook" burstAt={6} cx={W / 2} cy={420} />
      <AbsoluteFill style={{opacity: 1 - out, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: fonts.display, fontSize: 260, lineHeight: 0.9, color: '#fff', textShadow: neon(C.pink, 1.6), direction: 'ltr',
          transform: `scale(${interpolate(spr(f, fps, 4, {damping: 9, stiffness: 220}), [0, 1], [2, 1])})`}}>{big}</div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 96, color: '#fff', direction: 'rtl', opacity: prog(f, 16, 26)}}>{line}</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 20, marginTop: 30, direction: 'rtl'}}>
          {chips.map((c, i) => {
            const s = spr(f, fps, 36 + i * 10, {damping: 8, stiffness: 240});
            return <div key={i} style={{background: i === 1 ? C.pink : '#fff', color: i === 1 ? '#fff' : '#111', fontFamily: fonts.arDisplay, fontSize: 50, padding: '8px 28px',
              borderRadius: 40, transform: `scale(${s}) rotate(${(i - 1) * 4}deg)`, boxShadow: '0 16px 30px rgba(0,0,0,.4)', whiteSpace: 'nowrap'}}>{c}</div>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================= QUESTION / CHECKLIST BOARD (pink stage + mascot) ================= */
export const QBoard: React.FC<{dur: number; title: string; items: string[]; done: number; active: number; phrases?: Phrase[]}> = ({dur, title, items, done, active, phrases = []}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Scene dur={dur}>
      <Stage v="pink">
        <div style={{position: 'absolute', left: 760, top: 130, width: 1040}}>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 84, color: '#fff', textAlign: 'right', direction: 'rtl', marginBottom: 26, opacity: prog(f, 2, 14),
            textShadow: '0 8px 24px rgba(0,0,0,.3)'}}>{title}</div>
          {items.map((q, i) => {
            const s = spr(f, fps, 8 + i * 8, {damping: 13, stiffness: 150});
            const isDone = i < done;
            const justDone = i === done - 1;
            const tick = isDone ? (justDone ? spr(f, fps, 40, {damping: 8, stiffness: 240}) : 1) : 0;
            const isAct = i === active - 1;
            const glow = isAct ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, direction: 'rtl', marginBottom: 26, padding: '22px 34px', borderRadius: 26,
                background: isAct ? '#fff' : 'rgba(255,255,255,.9)', opacity: Math.min(1, s * 1.5),
                transform: `translateX(${(1 - s) * -300}px) scale(${isAct ? 1.05 : 1})`, transformOrigin: 'right center',
                boxShadow: isAct ? `0 0 ${30 + glow * 30}px ${C.cyan}, 0 20px 40px rgba(0,0,0,.3)` : '0 16px 30px rgba(0,0,0,.25)'}}>
                <div style={{width: 84, height: 84, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone ? '#2ecc71' : isAct ? C.pink : C.plum, fontFamily: fonts.display, fontSize: 60, color: '#fff'}}>
                  {isDone ? <Check size={56} strokeWidth={4} style={{transform: `scale(${tick})`}} /> : i + 1}
                </div>
                <div style={{position: 'relative', fontFamily: fonts.ar, fontWeight: 700, fontSize: 52, color: '#1b0a20', unicodeBidi: 'plaintext'}}>
                  {q}
                  <div style={{position: 'absolute', right: 0, top: '52%', height: 6, width: `${tick * 100}%`, background: '#2ecc71', borderRadius: 3}} />
                </div>
              </div>
            );
          })}
        </div>
        <Mascot x={380} y={1080} h={640} delay={4} bubble="؟؟" bubbleAt={18} />
        {phrases.length > 0 && <Kinetic phrases={phrases} y={900} size={64} />}
      </Stage>
    </Scene>
  );
};

/* ================= VERSUS (two things face to face on galaxy) ================= */
export const Versus: React.FC<{dur: number; a: React.ReactNode; b: React.ReactNode; aLabel: string; bLabel: string; winAt?: number; phrases?: Phrase[]}> = ({
  dur, a, b, aLabel, bLabel, winAt, phrases = [],
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const vs = spr(f, fps, 18, {damping: 8, stiffness: 220});
  const win = winAt !== undefined ? spr(f, fps, winAt, {damping: 10, stiffness: 160}) : 0;
  const card = (node: React.ReactNode, label: string, side: -1 | 1, delay: number, isWin: boolean) => {
    const s = spr(f, fps, delay, {damping: 12});
    return (
      <div style={{position: 'absolute', left: W / 2 + side * 430, top: 450 + Math.sin((f + delay * 9) / 22) * 10,
        transform: `translate(-50%,-50%) rotate(${side * 4}deg) scale(${s * (isWin ? 1 + 0.12 * win : 1 - 0.1 * win)})`,
        filter: `brightness(${isWin ? 1 : 1 - 0.45 * win}) drop-shadow(0 0 ${isWin ? win * 60 : 0}px ${C.gold}) drop-shadow(0 30px 40px rgba(0,0,0,.5))`,
        display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {node}
        <div style={{marginTop: 18, fontFamily: fonts.arDisplay, fontSize: 60, color: '#fff', direction: 'rtl', background: side < 0 ? C.violet : C.pink,
          padding: '4px 30px', borderRadius: 16}}>{label}</div>
      </div>
    );
  };
  return (
    <Scene dur={dur}>
      <Stage v="galaxy">
        {card(a, aLabel, -1, 0, false)}
        {card(b, bLabel, 1, 8, true)}
        <div style={{position: 'absolute', left: W / 2 - 100, top: 340, width: 200, textAlign: 'center', fontFamily: fonts.display, fontSize: 180, color: '#fff',
          transform: `scale(${vs * (1 - 0.6 * win)}) rotate(${(1 - vs) * 40}deg)`, opacity: 1 - win, textShadow: neon(C.cyan, 1)}}>VS</div>
        {winAt !== undefined && f >= winAt && (
          <div style={{position: 'absolute', left: W / 2 + 430, top: 110, transform: `translate(-50%,0) scale(${win})`, fontFamily: fonts.arDisplay, fontSize: 64,
            color: '#1a1206', background: C.gold, padding: '6px 34px', borderRadius: 40, direction: 'rtl', boxShadow: `0 0 40px ${C.gold}`}}>الفائز 🏆</div>
        )}
        {phrases.length > 0 && <Kinetic phrases={phrases} y={905} size={64} />}
      </Stage>
    </Scene>
  );
};

/* ================= 3D WALL TIMELINE (mist stage: dates along a wall, camera dolly) ================= */
export const WallTimeline: React.FC<{dur: number; stops: {year: string; label: string; hot?: boolean; node?: React.ReactNode}[]; phrases?: Phrase[]; stamp?: {at: number; text: string}}> = ({
  dur, stops, phrases = [], stamp,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gap = 900;
  const cam = interpolate(f, [0, dur], [200, -gap * (stops.length - 1) - 100], {easing: ease.inOut});
  return (
    <Scene dur={dur}>
      <Stage v="mist">
        <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 45%'}}>
          <div style={{position: 'absolute', left: W / 2, top: 600, transformStyle: 'preserve-3d', transform: `rotateY(-16deg) translateX(${cam}px)`}}>
            <div style={{position: 'absolute', left: -900, top: 0, width: gap * stops.length + 1800, height: 3, background: 'rgba(40,40,50,.5)'}} />
            <div style={{position: 'absolute', left: -900, top: 0, width: (gap * stops.length + 1800) * prog(f, 0, dur * 0.85), height: 3, background: C.pink,
              boxShadow: `0 0 12px ${C.pink}`}} />
            {stops.map((s, i) => {
              const screenX = i * gap + cam;
              const focus = Math.min(1, Math.abs(screenX - 100) / 1300);
              const appear = spr(f, fps, 6 + i * 20, {damping: 14});
              return (
                <div key={i} style={{position: 'absolute', left: i * gap, top: 0, filter: `blur(${focus * 7}px)`, opacity: appear}}>
                  <div style={{position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', background: s.hot ? C.pink : '#fff',
                    boxShadow: '0 0 20px rgba(255,255,255,.8)'}} />
                  <div style={{position: 'absolute', left: -400, width: 800, top: 36, textAlign: 'center', fontFamily: fonts.display, fontSize: 170,
                    color: '#fff', textShadow: '0 10px 30px rgba(0,0,0,.25)', lineHeight: 1, direction: 'ltr'}}>{s.year}</div>
                  <div style={{position: 'absolute', left: -400, width: 800, top: 210, textAlign: 'center', fontFamily: fonts.ar, fontWeight: 700, fontSize: 40,
                    color: '#2a2a30', direction: 'rtl', unicodeBidi: 'plaintext'}}>{s.label}</div>
                  {s.node && (
                    <div style={{position: 'absolute', left: 0, top: -250, transform: `translate(-50%,-50%) rotate(${i % 2 ? 4 : -4}deg) translateY(${(1 - appear) * 80 + Math.sin((f + i * 30) / 26) * 8}px)`}}>
                      {s.node}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
        {stamp && <Stamp at={stamp.at} text={stamp.text} x={W / 2 + 330} y={560} size={70} color={C.pink} />}
        {phrases.length > 0 && <Kinetic dark phrases={phrases} y={905} size={66} hiColor={C.pink} />}
      </Stage>
    </Scene>
  );
};

/* ================= CORKBOARD (investigation board: "why did this happen?") ================= */
export const Corkboard: React.FC<{dur: number; center: React.ReactNode; pins: {x: number; y: number; cap: string; node: React.ReactNode}[]; stampAt: number; stamp: string; phrases?: Phrase[]}> = ({
  dur, center, pins, stampAt, stamp, phrases = [],
}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.0, 1.08]);
  const cx = W / 2, cy = 430;
  return (
    <Scene dur={dur}>
      <Stage v="cork">
        <AbsoluteFill style={{transform: `scale(${z})`}}>
          <svg width={W} height={1080} style={{position: 'absolute', inset: 0}}>
            {pins.map((p, i) => {
              const d0 = 8 + i * 6;
              const k = prog(f, d0 + 8, d0 + 26, ease.inOut);
              const len = Math.hypot(p.x - cx, p.y - cy) * 1.3;
              return <path key={i} d={`M ${cx} ${cy - 200} Q ${(p.x + cx) / 2} ${(p.y + cy) / 2 + 60} ${p.x} ${p.y - 110}`} stroke="#c4161c" strokeWidth={5} fill="none"
                strokeDasharray={len} strokeDashoffset={len * (1 - k)} style={{filter: 'drop-shadow(0 3px 2px rgba(0,0,0,.6))'}} />;
            })}
          </svg>
          {pins.map((p, i) => (
            <Float key={i} x={p.x} y={p.y} delay={8 + i * 6} rot={i % 2 ? 6 : -7}>
              <Polaroid w={340} cap={p.cap}>{p.node}</Polaroid>
            </Float>
          ))}
          <Float x={cx} y={cy} delay={0} rot={-3}><Polaroid w={560}>{center}</Polaroid></Float>
          <Stamp at={stampAt} text={stamp} x={cx + 140} y={cy + 80} size={84} />
        </AbsoluteFill>
        {phrases.length > 0 && <Kinetic phrases={phrases} y={930} size={66} />}
      </Stage>
    </Scene>
  );
};
const Polaroid: React.FC<{w: number; cap?: string; children: React.ReactNode}> = ({w, cap, children}) => (
  <div style={{background: '#f4f1ea', padding: '14px 14px 50px', boxShadow: '0 25px 40px rgba(0,0,0,.55)', width: w, position: 'relative'}}>
    <div style={{width: w - 28, height: (w - 28) * 0.6, overflow: 'hidden', position: 'relative'}}>{children}</div>
    {cap && <div style={{position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 30, color: '#333', direction: 'rtl'}}>{cap}</div>}
    <div style={{position: 'absolute', top: -12, left: '50%', marginLeft: -12, width: 24, height: 24, borderRadius: '50%', background: '#d11',
      boxShadow: 'inset -4px -4px 6px rgba(0,0,0,.4), 0 4px 6px rgba(0,0,0,.5)'}} />
  </div>
);

/* ================= MEME CARD (mascot reaction + speech bubble; your voice keeps going) ================= */
export const MemeCard: React.FC<{dur: number; txt: string}> = ({dur, txt}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = prog(f, 0, 5) * (1 - prog(f, dur - 6, dur, ease.in));
  const s = spr(f, fps, 0, {damping: 8, stiffness: 260});
  return (
    <AbsoluteFill style={{opacity: k}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 35% 70%, ${C.pink}55, rgba(0,0,0,.55) 70%)`}} />
      <AbsoluteFill style={{opacity: 0.25, mixBlendMode: 'screen', transform: `rotate(${f * 1.5}deg) scale(2)`,
        background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,.35) 0deg 6deg, transparent 6deg 20deg)'}} />
      <Mascot x={620} y={1100} h={720} delay={0} shake />
      <div style={{position: 'absolute', left: 1010, top: 300, transform: `scale(${s}) rotate(${(1 - s) * -10 - 3}deg)`, transformOrigin: '0% 100%',
        background: '#fff', borderRadius: 50, padding: '30px 56px', fontFamily: fonts.arDisplay, fontSize: 92, color: '#111', direction: 'rtl',
        boxShadow: '0 30px 60px rgba(0,0,0,.45)', whiteSpace: 'nowrap', border: `6px solid ${C.pink}`}}>{txt}</div>
    </AbsoluteFill>
  );
};
