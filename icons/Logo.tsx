import React from 'react';
import Svg, { Path, G, Ellipse } from 'react-native-svg';

function Logo({ size = 36 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Speech Bubble */}
      <Path
        d="M12 16a6 6 0 0 1 6-6h28a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H28l-8 8v-8h-2a6 6 0 0 1-6-6V16z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Globe with side vertical curved lines shifted up by 1 pixel */}
      <G transform="translate(24.3, 14.95)">
        <Ellipse
          cx="11.75"
          cy="9.5"
          rx="11.75"
          ry="9.5"
          stroke="white"
          strokeWidth={2}
          fill="none"
        />
        <Path d="M0 9.5h23.5" stroke="white" strokeWidth={2} strokeLinecap="round" />
        <Path d="M11.75 0v19" stroke="white" strokeWidth={2} strokeLinecap="round" />
        <Path
          d="M5.875 2.5c1 1 1 12 0 14"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M17.625 2.5c-1 1-1 12 0 14"
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
