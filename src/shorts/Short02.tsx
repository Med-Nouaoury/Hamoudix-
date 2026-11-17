import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AlertTriangle, Plane, Store, ThumbsUp} from 'lucide-react';
import {C, clamp, ease, fonts, neon, prog, spr} from '../theme';
import {Grain, Sfx} from '../fx';
import {BG, Burst, Captions, CapWord, CoverBG, FlashAt, Mascot, SH, SW, Shot, TopBar} from './kit';

/* =====================================================================
   SHORT 02 — "لماذا لم تطلق Rockstar لعبة GTA 6 في كل العالم في ثانية واحدة؟"
   Voice: Recording_11 (silences tightened 72 s → 51.5 s) • 9 shots
   ===================================================================== */
const F = (s: number) => Math.round(s * 30);
export const SHORT02_LEN = F(51.47) + 18;

const B = {
  second: F(4.03), lakin: F(5.23), sadi9ni: F(6.49), karitha: F(7.89),
  r1: F(8.26), infijar: F(9.33), fifty: F(11.23), stores: F(13.94), ps: F(15.32), xb: F(16.06),
  wazza3: F(17.07), h24: F(18.87), midnight: F(20.77),
  r2: F(22.33), shops: F(23.77), night: F(27.05), twelve: F(29.23),
  dawn: F(30.73),
  trick: F(33.15), nz: F(35.4), plus12: F(37.9), change: F(39.86),
  sub: F(43.08), ask: F(46.04), fly: F(48.83),
};

/* ---------- captions (Whisper timings on the tightened cut, text corrected) ---------- */
const w = (t: string, s: number, hi?: boolean): CapWord => ({t, f: F(s), hi});
const PAGES: CapWord[][] = [
  [w('Rockstar', 0, true), w('كان', 0.87), w('ممكن', 1.09), w('تطلق', 1.43)],
  [w('GTA 6', 2.05, true), w('لكل', 2.91), w('العالم', 3.31)],
  [w('في', 3.77), w('ثانية', 4.03, true), w('واحدة', 4.41, true), w('فقط!', 4.91)],
  [w('لكن', 5.23), w('لو', 5.55), w('فعلت', 5.73), w('هذا', 6.17)],
  [w('صدقني', 6.49), w('ستحدث', 7.17), w('كارثة!', 7.89, true)],
  [w('السبب', 8.26), w('الأول', 8.87, true)],
  [w('انفجار', 9.33, true), w('السيرفرات', 9.97)],
  [w('يدخل', 10.69), w('50', 11.23, true), w('مليون', 11.87, true), w('لاعب', 12.33)],
  [w('في', 12.9), w('نفس', 13.14), w('الثانية', 13.4)],
  [w('ستسقط', 13.94), w('متاجر', 14.76), w('PlayStation', 15.32), w('و', 15.94), w('Xbox', 16.06), w('فوراً', 16.64, true)],
  [w('لذلك', 17.07), w('وزّعوا', 17.75), w('الإطلاق', 18.19)],
  [w('على', 18.69), w('24', 18.87, true), w('ساعة', 19.69, true)],
  [w('حسب', 20.43), w('منتصف', 20.77, true), w('الليل', 21.25, true), w('في', 21.65), w('كل', 21.89), w('دولة', 22.07)],
  [w('السبب', 22.33), w('الثاني', 23.03, true)],
  [w('المحلات', 23.77, true), w('والنسخ', 24.41), w('الفيزيائية', 24.89)],
  [w('حتى', 25.59), w('يعيش', 25.93), w('كل', 26.19), w('بلد', 26.47)],
  [w('ليلة', 27.05, true), w('إطلاق', 27.43, true), w('خاصة', 27.87), w('به', 28.41)],
  [w('عند', 28.51), w('الساعة', 28.85), w('12', 29.23, true), w('ليلاً', 30.21)],
  [w('بدون', 30.73), w('أن', 31.09), w('يضطر', 31.25), w('أحد', 31.65)],
  [w('للاستيقاظ', 31.93), w('في', 32.6), w('الفجر', 32.77, true)],
  [w('لكن', 33.4), w('هناك', 33.72), w('خدعة', 34.28, true)],
  [w('لاعبو', 34.76), w('نيوزيلندا', 35.4, true)],
  [w('سيلعبونها', 36.1), w('قبلنا', 37.18)],
  [w('بـ', 37.82), w('12', 37.9, true), w('ساعة', 38.72, true), w('كاملة', 39.34)],
  [w('ويمكنك', 39.86), w('تغيير', 40.56), w('توقيت', 40.98), w('جهازك', 41.4, true)],
  [w('لتلعبها', 41.96), w('معهم', 42.6)],
  [w('اشترك', 43.08, true), w('الآن', 43.65)],
  [w('لنختمها', 44.05), w('معاً', 44.87), w('من', 45.19), w('الأول', 45.37, true)],
  [w('واكتب', 46.04), w('لي', 46.63)],
  [w('هل', 46.83), w('ستنتظر', 47.15), w('توقيت', 47.61), w('بلدك', 47.97, true)],
  [w('أم', 48.47), w('تسافر', 48.83), w('لنيوزيلندا؟', 49.33, true)],
];

