import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BellRing, ThumbsUp} from 'lucide-react';
import {C, H, W, clamp, ease, envelope, fonts, neon, prog, spr} from './theme';
import {Circuit, Flash, Sfx, Sparks, Vignette} from './fx';

/* ================= WORDMARK: HAMOUDI + neon X (like the banner) ================= */
export const Wordmark: React.FC<{size?: number; start?: number; showTag?: boolean}> = ({size = 200, start = 0, showTag = true}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const letters = 'HAMOUDI'.split('');
  const xs = spr(f, fps, start + 26, {damping: 8, stiffness: 240});
  const tag = prog(f, start + 40, start + 58);
  const sheenP = prog(f, start + 34, start + 64, ease.inOut);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{position: 'relative', display: 'flex', alignItems: 'flex-end', direction: 'ltr'}}>
        {letters.map((l, i) => {
          const s = spr(f, fps, start + i * 3, {damping: 11, stiffness: 200});
          return (
            <span key={i} style={{fontFamily: fonts.logo, fontSize: size, lineHeight: 1, display: 'inline-block', letterSpacing: -2,
              background: `linear-gradient(180deg, #ffffff 0%, #e9fbff 45%, #8ef0ff 60%, #ffffff 100%)`, WebkitBackgroundClip: 'text', color: 'transparent',
              WebkitTextStroke: `${size * 0.012}px rgba(54,224,255,.9)`,
              filter: `drop-shadow(0 0 ${size * 0.06}px ${C.cyan}) drop-shadow(0 ${size * 0.04}px 0 #1a0630)`,
              opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * -size * 0.9}px) scale(${0.6 + 0.4 * s})`}}>{l}</span>
          );
        })}
        <span style={{fontFamily: fonts.logo, fontSize: size * 1.22, lineHeight: 0.92, display: 'inline-block', marginLeft: size * 0.03,
          background: `linear-gradient(160deg, #ffb3df 0%, ${C.pink} 45%, #b0127a 100%)`, WebkitBackgroundClip: 'text', color: 'transparent',
          filter: `drop-shadow(0 0 ${size * 0.08}px ${C.pink}) drop-shadow(0 0 ${size * 0.2}px ${C.pink}aa)`,
          transform: `scale(${interpolate(xs, [0, 1], [3.2, 1])}) rotate(${(1 - xs) * -30}deg)`, opacity: Math.min(1, xs * 2)}}>X</span>
        {/* light sweep over the wordmark */}
        <div style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', pointerEvents: 'none',
          background: `linear-gradient(100deg, transparent ${sheenP * 140 - 40}%, rgba(255,255,255,.95) ${sheenP * 140 - 28}%, transparent ${sheenP * 140 - 16}%)`}} />
      </div>
      {showTag && (
        <div style={{marginTop: size * 0.08, fontFamily: fonts.label, fontWeight: 600, fontSize: size * 0.17, color: '#fff', direction: 'ltr', whiteSpace: 'nowrap',
          letterSpacing: `${interpolate(tag, [0, 1], [0.8, 0.22])}em`, opacity: tag, textShadow: `0 0 12px ${C.pink}`}}>
          GAMING <span style={{color: C.pink}}>•</span> WALKTHROUGHS <span style={{color: C.pink}}>•</span> RETRO
        </div>
      )}
    </div>
  );
};

/* ================= BIG NEON "X" EMBLEM (background element of the brand) ================= */
export const XEmblem: React.FC<{p: number; size?: number; opacity?: number}> = ({p, size = 900, opacity = 1}) => {
  const bar = (rot: number, color: string, delay: number) => {
    const k = Math.min(1, Math.max(0, (p - delay) / (1 - delay)));
    return (
      <div style={{position: 'absolute', left: '50%', top: '50%', width: size * 0.22, height: size * 1.15 * k,
        transform: `translate(-50%,-50%) rotate(${rot}deg) skewY(0deg)`, border: `6px solid ${color}`, borderRadius: 6,
        background: `linear-gradient(180deg, ${color}55, ${color}11)`, boxShadow: neon(color, 1.2)}} />
    );
  };
  return (
    <div style={{position: 'absolute', left: W / 2 - size / 2, top: H / 2 - size / 2, width: size, height: size, opacity}}>
      {bar(32, C.pink, 0)}
      {bar(-32, C.violet, 0.15)}
      <div style={{position: 'absolute', inset: '30%', borderRadius: '50%', background: `radial-gradient(circle, ${C.cyan}66, transparent 70%)`, opacity: p}} />
    </div>
  );
};

