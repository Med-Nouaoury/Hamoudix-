import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {C, fonts, neon} from '../theme';

/* Thumbnail for Short 01 — vertical (1080x1920) and wide (1280x720) */
const Sparks: React.FC<{w: number; h: number}> = ({w, h}) => (
  <AbsoluteFill>
    {Array.from({length: 60}).map((_, i) => {
      const r = (k: string) => random(`t${k}${i}`);
      const col = r('c') > 0.5 ? C.ember : C.hot;
      return <div key={i} style={{position: 'absolute', left: r('x') * w, top: r('y') * h, width: 4 + r('w') * 5, height: 10 + r('h') * 22, borderRadius: 3, background: col,
        opacity: 0.4 + r('o') * 0.6, transform: `rotate(${-30 + r('a') * 60}deg)`, boxShadow: `0 0 12px ${col}`}} />;
    })}
  </AbsoluteFill>
);
const Rays: React.FC<{x: string; y: string; o?: number}> = ({x, y, o = 0.35}) => (
  <AbsoluteFill style={{opacity: o, mixBlendMode: 'screen', background: `repeating-conic-gradient(from 0deg at ${x} ${y}, rgba(255,255,255,.3) 0deg 5deg, transparent 5deg 15deg)`}} />
);
const Big3: React.FC<{size: number}> = ({size}) => (
  <div style={{display: 'flex', alignItems: 'center', direction: 'rtl', gap: size * 0.06}}>
    <div style={{fontFamily: fonts.display, fontSize: size, lineHeight: 0.8, color: '#fff', textShadow: `${neon(C.pink, 1.6)}, 0 ${size * 0.04}px 0 #12021f`,
      WebkitTextStroke: `${size * 0.012}px #12021f`, paintOrder: 'stroke fill'}}>3</div>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
      <div style={{fontFamily: fonts.arDisplay, fontSize: size * 0.42, lineHeight: 1, color: C.gold, WebkitTextStroke: `${size * 0.01}px #12021f`, paintOrder: 'stroke fill',
        textShadow: `0 ${size * 0.03}px 0 #12021f, 0 0 ${size * 0.08}px ${C.gold}88`}}>أيام</div>
      <div style={{fontFamily: fonts.arDisplay, fontSize: size * 0.3, lineHeight: 1.1, color: '#fff', background: C.red, padding: `0 ${size * 0.06}px`, borderRadius: size * 0.04,
        transform: 'rotate(-4deg)', boxShadow: `0 ${size * 0.02}px 0 #12021f`}}>فقط!</div>
    </div>
  </div>
);

export const Short01ThumbV: React.FC = () => (
  <AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
    <Img src={staticFile('art/p_jason_lucia.jpg')} style={{position: 'absolute', left: '50%', top: 0, height: '62%', transform: 'translateX(-50%) scale(1.15)',
      filter: 'blur(3px) brightness(.75) saturate(1.3)'}} />
    <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(14,4,24,.2) 0%, rgba(14,4,24,.1) 30%, ${C.night} 62%), radial-gradient(ellipse 70% 40% at 50% 38%, ${C.pink}66, transparent 70%)`}} />
    <Rays x="50%" y="38%" />
    <Sparks w={1080} h={1920} />
    {/* cover, 3D tilted */}
    <div style={{position: 'absolute', left: 540, top: 640, transform: 'translate(-50%,-50%) perspective(1600px) rotateY(-14deg) rotateX(6deg) rotate(-3deg)',
      filter: `drop-shadow(0 0 60px ${C.pink}) drop-shadow(0 40px 50px rgba(0,0,0,.7))`}}>
      <Img src={staticFile('art/gta6_ultimate.jpg')} style={{width: 720, height: 720, borderRadius: 20, border: '6px solid #fff', display: 'block'}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center'}}><Big3 size={420} /></div>
    <Img src={staticFile('brand/mascot.png')} style={{position: 'absolute', left: -40, bottom: -30, height: 560, transform: 'rotate(-6deg)',
      filter: `drop-shadow(0 0 0 #fff) drop-shadow(0 0 30px ${C.pink}) drop-shadow(0 20px 30px rgba(0,0,0,.6))`}} />
    <div style={{position: 'absolute', right: 70, bottom: 260, fontSize: 200, transform: 'rotate(10deg)', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.5))'}}>😱</div>
  </AbsoluteFill>
);

export const Short01ThumbW: React.FC = () => (
  <AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
    <Img src={staticFile('art/p_jason_lucia.jpg')} style={{position: 'absolute', right: -60, top: -40, height: 820, filter: 'brightness(.8) saturate(1.3)'}} />
    <AbsoluteFill style={{background: `linear-gradient(90deg, ${C.night} 30%, rgba(14,4,24,.6) 55%, rgba(14,4,24,0) 80%), radial-gradient(ellipse 40% 60% at 30% 50%, ${C.pink}55, transparent 70%)`}} />
    <Rays x="28%" y="50%" o={0.25} />
    <Sparks w={1280} h={720} />
    <div style={{position: 'absolute', left: 820, top: 360, transform: 'translate(-50%,-50%) perspective(1400px) rotateY(-16deg) rotate(4deg)',
      filter: `drop-shadow(0 0 40px ${C.pink}) drop-shadow(0 30px 40px rgba(0,0,0,.7))`}}>
      <Img src={staticFile('art/gta6_ultimate.jpg')} style={{width: 470, height: 470, borderRadius: 14, border: '5px solid #fff', display: 'block'}} />
    </div>
    <div style={{position: 'absolute', left: 50, top: 150}}><Big3 size={330} /></div>
  </AbsoluteFill>
);