/* ---------- small helpers ---------- */
const Title: React.FC<{text: string; at: number; y: number; color?: string; size?: number; sub?: string}> = ({text, at, y, color = '#fff', size = 120, sub}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spr(f, fps, at, {damping: 9, stiffness: 240});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${interpolate(s, [0, 1], [2, 1])}) rotate(-3deg)`, opacity: Math.min(1, s * 2)}}>
      {sub && <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 44, color: C.cyan, letterSpacing: '0.4em', direction: 'ltr', textShadow: neon(C.cyan, 0.4)}}>{sub}</div>}
      <div style={{fontFamily: fonts.arDisplay, fontSize: size, color, direction: 'rtl', lineHeight: 1.1, WebkitTextStroke: '4px #12021f', paintOrder: 'stroke fill',
        textShadow: `0 10px 0 #12021f, 0 0 40px ${color}66`}}>{text}</div>
    </div>
  );
};
/* rotating wire-frame globe (pure CSS/SVG) */
const Globe: React.FC<{size: number; x: number; y: number; red?: number; crack?: number}> = ({size, x, y, red = 0, crack = 0}) => {
  const f = useCurrentFrame();
  const r = size / 2;
  const col = red > 0.5 ? C.red : C.cyan;
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      background: `radial-gradient(circle at 35% 30%, ${red > 0.5 ? '#ff6b6b' : '#5ff0ff'}55, ${red > 0.5 ? '#3a0010' : '#0a1640'} 70%)`,
      boxShadow: `0 0 80px ${col}aa, inset -40px -40px 80px rgba(0,0,0,.6)`}}>
      <svg width={size} height={size}>
        {Array.from({length: 9}).map((_, i) => {
          const ph = ((f * 1.6 + i * 20) % 180) - 90;
          const rx = Math.abs(Math.sin((ph * Math.PI) / 180)) * r;
          return <ellipse key={`m${i}`} cx={r} cy={r} rx={rx} ry={r - 2} fill="none" stroke={col} strokeOpacity={0.55} strokeWidth={2} />;
        })}
        {[-0.66, -0.33, 0, 0.33, 0.66].map((k, i) => {
          const yy = r + k * r;
          const hw = Math.sqrt(Math.max(0, r * r - (k * r) ** 2));
          return <line key={`p${i}`} x1={r - hw} y1={yy} x2={r + hw} y2={yy} stroke={col} strokeOpacity={0.55} strokeWidth={2} />;
        })}
        {crack > 0 && (
          <path d={`M ${r} ${r * 0.1} L ${r * 0.9} ${r * 0.6} L ${r * 1.15} ${r * 0.9} L ${r * 0.85} ${r * 1.3} L ${r * 1.05} ${r * 1.9}`} fill="none" stroke="#fff"
            strokeWidth={10} strokeDasharray={size * 2} strokeDashoffset={size * 2 * (1 - crack)} style={{filter: `drop-shadow(0 0 12px ${C.red})`}} />
        )}
      </svg>
    </div>
  );
};

