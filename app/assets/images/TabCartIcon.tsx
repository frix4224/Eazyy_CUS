import * as React from "react";
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";
const TabCartIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      clipPath="url(#a)"
    >
      <Path d="M4 19a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM15 19a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
      <Path d="M17 17H6V3H4" />
      <Path d="m6 5 14 1-1 7H6" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default TabCartIcon;
