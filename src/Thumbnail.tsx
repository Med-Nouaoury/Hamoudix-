import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, fonts, neon} from './theme';
import {Sparks} from './fx';
import {Gameplay} from './walkthrough';

/* YouTube thumbnail 1280x720 — episode template (mascot + 2-level text + EP badge) */
export const Thumbnail: React.FC<{ep: number; top: string; big: string}> = ({ep, top, big}) => (
  <AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: 'scale(.6666)', transformOrigin: '0 0', width: 1920, height: 1080, filter: 'saturate(1.25) contrast(1.05)'}}>
      <Gameplay />
    </AbsoluteFill>
    <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(14,4,24,.0) 30%, rgba(14,4,24,.85) 75%)`}} />
    <Sparks n={40} seed="thumb" />
    <Img src={staticFile('brand/mascot.png')} style={{position: 'absolute', left: 20, bottom: -10, height: 640,
      filter: `drop-shadow(0 0 0 #fff) drop-shadow(0 0 24px ${C.pink}) drop-shadow(0 20px 30px rgba(0,0,0,.6))`}} />
    <div style={{position: 'absolute', right: 50, top: 70, width: 700, textAlign: 'right', direction: 'rtl'}}>
      <div style={{fontFamily: fonts.arDisplay, fontSize: 92, color: '#fff', lineHeight: 1.05, textShadow: '0 6px 0 #000, 0 0 30px rgba(0,0,0,.6)'}}>{top}</div>
      <div style={{fontFamily: fonts.arDisplay, fontSize: 170, color: C.pink, lineHeight: 1, WebkitTextStroke: '3px #fff',
        textShadow: `${neon(C.pink, 1)}, 0 10px 0 #000`, transform: 'rotate(-3deg)', transformOrigin: 'right center'}}>{big}</div>
      <div style={{display: 'inline-block', marginTop: 26, background: C.cyan, color: C.night, fontFamily: fonts.display, fontSize: 84, padding: '4px 30px',
        borderRadius: 16, boxShadow: neon(C.cyan, 0.6), direction: 'ltr'}}>EP {String(ep).padStart(2, '0')}</div>
    </div>
    <div style={{position: 'absolute', right: 40, bottom: 26, fontFamily: fonts.logo, fontSize: 40, color: '#fff', letterSpacing: 2, direction: 'ltr'}}>
      HAMOUDI<span style={{color: C.pink, textShadow: neon(C.pink, 0.6)}}>X</span>
    </div>
  </AbsoluteFill>
);