/* ================= 1. HOOK — one-second global launch ================= */
const S1: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const btn = spr(f, fps, 6, {damping: 10});
  const sec = B.second;
  const t = spr(f, fps, sec, {damping: 8, stiffness: 260});
  return (
    <Shot dur={dur}>
      <BG tint={C.violet} rays={0.15} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: prog(f, 0, 8)}}>
        <span style={{fontFamily: fonts.display, fontSize: 90, color: '#fff', letterSpacing: 10, background: '#000', padding: '4px 30px', borderRadius: 12,
          border: `3px solid ${C.gold}`}}>ROCKSTAR</span>
      </div>
      <Globe size={560} x={SW / 2} y={620} />
      {/* LAUNCH button */}
      <div style={{position: 'absolute', left: SW / 2, top: 1000, transform: `translate(-50%,0) scale(${btn})`, width: 620, height: 170, borderRadius: 85,
        background: `linear-gradient(180deg, #ff4d5e, #b0001a)`, boxShadow: `0 14px 0 #5a000c, 0 0 ${40 + 20 * Math.sin(f / 4)}px ${C.red}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 96, color: '#fff', letterSpacing: 8}}>LAUNCH 🌍</div>
      {f >= sec && (
        <div style={{position: 'absolute', left: SW / 2, top: 520, transform: `translate(-50%,-50%) scale(${interpolate(t, [0, 1], [2.6, 1])})`, fontFamily: fonts.display,
          fontSize: 300, color: '#fff', textShadow: neon(C.pink, 1.6), whiteSpace: 'nowrap'}}>1 SEC</div>
      )}
      <FlashAt at={sec} max={0.5} len={7} />
    </Shot>
  );
};

/* ================= 2. CATASTROPHE ================= */
const S2: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const press = B.sadi9ni - B.lakin;
  const boom = B.karitha - B.lakin;
  const pressed = f >= press;
  const alarm = pressed ? 0.5 + 0.5 * Math.sin(f / 2.2) : 0;
  const shake = f >= boom && f < boom + 16 ? 26 * (1 - (f - boom) / 16) : pressed ? 3 : 0;
  return (
    <Shot dur={dur} zoom={0.08}>
      <AbsoluteFill style={{transform: `translate(${Math.sin(f * 2.7) * shake}px, ${Math.cos(f * 2.1) * shake}px)`}}>
        <BG tint={pressed ? C.red : C.violet} rays={0.1} />
        <AbsoluteFill style={{background: C.red, opacity: alarm * 0.28, mixBlendMode: 'screen'}} />
        <Globe size={560} x={SW / 2} y={620} red={pressed ? 1 : 0} crack={prog(f, boom - 2, boom + 10)} />
        <div style={{position: 'absolute', left: SW / 2, top: 1000, transform: `translate(-50%,0) translateY(${pressed ? 12 : 0}px)`, width: 620, height: 170, borderRadius: 85,
          background: `linear-gradient(180deg, #ff4d5e, #b0001a)`, boxShadow: pressed ? `0 2px 0 #5a000c` : `0 14px 0 #5a000c`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: fonts.display, fontSize: 96, color: '#fff', letterSpacing: 8}}>LAUNCH 🌍</div>
        {!pressed && <div style={{position: 'absolute', left: interpolate(f, [0, press], [900, 600], clamp), top: interpolate(f, [0, press], [1400, 1080], clamp), fontSize: 130}}>👆</div>}
        {pressed && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 180, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: alarm}}>
            <AlertTriangle size={110} color={C.red} />
            <span style={{fontFamily: fonts.display, fontSize: 110, color: C.red, letterSpacing: 6, textShadow: neon(C.red, 0.6)}}>WARNING</span>
          </div>
        )}
        {f >= boom && (
          <div style={{position: 'absolute', left: SW / 2, top: 620, transform: `translate(-50%,-50%) rotate(-10deg) scale(${interpolate(spr(f, fps, boom, {damping: 8, stiffness: 260}), [0, 1], [3, 1])})`,
            border: `12px solid #fff`, background: C.red, color: '#fff', padding: '0 50px', borderRadius: 20, fontFamily: fonts.arDisplay, fontSize: 210,
            boxShadow: `0 0 80px ${C.red}`, whiteSpace: 'nowrap'}}>كارثة!</div>
        )}
        <Burst at={boom} seed="k" cy={620} n={110} />
      </AbsoluteFill>
      <FlashAt at={boom} max={1} len={10} />
    </Shot>
  );
};

