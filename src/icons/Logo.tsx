import React from 'react';
import Svg, { Path, G, Ellipse } from 'react-native-svg';

export interface LogoProps {
  width?: number;
  height?: number;
}

function Logo({ width = 64, height = 64 }: LogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
      {/* Speech Bubble */}
      <Path
        d="M8 10a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H32l-10 10v-10h-6a8 8 0 0 1-8-8V10z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <G transform="translate(20, 8) scale(0.65)">
        <Ellipse
          cx="24"
          cy="20"
          rx="24"
          ry="20"
          stroke="white"
          strokeWidth={3}
          fill="none"
        />
        <Path d="M0 20h48" stroke="white" strokeWidth={2} strokeLinecap="round" />
        <Path d="M24 0v40" stroke="white" strokeWidth={2} strokeLinecap="round" />
        <Path
          d="M12 5c2 2 2 30 0 30"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M36 5c-2 2-2 30 0 30"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}

export default Logo;
