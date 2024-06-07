import { useEffect } from "react";

export const PrideTree: React.FC = () => {
  // Animations should be paused by default on page load.
  useEffect(() => {
    const prideTree = document.getElementsByTagName("svg");
    prideTree[0].pauseAnimations();
  }, []);

  const onMouseEnter = () => {
    const prideTree = document.getElementsByTagName("svg");
    prideTree[0].unpauseAnimations();
  };

  const onMouseLeave = () => {
    const prideTree = document.getElementsByTagName("svg");
    prideTree[0].pauseAnimations();
  };

  return (
    <svg
      width="60"
      height="445"
      viewBox="0 0 359 445"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <g id="1">
        <mask
          id="mask0_689_4"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="73"
          y="94"
          width="221"
          height="262"
        >
          <path
            id="Union"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M238.463 173.995L186.867 96.0575C185.048 93.3106 181.019 93.316 179.2 96.0629L127.777 174.006C123.774 180.068 128.125 188.148 135.39 188.148H140.859L103.629 240.227C99.6264 246.289 103.977 254.369 111.242 254.369H121.015L74.5234 312.649C70.5211 318.712 74.8722 326.791 82.1364 326.791H161V337.399C161 347.665 169.335 356 179.601 356H187.399C197.665 356 206 347.665 206 337.399V326.791H284.312C291.582 326.791 295.933 318.701 291.92 312.638L246.056 254.369H254.767C262.037 254.369 266.388 246.278 262.375 240.216V240.21L225.37 188.148H230.85C238.119 188.148 242.47 180.058 238.457 173.995H238.463Z"
            fill="#00A35C"
          />
        </mask>
        <g mask="url(#mask0_689_4)">
          <g id="Frame 2">
            <rect
              id="Rectangle 1"
              x="200.391"
              y="-30"
              width="38.2811"
              height="436"
              transform="rotate(21.5842 200.391 -30)"
              fill="#DB3030"
            >
              <animate
                attributeName="fill"
                values="#DB3030;#B45AF2;#016BF8;#00A35C;#FFC010;#F38300;#DB3030"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
            </rect>
            <rect
              id="Rectangle 2"
              x="235.057"
              y="-16.2855"
              width="38.2811"
              height="436"
              transform="rotate(21.5842 235.057 -16.2855)"
              fill="#F38300"
            >
              <animate
                attributeName="fill"
                values="#F38300;#DB3030;#B45AF2;#016BF8;#00A35C;#FFC010;#F38300"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
              <animate
                attributeName="y"
                values="-16.2855;-16.2855;-16.2855;-16.2855;-16.2855;-16.2854;-16.2854"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="21.5842 235.057 -16.2855;21.5842 235.057 -16.2855;21.5842 235.057 -16.2855;21.5842 235.057 -16.2855;21.5842 235.057 -16.2855;21.5842 235.057 -16.2854;21.5842 235.057 -16.2854"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
            </rect>
            <rect
              id="Rectangle 3"
              x="269.724"
              y="-2.57094"
              width="38.2811"
              height="436"
              transform="rotate(21.5842 269.724 -2.57094)"
              fill="#FFC010"
            >
              <animate
                attributeName="fill"
                values="#FFC010;#F38300;#DB3030;#B45AF2;#016BF8;#00A35C;#FFC010"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
              <animate
                attributeName="y"
                values="-2.57094;-2.57094;-2.57092;-2.57092;-2.57092;-2.57104;-2.57104"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="21.5842 269.724 -2.57094;21.5842 269.724 -2.57094;21.5842 269.724 -2.57092;21.5842 269.724 -2.57092;21.5842 269.724 -2.57092;21.5842 269.724 -2.57104;21.5842 269.724 -2.57104"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
            </rect>
            <rect
              id="Rectangle 4"
              x="304.391"
              y="11.1436"
              width="38.2811"
              height="436"
              transform="rotate(21.5842 304.391 11.1436)"
              fill="#00A35C"
            >
              <animate
                attributeName="fill"
                values="#00A35C;#FFC010;#F38300;#DB3030;#B45AF2;#016BF8;#00A35C"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
            </rect>
            <rect
              id="Rectangle 5"
              x="339.058"
              y="24.8581"
              width="38.2811"
              height="436"
              transform="rotate(21.5842 339.058 24.8581)"
              fill="#016BF8"
            >
              <animate
                attributeName="fill"
                values="#016BF8;#00A35C;#FFC010;#F38300;#DB3030;#B45AF2;#016BF8"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
              <animate
                attributeName="y"
                values="24.8581;24.8581;24.8581;24.8582;24.8582;24.8582;24.8582"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="21.5842 339.058 24.8581;21.5842 339.058 24.8581;21.5842 339.058 24.8581;21.5842 339.058 24.8582;21.5842 339.058 24.8582;21.5842 339.058 24.8582;21.5842 339.058 24.8582"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
            </rect>
            <rect
              id="Rectangle 6"
              x="373.725"
              y="38.5726"
              width="38.2811"
              height="436"
              transform="rotate(21.5842 373.725 38.5726)"
              fill="#B45AF2"
            >
              <animate
                attributeName="y"
                values="38.5726;38.5727;38.5726;38.5726;38.5726;38.5728;38.5728"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="21.5842 373.725 38.5726;21.5842 373.725 38.5727;21.5842 373.725 38.5726;21.5842 373.725 38.5726;21.5842 373.725 38.5726;21.5842 373.725 38.5728;21.5842 373.725 38.5728"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
              <animate
                attributeName="fill"
                values="#B45AF2;#016BF8;#00A35C;#FFC010;#F38300;#DB3030;#B45AF2"
                begin="0s"
                dur="3s"
                repeatCount="indefinite"
                fill="freeze"
                calcMode="linear"
                keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"
              />
            </rect>
          </g>
        </g>
      </g>
    </svg>
  );
};