/* ================= 3. REASON 1 — servers explode ================= */
const Rack: React.FC<{x: number; heat: number; dead: boolean; seed: string}> = ({x, heat, dead, seed}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: 470, width: 260, height: 520, borderRadius: 16, background: '#120a1c', border: `3px solid ${heat > 0.5 ? C.red : '#3a2a50'}`,
      boxShadow: `0 0 ${heat * 60}px ${C.red}`, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, transform: `translateX(${dead ? Math.sin(f * 3) * 6 : 0}px)`}}>
      {Array.from({length: 9}).map((_, i) => (
        <div key={i} style={{flex: 1, borderRadius: 6, background: '#22163a', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px'}}>
          {Array.from({length: 5}).map((__, j) => {
            const on = random(`${seed}${i}${j}${Math.floor(f / (dead ? 2 : 5))}`) > 0.4;
            const col = heat > 0.5 ? C.red : C.green;
            return <div key={j} style={{width: 12, height: 12, borderRadius: 6, background: on ? col : '#333', boxShadow: on ? `0 0 8px ${col}` : 'none'}} />;
          })}
          <div style={{flex: 1, height: 6, borderRadius: 3, background: '#3a2a50'}} />
        </div>
      ))}
    </div>
  );
};
const StoreCard: React.FC<{name: string; color: string; crashAt: number; x: number}> = ({name, color, crashAt, x}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spr(f, fps, 0, {damping: 12});
  const dead = f >= crashAt;
  const g = dead && f < crashAt + 12;
  return (
    <div style={{position: 'absolute', left: x, top: 560, width: 440, height: 560, borderRadius: 30, overflow: 'hidden', transform: `translateY(${(1 - s) * 400}px) rotate(${dead ? (x < 500 ? -4 : 4) : 0}deg)`,
      background: dead ? '#1a0008' : '#0d0d14', border: `4px solid ${dead ? C.red : color}`, boxShadow: `0 0 40px ${dead ? C.red : color}88`,
      filter: g ? `hue-rotate(${random('g' + f) * 180}deg)` : undefined}}>
      <div style={{height: 120, background: dead ? C.red : color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        fontFamily: fonts.label, fontWeight: 700, fontSize: 50, color: '#fff', transform: g ? `translateX(${(random('x' + f) - 0.5) * 60}px)` : undefined}}>
        <Store size={50} /> {name}
      </div>
      <div style={{padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
        {dead ? (
          <>
            <div style={{fontFamily: fonts.display, fontSize: 160, color: C.red, lineHeight: 1}}>503</div>
            <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 40, color: '#fff'}}>SERVER ERROR</div>
            <div style={{fontSize: 90}}>💥</div>
          </>
        ) : (
          <>
            <Img src={staticFile('art/gta6_ultimate.jpg')} style={{width: 260, height: 260, borderRadius: 14}} />
            <div style={{fontFamily: fonts.label, fontWeight: 600, fontSize: 34, color: '#fff'}}>Loading…</div>
          </>
        )}
      </div>
    </div>
  );
};
const S3: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inf = B.infijar - B.r1, fif = B.fifty - B.r1, st = B.stores - B.r1;
  const heat = prog(f, inf, inf + 20);
  const n = Math.round(interpolate(f, [fif, fif + 40], [0, 50_000_000], {...clamp, easing: ease.out}));
  const showStores = f >= st;
  return (
    <Shot dur={dur}>
      <BG tint={heat > 0.5 ? C.red : C.violet} rays={0.08} shake={f >= inf && f < inf + 12 ? 14 : 0} />
      <Title text="السبب الأول" sub="REASON 01" at={0} y={140} />
      {!showStores && (
        <>
          {[110, 410, 710].map((x, i) => <Rack key={i} x={x} heat={heat} dead={heat > 0.9} seed={`r${i}`} />)}
          {heat > 0.3 && Array.from({length: 18}).map((_, i) => {
            const t = (f - inf + i * 7) % 60;
            return <div key={i} style={{position: 'absolute', left: 150 + (i % 6) * 150 + Math.sin(t / 6 + i) * 30, top: 470 - t * 6, width: 90, height: 90, borderRadius: '50%',
              background: 'rgba(120,120,130,.35)', filter: 'blur(14px)', opacity: 1 - t / 60}} />;
          })}
          {f >= fif && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 1030, textAlign: 'center', transform: `scale(${spr(f, fps, fif, {damping: 9, stiffness: 240})})`}}>
              <div style={{fontFamily: fonts.display, fontSize: 170, color: '#fff', textShadow: neon(C.pink, 1.2), direction: 'ltr', lineHeight: 1}}>{n.toLocaleString('en-US')}</div>
              <div style={{fontFamily: fonts.label, fontWeight: 700, fontSize: 46, color: C.gold, letterSpacing: '0.3em'}}>PLAYERS / 1 SEC</div>
            </div>
          )}
        </>
      )}
      {showStores && (
        <Sequence from={st} layout="none">
          <StoreCard name="PS Store" color="#0070d1" crashAt={B.ps - B.stores} x={70} />
          <StoreCard name="Xbox Store" color="#107c10" crashAt={B.xb - B.stores} x={570} />
        </Sequence>
      )}
      <Burst at={inf} seed="s3" cy={700} n={60} />
      <Burst at={B.ps - B.r1} seed="s3p" cx={290} cy={840} n={40} />
      <Burst at={B.xb - B.r1} seed="s3x" cx={790} cy={840} n={40} />
    </Shot>
  );
};

