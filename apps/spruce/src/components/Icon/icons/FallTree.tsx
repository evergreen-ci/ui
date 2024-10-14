import { forwardRef } from "react";

export const FallTree = forwardRef<SVGSVGElement>((props, ref) => (
  <svg
    ref={ref}
    fill="none"
    viewBox="0 0 359 445"
    width="58"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      clipRule="evenodd"
      d="m234.463 173.995-51.596-77.938c-1.819-2.746-5.848-2.741-7.667.006l-51.423 77.943c-4.003 6.062.348 14.142 7.613 14.142h5.469l-37.23 52.079c-4.003 6.062.348 14.142 7.613 14.142h9.773l-46.492 58.28c-4.002 6.063.35 14.142 7.613 14.142H157v10.608c0 10.266 8.335 18.601 18.601 18.601h7.798c10.266 0 18.601-8.335 18.601-18.601v-10.608h78.312c7.27 0 11.621-8.09 7.608-14.153l-45.864-58.269h8.711c7.27 0 11.621-8.091 7.608-14.153v-.006l-37.005-52.062h5.48c7.269 0 11.62-8.09 7.607-14.153h.006Z"
      fill="url(#a)"
      fillRule="evenodd"
    />
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="a"
        x1="-37.5"
        x2="406.5"
        y1="-160"
        y2="525"
      >
        <stop stopColor="#954535" />
        <stop offset=".02" stopColor="#EBB906">
          <animate
            attributeName="offset"
            begin="0s"
            calcMode="linear"
            dur="13s"
            fill="freeze"
            keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1"
            repeatCount="indefinite"
            values="0.0197893;0.0222233;0.0222233;0.199525;0.496432;0.745;0.496432;0.199525;0.0222233;0.0222233;0.0197893"
          />
          <animate
            attributeName="stop-color"
            begin="0s"
            calcMode="linear"
            dur="13s"
            fill="freeze"
            keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1"
            repeatCount="indefinite"
            values="#EBB906;#E4150E;#E4150E;#E4150E;#E4150E;#E4150E;#E4150E;#E4150E;#E4150E;#E4150E;#EBB906"
          />
        </stop>
        <stop offset=".022" stopColor="#E4150E">
          <animate
            attributeName="offset"
            begin="0s"
            calcMode="linear"
            dur="13s"
            fill="freeze"
            keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1"
            repeatCount="indefinite"
            values="0.0222233;0.0437326;0.315184;0.522266;0.69419;0.835;0.69419;0.522266;0.315184;0.0437326;0.0222233"
          />
          <animate
            attributeName="stop"
            keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1"
            repeatCount="indefinite"
            values="#E4150E;#E86C0A;#E86C0A;#E86C0A;#E86C0A;#EBB906;#E86C0A;#E86C0A;#E86C0A;#E86C0A;#E4150E"
          />
        </stop>
        <stop offset=".044" stopColor="#E86C0A">
          <animate
            attributeName="offset"
            begin="0s"
            calcMode="linear"
            dur="13s"
            fill="freeze"
            keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1"
            repeatCount="indefinite"
            values="0.0437326;0.437506;0.693037;0.780395;0.780395;0.88;0.780395;0.780395;0.693037;0.437506;0.0437326"
          />
          <animate
            attributeName="stop-color"
            begin="0s"
            calcMode="linear"
            dur="13s"
            fill="freeze"
            keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1"
            repeatCount="indefinite"
            values="#E86C0A;#EBB906;#EBB906;#EBB906;#EBB906;#E86C0A;#EBB906;#EBB906;#EBB906;#EBB906;#E86C0A"
          />
        </stop>
        <stop offset=".583" stopColor="#00A35C">
          <animate
            attributeName="offset"
            begin="0s"
            calcMode="linear"
            dur="13s"
            fill="freeze"
            keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1"
            repeatCount="indefinite"
            values="0.582776;0.838822;0.900502;0.900502;0.900502;0.900502;0.900502;0.900502;0.900502;0.838822;0.582776"
          />
        </stop>
      </linearGradient>
    </defs>
  </svg>
));
