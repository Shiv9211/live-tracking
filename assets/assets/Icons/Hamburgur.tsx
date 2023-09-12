import React from "react";
import { Svg, Path } from "react-native-svg";

function Icon() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 20 20"
    >
      <Path fill="none" d="M0 0H24V24H0z"></Path>
      <Path
        fill="#000"
        d="M1.715 18.857v-1.714h14.857v1.714H1.715zm19.371-1.485l-5.4-5.4L21.058 6.6l1.228 1.229-4.143 4.143 4.172 4.171-1.229 1.229zM1.715 12.8v-1.714h11.428V12.8H1.715zm0-5.943V5.143h14.857v1.714H1.715z"
      ></Path>
    </Svg>
  );
}

export default Icon;