/* ================= 4. the 24-hour midnight wave ================= */
const CITIES = [
  {n: 'نيوزيلندا', e: '🇳🇿'}, {n: 'اليابان', e: '🇯🇵'}, {n: 'الإمارات', e: '🇦🇪'}, {n: 'السعودية', e: '🇸🇦'},
  {n: 'مصر', e: '🇪🇬'}, {n: 'المغرب', e: '🇲🇦'}, {n: 'بريطانيا', e: '🇬🇧'}, {n: 'أمريكا', e: '🇺🇸'},
];
const S4: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h24 = B.h24 - B.wazza3;
  const wave = prog(f, 6, dur - 6, ease.inOut);
  return (
    <Shot dur={dur}>
      <BG tint={C.violet} rays={0.06} />
      {/* 24h ring */}
      <div style={{position: 'absolute', left: SW / 2 - 200, top: 150, width: 400, height: 400, transform: `scale(${spr(f, fps, h24, {damping: 10})})`}}>
        <svg width={400} height={400} style={{transform: 'rotate(-90deg)'}}>
          <circle cx={200} cy={200} r={170} stroke="rgba(255,255,255,.12)" strokeWidth={22} fill="none" />
          <circle cx={200} cy={200} r={170} stroke={C.cyan} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={2 * Math.PI * 170}
            strokeDashoffset={2 * Math.PI * 170 * (1 - wave)} style={{filter: `drop-shadow(0 0 12px ${C.cyan})`}} />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: fonts.display, fontSize: 170, color: '#fff', lineHeight: 0.9}}>24</div>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 60, color: C.cyan}}>ساعة</div>
        </div>
      </div>
      {/* list of countries lighting up as midnight passes */}
      <div style={{position: 'absolute', left: 90, right: 90, top: 600, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, direction: 'rtl'}}>
        {CITIES.map((c, i) => {
          const lit = wave * CITIES.length > i;
          const s = spr(f, fps, 4 + i * 3, {damping: 13});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderRadius: 22, transform: `scale(${s * (lit ? 1.03 : 1)})`,
              background: lit ? `linear-gradient(90deg, ${C.pink}, ${C.violet})` : 'rgba(255,255,255,.07)', border: `2px solid ${lit ? '#fff' : 'rgba(255,255,255,.15)'}`,
              boxShadow: lit ? neon(C.pink, 0.5) : 'none'}}>
              <span style={{fontSize: 56}}>{c.e}</span>
              <span style={{fontFamily: fonts.arDisplay, fontSize: 46, color: '#fff', flex: 1}}>{c.n}</span>
              <span style={{fontFamily: fonts.display, fontSize: 52, color: lit ? '#fff' : 'rgba(255,255,255,.35)', direction: 'ltr'}}>{lit ? '00:00 ✓' : '--:--'}</span>
            </div>
          );
        })}
      </div>
    </Shot>
  );
};

/* ================= 5. REASON 2 — shops & launch night ================= */
const S5: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shops = B.shops - B.r2, night = B.night - B.r2, tw = B.twelve - B.r2;
  const fw = f >= night;
  return (
    <Shot dur={dur}>
      <BG tint={fw ? C.pink : C.violet} rays={fw ? 0.3 : 0.08} />
      <Title text="السبب الثاني" sub="REASON 02" at={0} y={140} />
      {/* shop window with boxes */}
      <div style={{position: 'absolute', left: SW / 2, top: 480, transform: `translate(-50%,0) scale(${spr(f, fps, shops, {damping: 12})})`, width: 900, height: 600,
        borderRadius: 26, background: 'linear-gradient(180deg, #1c1030, #0b0612)', border: `4px solid ${C.cyan}`, boxShadow: neon(C.cyan, 0.5), overflow: 'hidden'}}>
        <div style={{height: 100, background: C.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: fonts.arDisplay, fontSize: 60, color: C.night}}>
          <Store size={56} /> متجر الألعاب
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 22, padding: '40px 30px 0'}}>
          {[0, 1, 2, 3].map((i) => {
            const s = spr(f, fps, shops + 6 + i * 4, {damping: 10});
            return <Img key={i} src={staticFile('art/gta6_ultimate.jpg')} style={{width: 180, height: 180, borderRadius: 10, transform: `translateY(${(1 - s) * -300}px) rotate(${(i - 1.5) * 3}deg)`,
              boxShadow: '0 20px 30px rgba(0,0,0,.5)'}} />;
          })}
        </div>
        {/* queue */}
        <div style={{position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6}}>
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} style={{fontSize: 64, transform: `translateY(${Math.sin(f / 5 + i) * 6}px)`, opacity: prog(f, shops + 10 + i * 2, shops + 14 + i * 2)}}>🧍</div>
          ))}
        </div>
      </div>
      {fw && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 480, height: 600, pointerEvents: 'none'}}>
          {Array.from({length: 5}).map((_, i) => <Burst key={i} at={night + i * 9} seed={`fw${i}`} cx={180 + i * 180} cy={120 + (i % 2) * 140} n={40} />)}
        </div>
      )}
      {f >= tw && (
        <div style={{position: 'absolute', left: SW / 2, top: 830, transform: `translate(-50%,-50%) scale(${interpolate(spr(f, fps, tw, {damping: 8, stiffness: 240}), [0, 1], [2.4, 1])})`,
          background: '#000', border: `6px solid ${C.pink}`, borderRadius: 30, padding: '0 50px', fontFamily: fonts.display, fontSize: 230, color: '#fff',
          textShadow: neon(C.pink, 1.2), boxShadow: neon(C.pink, 0.8)}}>00:00</div>
      )}
    </Shot>
  );
};

