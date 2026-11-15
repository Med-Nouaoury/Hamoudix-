import React from 'react';
import {Composition, Still} from 'remotion';
import {FPS, H, W} from './theme';
import {INTRO_LEN, Intro} from './brand';
import {SHOWCASE_LEN, Showcase, StatDemo} from './Showcase';
import {Thumbnail} from './Thumbnail';

export const Root: React.FC = () => (
  <>
    <Composition id="HamoudiXShowcase" component={Showcase} durationInFrames={SHOWCASE_LEN} fps={FPS} width={W} height={H} />
    <Composition id="HamoudiXIntro" component={Intro} durationInFrames={INTRO_LEN} fps={FPS} width={W} height={H} />
    <Composition id="StatDemo" component={StatDemo} durationInFrames={120} fps={FPS} width={W} height={H} />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} defaultProps={{ep: 1, top: 'تختيم GTA 6', big: 'الحلقة الأولى'}} />
  </>
);