/* ================= CHANNEL INTRO STING (~4.5 s) ================= */
export const INTRO_LEN = 135;
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const emb = prog(f, 4, 30, ease.out);
  const out = prog(f, INTRO_LEN - 12, INTRO_LEN, ease.in);
  const shake = f >= 30 && f < 44 ? Math.sin((f - 30) * 3.1) * 14 * (1 - (f - 30) / 14) : 0;
  const av = spr(f, fps, 64, {damping: 11, stiffness: 180});
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 80% at 50% 45%, #b3127e 0%, #4a0f73 45%, ${C.night} 100%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${shake}px) scale(${1 + out * 0.5})`, filter: `blur(${out * 18}px)`, opacity: 1 - out}}>
        <Circuit p={prog(f, 0, 40, ease.inOut)} />
        <XEmblem p={emb} size={980} opacity={0.38} />
        <Sparks n={90} seed="introAmb" opacity={0.9} />
        <Sparks n={90} seed="introBurst" burstAt={30} />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: 'translateY(-30px)'}}>
          <Wordmark size={210} start={4} />
        </AbsoluteFill>
        {/* avatar badge */}
        <div style={{position: 'absolute', left: W / 2 - 80, top: 800, width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
          border: `5px solid ${C.cyan}`, boxShadow: neon(C.pink, 1), transform: `scale(${av}) rotate(${(1 - av) * 90}deg)`}}>
          <Img src={staticFile('brand/avatar_full.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </AbsoluteFill>
      <Flash at={30} len={10} max={0.75} />
      <Vignette strength={0.6} />
      <Sfx n="riser" at={0} v={0.5} />
      <Sfx n="impact" at={29} v={0.8} />
      <Sfx n="pop" at={64} v={0.5} />
      <Sfx n="whoosh" at={INTRO_LEN - 14} v={0.4} />
    </AbsoluteFill>
  );
};