/* ================= 6. nobody wakes up at dawn ================= */
const S6: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = Math.sin(f * 2.4) * 10;
  const no = spr(f, fps, 34, {damping: 8, stiffness: 260});
  return (
    <Shot dur={dur}>
      <BG tint="#3a4bff" rays={0.05} />
      <div style={{position: 'absolute', left: SW / 2, top: 560, transform: `translate(-50%,-50%) rotate(${ring}deg)`, fontSize: 380}}>⏰</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 780, textAlign: 'center', fontFamily: fonts.display, fontSize: 200, color: '#fff', textShadow: neon('#3a4bff', 1)}}>05:00</div>
      <div style={{position: 'absolute', left: SW / 2, top: 600, width: 700, height: 24, borderRadius: 12, background: C.red, transform: `translate(-50%,-50%) rotate(-30deg) scaleX(${no})`,
        boxShadow: neon(C.red, 0.6)}} />
      <Mascot x={SW - 230} y={1300} h={340} delay={4} bubble="😴" />
    </Shot>
  );
};

/* ================= 7. THE TRICK — New Zealand +12h ================= */
const S7: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nz = B.nz - B.trick, p12 = B.plus12 - B.trick, ch = B.change - B.trick;
  const showSettings = f >= ch;
  const sel = prog(f, ch + 30, ch + 44);
  return (
    <Shot dur={dur}>
      <CoverBG src="art/p_boat.jpg" blur={14} dim={0.45} tint={C.cyan} rays={0.15} />
      <Title text="خدعة 🤫" sub="SECRET TRICK" at={0} y={140} color={C.gold} size={150} />
      {!showSettings && f >= nz && (
        <div style={{position: 'absolute', left: SW / 2, top: 700, transform: `translate(-50%,-50%) scale(${spr(f, fps, nz, {damping: 10})})`, display: 'flex', flexDirection: 'column',
          alignItems: 'center'}}>
          <div style={{fontSize: 300, lineHeight: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,.5))'}}>🇳🇿</div>
          <div style={{fontFamily: fonts.arDisplay, fontSize: 96, color: '#fff', WebkitTextStroke: '3px #12021f', paintOrder: 'stroke fill'}}>نيوزيلندا</div>
        </div>
      )}
      {!showSettings && f >= p12 && (
        <div style={{position: 'absolute', left: SW / 2, top: 1080, transform: `translate(-50%,-50%) rotate(-6deg) scale(${interpolate(spr(f, fps, p12, {damping: 8, stiffness: 240}), [0, 1], [2.6, 1])})`,
          fontFamily: fonts.display, fontSize: 230, color: C.gold, textShadow: `${neon(C.gold, 1)}, 0 10px 0 #3a2400`, whiteSpace: 'nowrap'}}>+12H</div>
      )}
      {showSettings && (
        <div style={{position: 'absolute', left: SW / 2, top: 520, transform: `translate(-50%,0) scale(${spr(f, fps, ch, {damping: 12})})`, width: 860, borderRadius: 30,
          background: 'rgba(14,14,22,.95)', border: '3px solid rgba(255,255,255,.2)', boxShadow: '0 40px 80px rgba(0,0,0,.6)', overflow: 'hidden', direction: 'rtl'}}>
          <div style={{padding: '24px 36px', background: 'rgba(255,255,255,.06)', fontFamily: fonts.arDisplay, fontSize: 56, color: '#fff'}}>⚙️ الإعدادات</div>
          <div style={{padding: '30px 36px'}}>
            <div style={{fontFamily: fonts.ar, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,.7)', marginBottom: 16}}>المنطقة الزمنية</div>
            <div style={{position: 'relative', height: 110, borderRadius: 20, background: '#1f1f2e', border: `3px solid ${C.cyan}`, overflow: 'hidden'}}>
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px', transform: `translateY(${-sel * 110}px)`}}>
                <span style={{fontSize: 60}}>🇲🇦</span><span style={{fontFamily: fonts.arDisplay, fontSize: 56, color: '#fff'}}>المغرب</span>
              </div>
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 20, padding: '0 30px', transform: `translateY(${(1 - sel) * 110}px)`}}>
                <span style={{fontSize: 60}}>🇳🇿</span><span style={{fontFamily: fonts.arDisplay, fontSize: 56, color: C.gold}}>نيوزيلندا</span>
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', left: interpolate(f, [ch, ch + 26], [700, 120], {...clamp, easing: ease.inOut}), top: 200, fontSize: 100}}>👆</div>
        </div>
      )}
      {showSettings && f >= ch + 40 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 80, color: C.green,
          transform: `scale(${spr(f, fps, ch + 40, {damping: 9})})`, WebkitTextStroke: '3px #12021f', paintOrder: 'stroke fill'}}>العب قبل الجميع 🎮</div>
      )}
      <Burst at={p12} seed="s7" cy={1080} n={70} />
    </Shot>
  );
};

