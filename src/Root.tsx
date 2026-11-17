import React from 'react';
import {Composition, Still} from 'remotion';
import {FPS, H, W} from './theme';
import {INTRO_LEN, Intro} from './brand';
import {SHOWCASE_LEN, Showcase, StatDemo} from './Showcase';
import {Thumbnail} from './Thumbnail';
import {SH, SHORT01_LEN, SW, Short01} from './shorts/Short01';
import {Short01ThumbV, Short01ThumbW} from './shorts/Short01Thumb';
import {SHORT02_LEN, Short02} from './shorts/Short02';
import {S2P_LEN, Short02Pro} from './shorts/Short02Pro';

export const Root: React.FC = () => (
  <>
    <Composition id="HamoudiXShowcase" component={Showcase} durationInFrames={SHOWCASE_LEN} fps={FPS} width={W} height={H} />
    <Composition id="HamoudiXIntro" component={Intro} durationInFrames={INTRO_LEN} fps={FPS} width={W} height={H} />
    <Composition id="StatDemo" component={StatDemo} durationInFrames={120} fps={FPS} width={W} height={H} />
    <Composition id="Short01-GTA6-3Days" component={Short01} durationInFrames={SHORT01_LEN} fps={FPS} width={SW} height={SH} />
    <Composition id="Short02-WhyNotOneSecond" component={Short02} durationInFrames={SHORT02_LEN} fps={FPS} width={SW} height={SH} />
    <Composition id="Short02Pro" component={Short02Pro} durationInFrames={S2P_LEN} fps={FPS} width={SW} height={SH} />
    <Still id="Short01-ThumbV" component={Short01ThumbV} width={1080} height={1920} />
    <Still id="Short01-ThumbW" component={Short01ThumbW} width={1280} height={720} />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} defaultProps={{ep: 1, top: 'تختيم GTA 6', big: 'الحلقة الأولى'}} />
  </>
);