/* ================= MASCOT (channel character: pop + squash + bob + speech bubble) ================= */
export const Mascot: React.FC<{x: number; y: number; h?: number; delay?: number; bubble?: string; bubbleAt?: number; flip?: boolean; shake?: boolean; out?: number}> = ({
  x, y, h = 420, delay = 0, bubble, bubbleAt, flip, shake, out = 0,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spr(f, fps, delay, {damping: 9, stiffness: 180});
  const t = f - delay;
  const squash = t >= 0 && t < 14 ? 1 + 0.12 * Math.sin((t / 14) * Math.PI) * Math.exp(-t / 10) : 1;
  const bob = Math.sin(f / 14) * 6;
  const sh = shake && t > 0 && t < 18 ? Math.sin(t * 2.4) * 10 * (1 - t / 18) : 0;
  const bs = bubble ? spr(f, fps, bubbleAt ?? delay + 8, {damping: 8, stiffness: 240}) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-100%) translateY(${(1 - s) * 500 + bob + out * 600}px) translateX(${sh}px)`,
      opacity: Math.min(1, s * 2)}}>
      <Img src={staticFile('brand/mascot.png')} style={{height: h, display: 'block', transformOrigin: '50% 100%',
        transform: `scaleX(${(flip ? -1 : 1) / squash}) scaleY(${squash})`, filter: `drop-shadow(0 0 30px ${C.pink}88) drop-shadow(0 30px 40px rgba(0,0,0,.5))`}} />
      {bubble && (
        <div style={{position: 'absolute', left: flip ? -h * 0.2 : h * 0.66, top: -h * 0.02, transform: `scale(${bs})`, transformOrigin: flip ? '100% 100%' : '0% 100%',
          background: '#fff', borderRadius: 40, padding: '14px 30px', fontFamily: fonts.arDisplay, fontSize: h * 0.12, color: '#111', whiteSpace: 'nowrap',
          boxShadow: `0 16px 30px rgba(0,0,0,.35), 0 0 0 5px ${C.pink}`, direction: 'rtl'}}>
          {bubble}
        </div>
      )}
    </div>
  );
};

/* ================= SUBSCRIBE CTA (cursor clicks like → subscribe → bell) ================= */
const YtIcon: React.FC<{size?: number}> = ({size = 40}) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 40 29">
    <rect x="0" y="0" width="40" height="29" rx="8" fill="#fff" />
    <path d="M16 8 L27 14.5 L16 21 Z" fill="#e1182a" />
  </svg>
);
export const Subscribe: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [, o] = envelope(f, dur, 18, 16);
  const s = spr(f, fps, 0, {damping: 14});
  const likeAt = 26, subAt = 52, bellAt = 76;
  const kx = interpolate(f, [0, likeAt, subAt, bellAt, bellAt + 30], [560, -290, 30, 310, 430], {...clamp, easing: ease.inOut});
  const ky = interpolate(f, [0, likeAt, subAt, bellAt, bellAt + 30], [200, 20, 20, 20, 160], {...clamp, easing: ease.inOut});
  const press = (at: number) => (f >= at && f < at + 6 ? 0.9 : 1);
  const liked = f >= likeAt, subbed = f >= subAt, belled = f >= bellAt;
  const bellRot = belled ? Math.sin((f - bellAt) * 0.9) * 22 * Math.exp(-(f - bellAt) / 18) : 0;
  const btn: React.CSSProperties = {height: 92, borderRadius: 46, display: 'flex', alignItems: 'center', gap: 16, padding: '0 34px',
    fontFamily: fonts.ar, fontWeight: 700, fontSize: 38, boxShadow: '0 20px 40px rgba(0,0,0,.5)'};
  return (
    <div style={{position: 'absolute', left: '50%', top: 860, opacity: 1 - o, filter: `blur(${o * 8}px)`, transform: `translateX(-50%) scale(${s})`}}>
      <div style={{position: 'relative', display: 'flex', gap: 22, alignItems: 'center', direction: 'ltr'}}>
        <div style={{position: 'absolute', left: -170, top: -40, transform: `scale(${spr(f, fps, 6, {damping: 10})})`}}>
          <div style={{width: 150, height: 150, borderRadius: '50%', overflow: 'hidden', border: `4px solid ${C.cyan}`, boxShadow: neon(C.pink, 0.8)}}>
            <Img src={staticFile('brand/avatar_full.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        </div>
        <div style={{...btn, background: liked ? '#fff' : 'rgba(20,6,32,.9)', color: liked ? C.ink : '#fff', border: `2px solid ${C.cyan}55`, transform: `scale(${press(likeAt)})`}}>
          <ThumbsUp size={40} fill={liked ? C.pink : 'none'} color={liked ? C.pink : '#fff'} />
          <span>لايك</span>
        </div>
        <div style={{...btn, background: subbed ? '#2a1838' : '#e1182a', color: '#fff', transform: `scale(${press(subAt)})`, minWidth: 300, justifyContent: 'center'}}>
          <YtIcon size={46} />
          <span>{subbed ? 'تم الاشتراك' : 'اشترك'}</span>
        </div>
        <div style={{...btn, padding: 0, width: 92, justifyContent: 'center', background: belled ? C.pink : 'rgba(20,6,32,.9)', border: `2px solid ${C.cyan}55`,
          transform: `scale(${press(bellAt)})`}}>
          <BellRing size={42} color="#fff" style={{transform: `rotate(${bellRot}deg)`, transformOrigin: '50% 10%'}} />
        </div>
        {[likeAt, subAt, bellAt].map((at, i) => {
          const r = prog(f, at, at + 16);
          const x = [-290, 30, 310][i];
          return r > 0 && r < 1 ? (
            <div key={i} style={{position: 'absolute', left: `calc(50% + ${x}px)`, top: 46, width: 140 * r, height: 140 * r, marginLeft: -70 * r, marginTop: -70 * r,
              borderRadius: '50%', border: `3px solid ${C.cyan}`, opacity: 1 - r}} />
          ) : null;
        })}
        <svg width="46" height="60" viewBox="0 0 46 60" style={{position: 'absolute', left: `calc(50% + ${kx}px)`, top: 46 + ky, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.6))'}}>
          <path d="M3 3 L3 47 L14 37 L22 56 L31 52 L23 34 L38 34 Z" fill="#fff" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

/* ================= PERSISTENT: watermark + video progress bar ================= */
export const Persistent: React.FC<{total: number; chapters?: number[]}> = ({total, chapters = []}) => {
  const f = useCurrentFrame();
  const p = f / total;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: 'rgba(0,0,0,.35)'}}>
        <div style={{height: '100%', width: `${p * 100}%`, background: `linear-gradient(90deg, ${C.violet}, ${C.pink})`, boxShadow: `0 0 12px ${C.pink}`}} />
        {chapters.map((c, i) => (
          <div key={i} style={{position: 'absolute', left: `${(c / total) * 100}%`, top: -3, width: 3, height: 12, background: C.cyan}} />
        ))}
      </div>
      <div style={{position: 'absolute', top: 30, right: 40, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.75 * prog(f, 30, 60), direction: 'ltr'}}>
        <div style={{width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${C.cyan}`}}>
          <Img src={staticFile('brand/avatar_full.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div style={{fontFamily: fonts.logo, fontSize: 26, color: '#fff', letterSpacing: 2}}>
          HAMOUDI<span style={{color: C.pink, textShadow: `0 0 10px ${C.pink}`}}>X</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= END SCREEN (next episode + subscribe) ================= */
export const EndScreen: React.FC<{dur: number; line: string; next?: string}> = ({dur, line, next = 'الحلقة القادمة'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = prog(f, 0, 24, ease.inOut);
  const s = spr(f, fps, 8, {damping: 12});
  const card = spr(f, fps, 30, {damping: 13});
  return (
    <AbsoluteFill style={{background: `rgba(14,4,24,${0.85 * k})`}}>
      <Circuit p={prog(f, 0, 40)} opacity={0.4} />
      <Sparks n={50} seed="end" opacity={k} />
      {/* next video slot (YouTube end-screen element goes on top of this) */}
      <div style={{position: 'absolute', left: 170, top: 300, width: 800, height: 450, borderRadius: 24, border: `4px solid ${C.cyan}`, boxShadow: neon(C.cyan, 0.6),
        transform: `translateX(${(1 - card) * -300}px) rotate(${(1 - card) * -6}deg)`, opacity: card, background: 'rgba(255,255,255,.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 70, color: '#fff', direction: 'rtl'}}>{next} ▶</div>
      </div>
      <div style={{position: 'absolute', right: 170, top: 250, width: 640, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{position: 'relative', width: 300, height: 300, transform: `scale(${s})`}}>
          <svg width={300} height={300} style={{position: 'absolute', inset: 0, transform: `rotate(${f * 2}deg)`}}>
            <circle cx={150} cy={150} r={144} fill="none" stroke={C.pink} strokeWidth={5} strokeDasharray="120 40" />
          </svg>
          <Img src={staticFile('brand/avatar_full.jpg')} style={{position: 'absolute', inset: 22, width: 256, height: 256, borderRadius: '50%', objectFit: 'cover'}} />
        </div>
        <div style={{marginTop: 26, opacity: prog(f, 12, 30)}}>
          <Wordmark size={92} start={10} showTag={false} />
        </div>
        <div style={{fontFamily: fonts.arDisplay, fontSize: 52, color: C.gold, direction: 'rtl', marginTop: 16, opacity: prog(f, 30, 44)}}>{line}</div>
      </div>
      {dur > 0 && null}
    </AbsoluteFill>
  );
};