/* ================= 8. SUBSCRIBE ================= */
const S8: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const click = 18;
  const subbed = f >= click;
  return (
    <Shot dur={dur}>
      <CoverBG src="art/p_jason_lucia.jpg" blur={10} dim={0.5} rays={0.2} />
      <div style={{position: 'absolute', left: SW / 2, top: 300, transform: `translate(-50%,0) scale(${spr(f, fps, 0, {damping: 11})}) rotate(-4deg)`, width: 640, height: 400,
        borderRadius: 28, overflow: 'hidden', border: `5px solid ${C.pink}`, boxShadow: neon(C.pink, 0.9)}}>
        <Img src={staticFile('art/p_jason_lucia.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 24px', background: 'linear-gradient(0deg, rgba(14,4,24,.95), transparent)',
          fontFamily: fonts.display, fontSize: 80, color: '#fff', direction: 'ltr'}}>EP01 • GTA VI</div>
      </div>
      <div style={{position: 'absolute', left: SW / 2, top: 800, transform: `translate(-50%,0) scale(${spr(f, fps, 4, {damping: 11}) * (f >= click && f < click + 6 ? 0.9 : 1)})`,
        width: 680, height: 140, borderRadius: 70, background: subbed ? '#2a1838' : '#e1182a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
        fontFamily: fonts.arDisplay, fontSize: 72, color: '#fff', boxShadow: subbed ? 'none' : '0 0 50px rgba(225,24,42,.7)'}}>
        {subbed ? 'تم الاشتراك ✔' : 'اشترك الآن'}
      </div>
      <div style={{position: 'absolute', left: SW / 2, top: 980, transform: `translate(-50%,0) scale(${spr(f, fps, 10, {damping: 11})})`, display: 'flex', alignItems: 'center', gap: 16,
        background: '#fff', borderRadius: 60, padding: '16px 40px', fontFamily: fonts.arDisplay, fontSize: 56, color: C.night}}>
        <ThumbsUp size={56} fill={f >= click + 20 ? C.pink : 'none'} color={C.pink} /> لايك
      </div>
      <div style={{position: 'absolute', left: interpolate(f, [0, click], [900, 600], {...clamp, easing: ease.inOut}), top: interpolate(f, [0, click], [1300, 860], {...clamp, easing: ease.inOut}),
        fontSize: 120}}>👆</div>
      <Burst at={click} seed="s8" cy={870} n={50} />
    </Shot>
  );
};

/* ================= 9. POLL — wait or fly? ================= */
const S9: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fly = B.fly - B.ask;
  const planeX = interpolate(f, [fly, fly + 50], [-200, SW + 200], clamp);
  return (
    <Shot dur={dur} zoom={0.03}>
      <BG tint={C.pink} rays={0.15} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: fonts.arDisplay, fontSize: 96, color: '#fff', WebkitTextStroke: '3px #12021f',
        paintOrder: 'stroke fill', transform: `scale(${spr(f, fps, 0, {damping: 10})})`}}>ماذا ستختار؟ 🤔</div>
      {[
        {e: '⏰', t: 'أنتظر توقيت بلدي', c: C.cyan, d: 6},
        {e: '✈️', t: 'أسافر لنيوزيلندا', c: C.gold, d: fly - 4},
      ].map((o, i) => {
        const s = spr(f, fps, o.d, {damping: 10});
        return (
          <div key={i} style={{position: 'absolute', left: SW / 2, top: 420 + i * 300, transform: `translate(-50%,0) scale(${s}) rotate(${i ? 2 : -2}deg)`, width: 860, height: 230,
            borderRadius: 34, background: 'rgba(14,4,24,.85)', border: `5px solid ${o.c}`, boxShadow: neon(o.c, 0.6), display: 'flex', alignItems: 'center', gap: 30,
            padding: '0 44px', direction: 'rtl'}}>
            <span style={{fontSize: 120}}>{o.e}</span>
            <span style={{fontFamily: fonts.arDisplay, fontSize: 72, color: '#fff'}}>{o.t}</span>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: SW / 2, top: 1040, transform: `translate(-50%,0) scale(${spr(f, fps, 20, {damping: 9})})`, fontFamily: fonts.arDisplay, fontSize: 70,
        color: C.gold}}>اكتب في التعليقات 👇</div>
      {f >= fly && <Plane size={150} color="#fff" style={{position: 'absolute', left: planeX, top: 340 + Math.sin(f / 6) * 20, transform: 'rotate(45deg)',
        filter: `drop-shadow(0 0 20px ${C.gold})`}} />}
    </Shot>
  );
};

/* ================= TIMELINE ================= */
const SHOTS = [
  {C: S1, from: 0, to: B.lakin},
  {C: S2, from: B.lakin, to: B.r1},
  {C: S3, from: B.r1, to: B.wazza3},
  {C: S4, from: B.wazza3, to: B.r2},
  {C: S5, from: B.r2, to: B.dawn},
  {C: S6, from: B.dawn, to: B.trick},
  {C: S7, from: B.trick, to: B.sub},
  {C: S8, from: B.sub, to: B.ask},
  {C: S9, from: B.ask, to: SHORT02_LEN},
];

export const Short02: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SHOTS.map(({C: S, from, to}, i) => (
      <Sequence key={i} from={from} durationInFrames={to - from}>
        <S dur={to - from} />
      </Sequence>
    ))}
    <Captions pages={PAGES} total={SHORT02_LEN} y={1330} />
    <TopBar total={SHORT02_LEN} />
    <Grain opacity={0.05} />
    <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 55%, rgba(5,0,10,.55) 100%)'}} />

    <Audio src={staticFile('shorts/s02_voice.wav')} volume={1} />
    <Audio src={staticFile('shorts/s02_music.wav')} volume={0.12} />
    <Sfx n="pop" at={6} v={0.4} />
    <Sfx n="impact" at={B.second} v={0.55} />
    <Sfx n="click" at={B.sadi9ni} v={0.8} />
    <Sfx n="glitch" at={B.sadi9ni + 4} v={0.35} />
    <Sfx n="riser" at={B.karitha - 24} v={0.35} />
    <Sfx n="boom" at={B.karitha} v={0.85} />
    <Sfx n="impact" at={B.r1} v={0.5} />
    <Sfx n="boom" at={B.infijar} v={0.5} />
    <Sfx n="ding" at={B.fifty} v={0.3} />
    <Sfx n="whoosh" at={B.stores} v={0.35} />
    <Sfx n="glitch" at={B.ps} v={0.5} />
    <Sfx n="glitch" at={B.xb} v={0.5} />
    <Sfx n="whoosh" at={B.wazza3 - 3} v={0.35} />
    <Sfx n="pop" at={B.h24} v={0.4} />
    <Sfx n="impact" at={B.r2} v={0.5} />
    <Sfx n="pop" at={B.shops + 6} v={0.3} />
    <Sfx n="boom" at={B.night} v={0.4} />
    <Sfx n="impact" at={B.twelve} v={0.55} />
    <Sfx n="ding" at={B.dawn} v={0.35} />
    <Sfx n="riser" at={B.trick - 20} v={0.35} />
    <Sfx n="whoosh" at={B.trick} v={0.4} />
    <Sfx n="pop" at={B.nz} v={0.4} />
    <Sfx n="boom" at={B.plus12} v={0.6} />
    <Sfx n="click" at={B.change + 26} v={0.6} />
    <Sfx n="ding" at={B.change + 40} v={0.35} />
    <Sfx n="whoosh" at={B.sub - 3} v={0.35} />
    <Sfx n="click" at={B.sub + 18} v={0.7} />
    <Sfx n="whoosh" at={B.ask - 3} v={0.35} />
    <Sfx n="whoosh" at={B.fly} v={0.5} />
  </AbsoluteFill>
);
