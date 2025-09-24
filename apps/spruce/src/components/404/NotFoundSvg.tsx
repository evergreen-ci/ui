import { useEffect, useRef } from "react";

interface NotFoundSvgProps {
  disableAnimations?: boolean;
}

const NotFoundSvg: React.FC<NotFoundSvgProps> = ({
  disableAnimations = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      if (disableAnimations) {
        svgRef.current.pauseAnimations();
      } else {
        svgRef.current.unpauseAnimations();
      }
    }
  }, [disableAnimations]);

  return (
    <svg
      ref={svgRef}
      aria-label="Page not found"
      data-cy="404"
      id="e1jpemtt30051"
      preserveAspectRatio="xMinYMin slice"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 1920 1080"
      xlinkHref="http://www.w3.org/1999/xlink"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt30054-fill"
          spreadMethod="pad"
          x1="780.4"
          x2="1971.7"
          y1="191.2"
          y2="191.2"
        >
          <stop id="e1jpemtt30054-fill-0" offset="0%" stopColor="#FCEBE2" />
          <stop id="e1jpemtt30054-fill-1" offset="20%" stopColor="#FBF1EB" />
          <stop id="e1jpemtt30054-fill-2" offset="60%" stopColor="#F9F8F6" />
          <stop id="e1jpemtt30054-fill-3" offset="100%" stopColor="#F9FBFA" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt30055-fill"
          spreadMethod="pad"
          x1="990.2"
          x2="-201"
          y1="296.9"
          y2="296.9"
        >
          <stop id="e1jpemtt30055-fill-0" offset="0%" stopColor="#FCEBE2" />
          <stop id="e1jpemtt30055-fill-1" offset="20%" stopColor="#FBF1EB" />
          <stop id="e1jpemtt30055-fill-2" offset="60%" stopColor="#F9F8F6" />
          <stop id="e1jpemtt30055-fill-3" offset="100%" stopColor="#F9FBFA" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt30056-fill"
          spreadMethod="pad"
          x1="1366.9"
          x2="1366.9"
          y1="560.6"
          y2="268.7"
        >
          <stop id="e1jpemtt30056-fill-0" offset="0%" stopColor="#7DC5DB" />
          <stop id="e1jpemtt30056-fill-1" offset="20%" stopColor="#9FD4E4" />
          <stop id="e1jpemtt30056-fill-2" offset="40%" stopColor="#BCE1EC" />
          <stop id="e1jpemtt30056-fill-3" offset="60%" stopColor="#D0EBF2" />
          <stop id="e1jpemtt30056-fill-4" offset="80%" stopColor="#DDF0F5" />
          <stop id="e1jpemtt30056-fill-5" offset="100%" stopColor="#E1F2F6" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt30058-fill"
          spreadMethod="pad"
          x1="1315.9"
          x2="1372.2"
          y1="1004.6"
          y2="468.7"
        >
          <stop
            id="e1jpemtt30058-fill-0"
            offset="0%"
            stopColor="rgba(225,242,246,0)"
          />
          <stop
            id="e1jpemtt30058-fill-1"
            offset="60%"
            stopColor="rgba(225,242,246,0)"
          />
          <stop
            id="e1jpemtt30058-fill-2"
            offset="60%"
            stopColor="rgba(228,240,245,0.1)"
          />
          <stop
            id="e1jpemtt30058-fill-3"
            offset="60%"
            stopColor="rgba(235,236,242,0.2)"
          />
          <stop
            id="e1jpemtt30058-fill-4"
            offset="70%"
            stopColor="rgba(246,230,237,0.4)"
          />
          <stop
            id="e1jpemtt30058-fill-5"
            offset="70%"
            stopColor="rgba(255,225,234,0.6)"
          />
          <stop
            id="e1jpemtt30058-fill-6"
            offset="80%"
            stopColor="rgba(248,223,233,0.6)"
          />
          <stop
            id="e1jpemtt30058-fill-7"
            offset="80%"
            stopColor="rgba(225,215,229,0.6)"
          />
          <stop
            id="e1jpemtt30058-fill-8"
            offset="90%"
            stopColor="rgba(186,203,222,0.7)"
          />
          <stop
            id="e1jpemtt30058-fill-9"
            offset="90%"
            stopColor="rgba(132,186,212,0.8)"
          />
          <stop id="e1jpemtt30058-fill-10" offset="100%" stopColor="#3EA4C8" />
          <stop id="e1jpemtt30058-fill-11" offset="100%" stopColor="#2F9FC5" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300510-fill"
          spreadMethod="pad"
          x1="141.1"
          x2="374.7"
          y1="704.4"
          y2="299.7"
        >
          <stop id="e1jpemtt300510-fill-0" offset="0%" stopColor="#2F9FC5" />
          <stop id="e1jpemtt300510-fill-1" offset="0%" stopColor="#33A1C6" />
          <stop id="e1jpemtt300510-fill-2" offset="10%" stopColor="#53B1CF" />
          <stop id="e1jpemtt300510-fill-3" offset="20%" stopColor="#6ABCD6" />
          <stop id="e1jpemtt300510-fill-4" offset="20%" stopColor="#78C3DA" />
          <stop id="e1jpemtt300510-fill-5" offset="30%" stopColor="#7DC5DB" />
          <stop id="e1jpemtt300510-fill-6" offset="40%" stopColor="#99CBDE" />
          <stop id="e1jpemtt300510-fill-7" offset="50%" stopColor="#BED3E2" />
          <stop id="e1jpemtt300510-fill-8" offset="60%" stopColor="#DAD9E6" />
          <stop id="e1jpemtt300510-fill-9" offset="80%" stopColor="#EFDDE8" />
          <stop id="e1jpemtt300510-fill-10" offset="90%" stopColor="#FBE0EA" />
          <stop id="e1jpemtt300510-fill-11" offset="100%" stopColor="#FFE1EA" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300514-fill"
          spreadMethod="pad"
          x1="572.6"
          x2="572.6"
          y1="197.2"
          y2="-11.2"
        >
          <stop
            id="e1jpemtt300514-fill-0"
            offset="0%"
            stopColor="rgba(197,228,242,0)"
          />
          <stop
            id="e1jpemtt300514-fill-1"
            offset="20%"
            stopColor="rgba(197,228,242,0.3)"
          />
          <stop
            id="e1jpemtt300514-fill-2"
            offset="50%"
            stopColor="rgba(197,228,242,0.6)"
          />
          <stop
            id="e1jpemtt300514-fill-3"
            offset="70%"
            stopColor="rgba(197,228,242,0.8)"
          />
          <stop
            id="e1jpemtt300514-fill-4"
            offset="90%"
            stopColor="rgba(197,228,242,0.9)"
          />
          <stop id="e1jpemtt300514-fill-5" offset="100%" stopColor="#C5E4F2" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300515-fill"
          spreadMethod="pad"
          x1="111.8"
          x2="111.8"
          y1="266.3"
          y2="120.1"
        >
          <stop
            id="e1jpemtt300515-fill-0"
            offset="0%"
            stopColor="rgba(197,228,242,0)"
          />
          <stop
            id="e1jpemtt300515-fill-1"
            offset="20%"
            stopColor="rgba(197,228,242,0.3)"
          />
          <stop
            id="e1jpemtt300515-fill-2"
            offset="50%"
            stopColor="rgba(197,228,242,0.6)"
          />
          <stop
            id="e1jpemtt300515-fill-3"
            offset="70%"
            stopColor="rgba(197,228,242,0.8)"
          />
          <stop
            id="e1jpemtt300515-fill-4"
            offset="90%"
            stopColor="rgba(197,228,242,0.9)"
          />
          <stop id="e1jpemtt300515-fill-5" offset="100%" stopColor="#C5E4F2" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300516-fill"
          spreadMethod="pad"
          x1="1662.8"
          x2="1662.8"
          y1="201.9"
          y2="38.2"
        >
          <stop
            id="e1jpemtt300516-fill-0"
            offset="0%"
            stopColor="rgba(197,228,242,0)"
          />
          <stop
            id="e1jpemtt300516-fill-1"
            offset="20%"
            stopColor="rgba(197,228,242,0.3)"
          />
          <stop
            id="e1jpemtt300516-fill-2"
            offset="50%"
            stopColor="rgba(197,228,242,0.6)"
          />
          <stop
            id="e1jpemtt300516-fill-3"
            offset="70%"
            stopColor="rgba(197,228,242,0.8)"
          />
          <stop
            id="e1jpemtt300516-fill-4"
            offset="90%"
            stopColor="rgba(197,228,242,0.9)"
          />
          <stop id="e1jpemtt300516-fill-5" offset="100%" stopColor="#C5E4F2" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300517-fill"
          spreadMethod="pad"
          x1="1202.6"
          x2="1202.6"
          y1="264.7"
          y2="131.6"
        >
          <stop
            id="e1jpemtt300517-fill-0"
            offset="0%"
            stopColor="rgba(197,228,242,0)"
          />
          <stop
            id="e1jpemtt300517-fill-1"
            offset="20%"
            stopColor="rgba(197,228,242,0.3)"
          />
          <stop
            id="e1jpemtt300517-fill-2"
            offset="50%"
            stopColor="rgba(197,228,242,0.6)"
          />
          <stop
            id="e1jpemtt300517-fill-3"
            offset="70%"
            stopColor="rgba(197,228,242,0.8)"
          />
          <stop
            id="e1jpemtt300517-fill-4"
            offset="90%"
            stopColor="rgba(197,228,242,0.9)"
          />
          <stop id="e1jpemtt300517-fill-5" offset="100%" stopColor="#C5E4F2" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300518-fill"
          spreadMethod="pad"
          x1="204.5"
          x2="355.2"
          y1="605.9"
          y2="345"
        >
          <stop id="e1jpemtt300518-fill-0" offset="0%" stopColor="#2F9FC5" />
          <stop id="e1jpemtt300518-fill-1" offset="0%" stopColor="#33A1C6" />
          <stop id="e1jpemtt300518-fill-2" offset="10%" stopColor="#53B1CF" />
          <stop id="e1jpemtt300518-fill-3" offset="20%" stopColor="#6ABCD6" />
          <stop id="e1jpemtt300518-fill-4" offset="20%" stopColor="#78C3DA" />
          <stop id="e1jpemtt300518-fill-5" offset="30%" stopColor="#7DC5DB" />
          <stop id="e1jpemtt300518-fill-6" offset="40%" stopColor="#98CBDE" />
          <stop id="e1jpemtt300518-fill-7" offset="60%" stopColor="#C4D4E3" />
          <stop id="e1jpemtt300518-fill-8" offset="80%" stopColor="#E4DBE7" />
          <stop id="e1jpemtt300518-fill-9" offset="90%" stopColor="#F8DFE9" />
          <stop id="e1jpemtt300518-fill-10" offset="100%" stopColor="#FFE1EA" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300519-fill"
          spreadMethod="pad"
          x1="1410.4"
          x2="1410.4"
          y1="530.7"
          y2="333.5"
        >
          <stop id="e1jpemtt300519-fill-0" offset="0%" stopColor="#E1F2F6" />
          <stop id="e1jpemtt300519-fill-1" offset="20%" stopColor="#DDF0F5" />
          <stop id="e1jpemtt300519-fill-2" offset="40%" stopColor="#D0EBF2" />
          <stop id="e1jpemtt300519-fill-3" offset="60%" stopColor="#BCE1EC" />
          <stop id="e1jpemtt300519-fill-4" offset="80%" stopColor="#9FD4E4" />
          <stop id="e1jpemtt300519-fill-5" offset="100%" stopColor="#7DC5DB" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300531-fill"
          spreadMethod="pad"
          x1="611.9"
          x2="707"
          y1="450.8"
          y2="315"
        >
          <stop id="e1jpemtt300531-fill-0" offset="0%" stopColor="#FEF7E3" />
          <stop id="e1jpemtt300531-fill-1" offset="50%" stopColor="#FEF7E1" />
          <stop id="e1jpemtt300531-fill-2" offset="80%" stopColor="#FEF5D9" />
          <stop id="e1jpemtt300531-fill-3" offset="100%" stopColor="#FEF3CC" />
          <stop id="e1jpemtt300531-fill-4" offset="100%" stopColor="#FEF2C8" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300538-fill"
          spreadMethod="pad"
          x1="871.7"
          x2="952.1"
          y1="814.4"
          y2="820.2"
        >
          <stop id="e1jpemtt300538-fill-0" offset="0%" stopColor="#B8C4C2" />
          <stop id="e1jpemtt300538-fill-1" offset="10%" stopColor="#BFCAC8" />
          <stop id="e1jpemtt300538-fill-2" offset="30%" stopColor="#DCE4E2" />
          <stop id="e1jpemtt300538-fill-3" offset="50%" stopColor="#E7EEEC" />
          <stop id="e1jpemtt300538-fill-4" offset="60%" stopColor="#E4EBE9" />
          <stop id="e1jpemtt300538-fill-5" offset="80%" stopColor="#D9E2E0" />
          <stop id="e1jpemtt300538-fill-6" offset="90%" stopColor="#C8D2D0" />
          <stop id="e1jpemtt300538-fill-7" offset="100%" stopColor="#B8C4C2" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300542-fill"
          spreadMethod="pad"
          x1="-20.6"
          x2="20.9"
          y1="-11.5"
          y2="-8.6"
        >
          <stop id="e1jpemtt300542-fill-0" offset="0%" stopColor="#FEF7E3" />
          <stop id="e1jpemtt300542-fill-1" offset="50%" stopColor="#FEF5E4" />
          <stop id="e1jpemtt300542-fill-2" offset="80%" stopColor="#FEEDE6" />
          <stop id="e1jpemtt300542-fill-3" offset="100%" stopColor="#FFE1EA" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300546-fill"
          spreadMethod="pad"
          x1="1005.7"
          x2="1101.1"
          y1="690.7"
          y2="697.5"
        >
          <stop id="e1jpemtt300546-fill-0" offset="0%" stopColor="#B8C4C2" />
          <stop id="e1jpemtt300546-fill-1" offset="10%" stopColor="#BFCAC8" />
          <stop id="e1jpemtt300546-fill-2" offset="30%" stopColor="#DCE4E2" />
          <stop id="e1jpemtt300546-fill-3" offset="50%" stopColor="#E7EEEC" />
          <stop id="e1jpemtt300546-fill-4" offset="60%" stopColor="#E4EBE9" />
          <stop id="e1jpemtt300546-fill-5" offset="80%" stopColor="#D9E2E0" />
          <stop id="e1jpemtt300546-fill-6" offset="90%" stopColor="#C8D2D0" />
          <stop id="e1jpemtt300546-fill-7" offset="100%" stopColor="#B8C4C2" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300549-fill"
          spreadMethod="pad"
          x1=".1"
          x2="41.6"
          y1="-10.1"
          y2="-7.1"
        >
          <stop id="e1jpemtt300549-fill-0" offset="0%" stopColor="#FEF7E3" />
          <stop id="e1jpemtt300549-fill-1" offset="50%" stopColor="#FEF5E4" />
          <stop id="e1jpemtt300549-fill-2" offset="80%" stopColor="#FEEDE6" />
          <stop id="e1jpemtt300549-fill-3" offset="100%" stopColor="#FFE1EA" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300589-fill"
          spreadMethod="pad"
          x1="1322.8"
          x2="1510.6"
          y1="894.2"
          y2="1002.6"
        >
          <stop id="e1jpemtt300589-fill-0" offset="0%" stopColor="#FEF7E3" />
          <stop id="e1jpemtt300589-fill-1" offset="50%" stopColor="#FEF5E4" />
          <stop id="e1jpemtt300589-fill-2" offset="80%" stopColor="#FEEDE6" />
          <stop id="e1jpemtt300589-fill-3" offset="100%" stopColor="#FFE1EA" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="e1jpemtt300597-fill"
          spreadMethod="pad"
          x1="1257.7"
          x2="1090.4"
          y1="767.7"
          y2="864.3"
        >
          <stop id="e1jpemtt300597-fill-0" offset="0%" stopColor="#FEF7E3" />
          <stop id="e1jpemtt300597-fill-1" offset="50%" stopColor="#FEF5E4" />
          <stop id="e1jpemtt300597-fill-2" offset="80%" stopColor="#FEEDE6" />
          <stop id="e1jpemtt300597-fill-3" offset="100%" stopColor="#FFE1EA" />
        </linearGradient>
        <path d="M-11-8h1943v1106H-11z" id="e1jpemtt30052" />
      </defs>
      <g clipPath="url(#e1jpemtt3005107)" id="e1jpemtt30053">
        <path
          d="M1970-8H971a31 31 0 1 0 0 61h315a31 31 0 0 1 30 31v8a31 31 0 0 1-30 31H830a50 50 0 0 0 0 99h699a31 31 0 0 1 30 31v1a31 31 0 0 1-30 31h-385a53 53 0 0 0 0 105h828"
          fill="url(#e1jpemtt30054-fill)"
          id="e1jpemtt30054"
          opacity=".5"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M-199 496h999a31 31 0 1 0 0-61H485a31 31 0 0 1-30-31v-8a31 31 0 0 1 30-30h455a50 50 0 1 0 0-100H242a31 31 0 0 1-31-31v-1a31 31 0 0 1 31-31h385a53 53 0 1 0 0-105h-828"
          fill="url(#e1jpemtt30055-fill)"
          id="e1jpemtt30055"
          opacity=".5"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1968 560h-800l-342 1h-63c16-59 36-93 59-112 37-29 81-22 133-13 71 11 156 25 252-56 185-155 313 29 486-66 162-90 231-32 260 50l5 18c22 82 10 178 10 178z"
          fill="url(#e1jpemtt30056-fill)"
          id="e1jpemtt30056"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M-30 530h1982v578H-30V530z"
          fill="#E1F2F6"
          id="e1jpemtt30057"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1952 530v541L695 790l244-238 22-22h991z"
          fill="url(#e1jpemtt30058-fill)"
          id="e1jpemtt30058"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1232 1094a86 86 0 0 1-86 87H-42V530h971a55 55 0 0 1 55 54c0 43-34 77-77 77h-23a174 174 0 0 0 0 348h260a87 87 0 0 1 88 85z"
          fill="#C5E4F2"
          id="e1jpemtt30059"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M671 530c-77-172-253-174-385-115-143 63-218-275-404 0-92 135-30 115-30 115h819z"
          fill="url(#e1jpemtt300510-fill)"
          id="e1jpemtt300510"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M41 556h617a71 71 0 0 1 0 141H41a71 71 0 0 1 0-141zm200 479h617a71 71 0 0 1 0 142H241a71 71 0 0 1 0-142z"
          fill="#7DC5DB"
          id="e1jpemtt300511"
          opacity=".5"
          stroke="none"
          strokeWidth="1"
          transform="translate(0 1)"
        />
        <path
          d="M1967 562s-940-43-928 85c15 169 1080-210 658 135"
          fill="none"
          id="e1jpemtt300512"
          stroke="#FFF"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        />
        <path
          d="M984 712c-162-7-256 223-54 253s346-264 503-237c157 28-154 372 77 211 305-213 453-98 478 70"
          fill="none"
          id="e1jpemtt300513"
          stroke="#FFF"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        />
        <path
          d="M243 197h659a87 87 0 0 0-102-84 121 121 0 0 0-153-70 168 168 0 0 0-283 61 96 96 0 0 0-121 93z"
          fill="url(#e1jpemtt300514-fill)"
          id="e1jpemtt300514"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M302 264a61 61 0 0 0-91-53 107 107 0 0 0-210-6 63 63 0 0 0-80 61"
          fill="url(#e1jpemtt300515-fill)"
          id="e1jpemtt300515"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1404 202h518a68 68 0 0 0-80-67 95 95 0 0 0-121-55 132 132 0 0 0-222 49 76 76 0 0 0-95 73z"
          fill="url(#e1jpemtt300516-fill)"
          id="e1jpemtt300516"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1376 262a55 55 0 0 0-83-48 98 98 0 0 0-192-5 58 58 0 0 0-72 56"
          fill="url(#e1jpemtt300517-fill)"
          id="e1jpemtt300517"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M646 550c-103-86-250-75-367-23-141 63-226-212-381-98 167-206 242 96 377 36 125-55 288-57 371 85z"
          fill="url(#e1jpemtt300518-fill)"
          id="e1jpemtt300518"
          opacity=".7"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1967 380-9 2c-35 8-76 24-123 50-212 117-369-109-597 81-24 20-38 18-70 18l-313-2s-6-4 6-15c37-30 81-22 133-14 71 12 156 25 252-55 185-155 313 29 486-66 113-62 180-54 221-15l14 16z"
          fill="url(#e1jpemtt300519-fill)"
          id="e1jpemtt300519"
          opacity=".7"
          stroke="none"
          strokeWidth="1"
        />
        <g fill="#FFF" id="e1jpemtt300520" stroke="none" strokeWidth="1">
          <path
            d="M1849 657c6 0 6-10 0-10s-7 10 0 10zm-143-75c6 0 6-10 0-10s-7 10 0 10zm-58 94c7 0 7-10 0-10s-6 10 0 10zm-359-50c7 0 7-10 0-10s-6 10 0 10zm-103-65c7 0 7-10 0-10s-6 10 0 10zm-182 224c6 0 6-10 0-10s-6 10 0 10zm-171 86c7 0 7-10 0-10s-6 10 0 10zm-84-33c7 0 7-10 0-10s-6 10 0 10zm21-61c7 0 7-10 0-10s-6 10 0 10zm190 96c6 0 6-10 0-10s-6 10 0 10zm-153 66c6 0 6-10 0-10s-7 10 0 10zm215-13c6 0 6-10 0-10s-6 10 0 10zm172 76c6 0 6-10 0-10s-6 10 0 10zm115 4c6 0 6-10 0-10s-7 10 0 10zm28-36c6 0 6-10 0-10s-6 10 0 10zm-157-50c6 0 6-10 0-10s-7 10 0 10zm107-78c7 0 7-10 1-10s-7 10 0 10zm237 95c7 0 7-10 0-10s-6 10 0 10zm80 104c7 0 7-10 0-10s-6 10 0 10zm264-69c6 0 6-10 0-10s-7 10 0 10zm17-176c7 0 7-10 0-10s-6 10 0 10zm-42-76c7 0 7-10 0-10s-6 10 0 10zm-30 63c6 0 6-10 0-10s-7 10 0 10zm-201-159c6 0 6-10 0-10s-6 10 0 10zm-275-30c6 0 6-10 0-10s-6 10 0 10zm525 6c6 0 6-10 0-10s-6 10 0 10zm-118 76c6 0 6-10 0-10s-7 10 0 10zm-516 262c7 0 7-10 0-10s-6 10 0 10zM968 743c6 0 6-10 0-10s-7 10 0 10zm264-134c6 0 6-10 0-10s-6 10 0 10zM782 818c6 0 6-10 0-10s-7 10 0 10zm338 135c6 0 6-10 0-10s-7 10 0 10zm284-19c6 0 6-10 0-10s-6 10 0 10z"
            id="e1jpemtt300521"
          />
          <path
            d="M1891 802c6 0 6-10 0-10s-7 10 0 10zm-105-202c6 0 6-10 0-10s-7 10 0 10zm84 305c6 0 6-10 0-10s-7 10 0 10zm-58 115c7 0 7-10 1-10s-7 10 0 10zm-290-23c7 0 7-10 0-10s-6 10 0 10zm-271 47c7 0 7-10 0-10s-6 10 0 10zm-321-51c6 0 6-10 0-10s-6 10 0 10zm-40-21c6 0 6-10 0-10s-7 10 0 10zm152-212c6 0 6-10 0-10s-6 10 0 10zm186-204c7 0 7-10 0-10s-6 10 0 10z"
            id="e1jpemtt300522"
          />
        </g>
        <path
          d="M142 71c6 0 6-10 0-10s-6 10 0 10zm-30 206c6 0 6-10 0-10s-7 10 0 10zM226 84c6 0 6-10 0-10s-6 10 0 10zm4 222c6 0 6-10 0-10s-6 10 0 10zm220-81c6 0 6-10 0-10s-7 10 0 10zm198 115c6 0 6-10 0-10s-6 10 0 10zm75-63c6 0 6-10 0-10s-7 10 0 10zm299-107c7 0 7-10 0-10s-6 10 0 10zM852 46c7 0 7-10 0-10s-6 10 0 10zm-124 55c7 0 7-10 0-10s-6 10 0 10zm-216 35c7 0 7-10 1-10s-7 10 0 10zm-36-73c7 0 7-10 0-10s-6 10 0 10zM318 40c6 0 6-10 0-10s-7 10 0 10zM72 189c6 0 6-10 0-10s-7 10 0 10zm1237 96c6 0 6-10 0-10s-7 10 0 10zm-188 70c7 0 7-10 1-10s-7 10 0 10zm-68 48c6 0 6-10 0-10s-7 10 0 10zm-136-54c7 0 7-10 0-10s-6 10 0 10zm-116 81c6 0 6-10 0-10s-7 10 0 10zm277-289c6 0 6-10 0-10s-7 10 0 10zm76-89c6 0 6-10 0-10s-7 10 0 10zm233 3c6 0 6-10 0-10s-7 10 0 10zm-52 60c7 0 7-10 0-10s-6 10 0 10zm48 44c6 0 6-10 0-10s-6 10 0 10zm90 91c6 0 6-10 0-10s-7 10 0 10zm149-139c6 0 6-10 0-10s-7 10 0 10zm-16 189c7 0 7-10 0-10s-6 10 0 10zm96-145c6 0 6-10 0-10s-7 10 0 10zm153-58c6 0 6-10 0-10s-7 10 0 10zm-14-51c7 0 7-10 0-10s-6 10 0 10zm-112 4c6 0 6-10 0-10s-7 10 0 10zm-105 9c6 0 6-10 0-10s-7 10 0 10zm271 153c6 0 6-10 0-10s-7 10 0 10zm5 75c7 0 7-10 0-10s-6 10 0 10zm-36 24c7 0 7-10 0-10s-6 10 0 10zm-355-194c6 0 6-10 0-10s-6 10 0 10zm-9-65c6 0 6-10 0-10s-7 10 0 10zM62 56c6 0 6-10 0-10s-6 10 0 10zm4 106c6 0 6-10 0-10s-7 10 0 10zm252-17c6 0 6-10 0-10s-7 10 0 10zm237-78c6 0 6-10 0-10s-7 10 0 10zM201 376c7 0 7-10 0-10s-6 10 0 10z"
          fill="#E1F2F6"
          id="e1jpemtt300523"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M-59 602h173m-61 25h117m512-32h88m-30 23h59M526 957h133m-28 16h91"
          fill="none"
          id="e1jpemtt300524"
          stroke="#FFF"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        />
        <path
          d="M319 997h31c6 0 11 5 11 10v4c0 6-5 10-11 10h-32c-5 0-10-4-10-10v-4c0-5 5-10 11-10zm508 40h32c6 0 11 5 11 10v4c0 6-5 10-11 10h-32c-5 0-10-4-10-10v-4c0-5 5-10 10-10zm-119-15h63c6 0 10 5 10 11v3c0 6-4 11-10 11h-63c-6 0-11-5-11-11v-3c0-6 5-11 11-11zm-447-61-48-71-74-40-57-56-43 56-40-13-45-83h-40l-38 55-53 28-37 99-72 5-90 113-54 13-103 55h863l-69-161z"
          fill="#FEF7E3"
          id="e1jpemtt300525"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m82 794 22 95-22-13-26 8-17-34 43-56zm204 329-35-81-45-29-38-59-64 8-40-38-25 14H10l-34-40-111 22-55 61-73-12-46 153h595z"
          fill="#E1F2F6"
          id="e1jpemtt300526"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m104 1080-59-90H-1l-50 9-50-26-41 55-23 52h269z"
          fill="#FEF7E3"
          id="e1jpemtt300527"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m243 957-51-52-61 8 79 42 33 2zM79 1080l-51-61 25 64 26-3zm64-211-39 31 55-16-16-15zM5 855l34 44-24 14-10-58z"
          fill="#E1F2F6"
          id="e1jpemtt300528"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m366 1098 14-52 23-6 17-27 22-25h26l23-15 19 24 50 6 7 24 41 16 23 55H366z"
          fill="#FEF7E3"
          id="e1jpemtt300529"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m406 1098 29-49 35-34 28 28 45 6 33 49H406zm104-100-5 30 55-25-50-5zm81 100-8-37 31 37h-23z"
          fill="#E1F2F6"
          id="e1jpemtt300530"
          stroke="none"
          strokeWidth="1"
        />
        <g transform="translate(643 385)">
          <path
            d="M877 566h-94l-77-158h-24l-30-48-19 15-28-37-65-19-45 18-13-18-53 4-20-76 65-43 55 72 145 16 19 69 118 47 66 158z"
            fill="url(#e1jpemtt300531-fill)"
            id="e1jpemtt300531"
            stroke="none"
            strokeWidth="1"
            transform="translate(-643 -385)"
          />
          <animateTransform
            attributeName="transform"
            dur="3s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            type="translate"
            values="643.050034,385.300003; 643.050034,400.693066; 643.050034,380.092154;"
          />
        </g>
        <g transform="translate(489 385)">
          <path
            d="M783 566H112l41-152 68-17 49-78 63-72h76l20 76 53-3 13 17 44-17 66 18 28 37 19-15 31 48h23l77 158zM674 292l-22 31 41 38-19-69zm-173-11 28-6-55-71 27 77zm318 283-20-69 66 71-46-2z"
            fill="#E1F2F6"
            id="e1jpemtt300532"
            stroke="none"
            strokeWidth="1"
            transform="translate(-489 -385)"
          />
          <animateTransform
            attributeName="transform"
            dur="3s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            type="translate"
            values="488.800003,385.300003; 488.800003,400.693066; 488.800003,380.092154;"
          />
        </g>
        <g transform="translate(365 424)">
          <path
            d="m323 327 34-47 52 102 92 26 72 160H157l64-171 32-46 70-24z"
            fill="#FEF7E3"
            id="e1jpemtt300533"
            stroke="none"
            strokeWidth="1"
            transform="translate(-365 -424)"
          />
          <animateTransform
            attributeName="transform"
            dur="3s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            type="translate"
            values="364.949997,423.800003; 364.949997,439.193066; 364.949997,418.592154;"
          />
        </g>
        <g transform="translate(357 480)">
          <path
            d="m492 566-45-108-70-27-23-37-54 46-61 32-17 95 270-1z"
            fill="#E1F2F6"
            id="e1jpemtt300534"
            stroke="none"
            strokeWidth="1"
            transform="translate(-357 -480)"
          />
          <animateTransform
            attributeName="transform"
            dur="3s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            type="translate"
            values="356.550034,480; 356.550034,495.393063; 356.550034,474.792151;"
          />
        </g>
        <g transform="translate(491 569)">
          <path
            d="M80 554h183c6 0 10 4 10 10v7c0 5-4 10-10 10H80c-6 0-11-5-11-10v-7a10 10 0 0 1 11-10zm749 0h73c5 0 10 4 10 10v7c0 5-5 10-10 10h-73c-6 0-10-5-10-10v-7c0-6 4-10 10-10zm-504 0h41c6 0 11 5 11 11v7c0 6-5 12-11 12h-41c-6 0-12-6-12-12v-7c0-6 6-11 12-11z"
            fill="#FEF7E3"
            id="e1jpemtt300535"
            stroke="none"
            strokeWidth="1"
            transform="translate(-491 -569)"
          />
          <animateTransform
            attributeName="transform"
            dur="3s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            type="translate"
            values="490.699776,568.699768; 490.699776,584.092831; 490.699776,563.491919;"
          />
        </g>
        <path
          d="M912 884h29a10 10 0 0 1 11 10h-40v-10z"
          fill="#383944"
          id="e1jpemtt300536"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M908 808s18-25 26-26l39-8s-25 37-65 34z"
          fill="#B8C4C2"
          id="e1jpemtt300537"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M951 848c-1-25-18-40-18-80l-51-11c0 12 1 27-6 53-13 52-8 84 28 85 35 1 47-24 46-47z"
          fill="url(#e1jpemtt300538-fill)"
          id="e1jpemtt300538"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M881 787s-26 24-30 36-4 31-4 31 25-21 31-42c4-14 3-25 3-25z"
          fill="#B8C4C2"
          id="e1jpemtt300539"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m893 787-4 21c-13 52-8 85 27 86"
          fill="none"
          id="e1jpemtt300540"
          stroke="#9FA1A2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        />
        <path
          d="m952 760-15-3a28 28 0 1 0-5 12l1 1 19-10z"
          fill="#383944"
          id="e1jpemtt300541"
          stroke="none"
          strokeWidth="1"
        />
        <circle
          fill="url(#e1jpemtt300542-fill)"
          id="e1jpemtt300542"
          r="20.8"
          stroke="none"
          strokeWidth="1"
          transform="translate(916 758)"
        />
        <circle
          fill="#383944"
          id="e1jpemtt300543"
          r="3.8"
          stroke="none"
          strokeWidth="1"
          transform="translate(912 757)"
        />
        <path
          d="M933 770c-6-1-8-9-3-14 5-4 2-17-13-19l5-4 13 11c3 5 2 11 2 14l5 7-9 5zm-55 114h30a10 10 0 0 1 10 10h-30a10 10 0 0 1-10-10zm161-125h29a10 10 0 0 1 10 10h-40l1-10z"
          fill="#383944"
          id="e1jpemtt300544"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1029 660s30-8 36-5l36 19s-43 13-72-14z"
          fill="#B8C4C2"
          id="e1jpemtt300545"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1082 703c-7-25-19-23-21-63l-53-8c1 12-16 60-18 94s19 45 48 46 57-28 44-69z"
          fill="url(#e1jpemtt300546-fill)"
          id="e1jpemtt300546"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1079 630-15-2a28 28 0 0 0-34-29 28 28 0 0 0-22 33 28 28 0 0 0 52 9h1l17-11z"
          fill="#383944"
          id="e1jpemtt300547"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1005 655s-25 25-28 37c-4 13-3 31-3 31s24-22 29-43a75 75 0 0 0 2-25z"
          fill="#B8C4C2"
          id="e1jpemtt300548"
          stroke="none"
          strokeWidth="1"
        />
        <circle
          fill="url(#e1jpemtt300549-fill)"
          id="e1jpemtt300549"
          r="20.8"
          stroke="none"
          strokeWidth="1"
          transform="translate(1043 631)"
        />
        <circle
          fill="#383944"
          id="e1jpemtt300550"
          r="3.8"
          stroke="none"
          strokeWidth="1"
          transform="translate(1038 630)"
        />
        <path
          d="M1061 641c-7 1-9-8-5-13 5-5 1-18-14-18l5-5c5 3 10 6 13 11 4 4 3 11 4 13 1 4 5 7 5 7l-8 5z"
          fill="#383944"
          id="e1jpemtt300551"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1017 656c-1 7-3 14-6 20-17 51-14 84 21 88"
          fill="none"
          id="e1jpemtt300552"
          stroke="#9FA1A2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        />
        <path
          d="M1002 761h30a10 10 0 0 1 10 10h-30a10 10 0 0 1-10-10z"
          fill="#383944"
          id="e1jpemtt300553"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1730 758s143 104 241 120c0 0-256 93-241-120z"
          fill="#13AA52"
          id="e1jpemtt300554"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1733 709s-63 136-214 185c89 43 246 0 214-185z"
          fill="#136149"
          id="e1jpemtt300555"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1715 665-99 160s136 33 99-160zm20-47s88 99 205 113c-103 63-171 15-197-37-18-37-8-76-8-76z"
          fill="#0AD05B"
          id="e1jpemtt300556"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1851 295-106-93s-15 106 106 93z"
          fill="#09804C"
          id="e1jpemtt300557"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1747 190-119 109s92 24 116-108c2-5 6-6 3-1zm-17 182s70 120 189 205c-182 24-189-205-189-205z"
          fill="#13AA52"
          id="e1jpemtt300558"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1738 394s-110 116-199 158c112 26 204-33 199-158z"
          fill="#136149"
          id="e1jpemtt300559"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1765 1028h-49l-5-193 6-135-6-72 4-138 7-78-3-89 4-129h32l4 163 1 69-5 43v191l3 57-3 107v59l10 145z"
          fill="#A49437"
          id="e1jpemtt300560"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1737 1028h-21l-5-193 6-135-6-72 4-138 7-78-3-89 4-129h4l4 163 1 68-5 44v191l3 57-3 107v59l10 145z"
          fill="#86681D"
          id="e1jpemtt300561"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1746 249 6 110-6 176-11 173 17 125-10 186"
          fill="#FFDD49"
          id="e1jpemtt300562"
          opacity=".4"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1762 183 103 77s-79 40-103-78z"
          fill="#0AD05B"
          id="e1jpemtt300563"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1727 164-131 109s73 37 142-101c3-7-5-13-11-8z"
          fill="#136149"
          id="e1jpemtt300564"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1733 44 44 86 84 100s-102 41-128-127c-2-20-2-39 0-59z"
          fill="#13AA52"
          id="e1jpemtt300565"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1733 44-22 59-92 114s120 38 114-173z"
          fill="#0AD05B"
          id="e1jpemtt300566"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1754 284 174 97s-158 30-174-97z"
          fill="#13AA52"
          id="e1jpemtt300567"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1747 321 177 134s-149 18-177-134z"
          fill="#09804C"
          id="e1jpemtt300568"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1747 321 150 197s-195-55-150-197z"
          fill="#136149"
          id="e1jpemtt300569"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1739 319-171 165s174 34 171-165z"
          fill="#0AD05B"
          id="e1jpemtt300570"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1554 418 141-85 47-21s-20 137-188 106z"
          fill="#13AA52"
          id="e1jpemtt300571"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1754 284s71 92 133 116c-85 43-147 2-133-116zm-23 281s-54 88-174 129c0 0 202 76 174-129z"
          fill="#0AD05B"
          id="e1jpemtt300572"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1821 686-94-105s-27 103 94 105z"
          fill="#13AA52"
          id="e1jpemtt300573"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1734 85-81 164s123 39 81-164z"
          fill="#09804C"
          id="e1jpemtt300574"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1733 78 86 156s-128 29-86-156zm-12 207-139 89s81 54 139-89z"
          fill="#136149"
          id="e1jpemtt300575"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1737 553 101 108s-139 6-101-108z"
          fill="#09804C"
          id="e1jpemtt300576"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1737 553-102 87s88 81 102-87z"
          fill="#136149"
          id="e1jpemtt300577"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1721 285-26 48-48 101s96 31 74-149z"
          fill="#09804C"
          id="e1jpemtt300578"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1735 691s116 139 153 143c-75 46-133-24-147-68-13-44-6-75-6-75z"
          fill="#136149"
          id="e1jpemtt300579"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1847 777-112-86s-8 106 112 86zm-119-117s-78 73-209 120c0 1 164 92 209-120z"
          fill="#09804C"
          id="e1jpemtt300580"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1603 729 85-45 40-24s1 93-125 69z"
          fill="#13AA52"
          id="e1jpemtt300581"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1737 162c0-11-2-22-7-32v49c-4 8-8 16-14 22 1-12-2-25-7-36v44a167 167 0 0 1-21 20c2-11 2-21 0-32l-8 37-28 17-1-14-4 16a366 366 0 0 1-51 20l142-170s10 26-1 59zm-1 454a80 80 0 0 1 7-32v49c4 8 8 16 14 23-1-13 2-25 7-37v44a167 167 0 0 0 21 20 81 81 0 0 1 0-32l8 37c9 7 18 12 28 17l1-14 4 17a366 366 0 0 0 51 19l-142-170a102 102 0 0 0 1 59zm-17 199a81 81 0 0 0-2-32l-8 48a128 128 0 0 1-18 19 85 85 0 0 0 0-37l-8 44c-7 6-15 11-24 15 4-10 5-20 5-31l-13 35c-10 5-21 9-31 12l1-14-7 16a371 371 0 0 1-54 10l170-143s5 27-11 58z"
          fill="#136149"
          id="e1jpemtt300582"
          opacity=".4"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1747 113c-1-15-1-31 3-44l6 66a197 197 0 0 0 17 29 151 151 0 0 1 2-50l6 61a196 196 0 0 0 24 24c-3-14-4-29-3-43l11 50 37 23-60-92-57-93s-1 24 14 69z"
          fill="#B5E6C9"
          id="e1jpemtt300583"
          opacity=".3"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1729 415c0-14-3-27-9-40v62a163 163 0 0 1-19 28 103 103 0 0 0-9-46v56c-9 9-18 17-28 24 2-13 2-27-1-39l-9 47a323 323 0 0 1-38 21l-2-18-4 21a491 491 0 0 1-69 25l189-216s12 33-1 75zm31-87a48 48 0 0 1 4-25l4 37 15 15a52 52 0 0 1 4-28l4 33 22 13a48 48 0 0 1-2-24l10 27 29 10 1-11 5 12c17 4 34 8 52 10l-154-114s-7 21 6 45z"
          fill="#136149"
          id="e1jpemtt300584"
          opacity=".4"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1763 360c-1-15 0-31 3-45l6 67a197 197 0 0 0 18 29 151 151 0 0 1 2-50l5 61a196 196 0 0 0 24 24c-3-14-4-29-3-43l12 50a250 250 0 0 0 31 20v-19l5 22a311 311 0 0 0 56 23l-167-221s-6 37 8 82zm-62 321c3-15 5-30 4-44l-17 64a188 188 0 0 1-22 27c5-17 8-35 6-51l-15 59c-9 8-18 14-28 20 5-13 9-27 10-42l-20 48a253 253 0 0 1-34 14c2-6 3-12 3-19l-9 21c-18 6-38 11-58 13l202-189s0 37-22 79zm50 126c-4-15-6-29-5-44l18 64 22 26c-5-16-7-33-7-50l17 58a199 199 0 0 0 28 19 149 149 0 0 1-11-41l21 47 34 14-4-20 10 22a323 323 0 0 0 58 11l-205-185s1 38 24 79zm-49-495c3-8 6-17 7-26l-17 36-16 13c4-9 8-19 9-29l-16 33-18 8a91 91 0 0 0 11-23l-18 25-21 5 4-11-8 11a191 191 0 0 1-35 1l140-87s-5 22-22 44z"
          fill="#B5E6C9"
          id="e1jpemtt300585"
          opacity=".3"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1568 1085 117-82 30-4 14 13 35 1 27 6 97 66h-320z"
          fill="#C5E4F2"
          id="e1jpemtt300586"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1764 1013 27 6 97 66h-62l-62-72zm-76 72 23-43 28 31 15-10 18 22h-84z"
          fill="#FEF7E3"
          id="e1jpemtt300587"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1452 833 83 176s25-31 10-89c-13-47-93-87-93-87zm-23 229h46c10 0 18 8 18 18h-64v-18z"
          fill="#383944"
          id="e1jpemtt300588"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1511 982c-6 56-54 98-85 98h-70v-51c62 0 36-108 36-108l6-64c2-18-4-32-6-33a21 21 0 0 1-12-11l6-25c1-5 3-9 6-13a21 21 0 0 1 27 19v1s44 36 42 38c50 39 50 149 50 149z"
          fill="url(#e1jpemtt300589-fill)"
          id="e1jpemtt300589"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1356 1055v26h-46l46-26z"
          fill="#383944"
          id="e1jpemtt300590"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1447 821a38 38 0 0 1-39 37c-3 0-26-40-28-45 3-6 5-21 6-25l6-13a21 21 0 0 1 27 19l28 27z"
          fill="#FFDD49"
          id="e1jpemtt300591"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1407 998c-13 17-30 31-51 31V876c0-9 2-17 6-25l18-38c2 5 30 32 40 54a131 131 0 0 1-13 131zm113-239c-27 12-61 54-59 75l-18-7c-18-8-23-11-24-33a21 21 0 0 0-27-19 52 52 0 0 1 45-29c22 0 35 16 38 24l44-13 1 2z"
          fill="#383944"
          id="e1jpemtt300592"
          stroke="none"
          strokeWidth="1"
        />
        <circle
          fill="#FFF"
          id="e1jpemtt300593"
          r="3.9"
          stroke="none"
          strokeWidth="1"
          transform="translate(1432 782)"
        />
        <path
          d="m1358 941 34-191s-39 11-60 66c-17 47 26 125 26 125z"
          fill="#383944"
          id="e1jpemtt300594"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1506 764s-13 9-19 14a665 665 0 0 1-15 13s3-7 14-16 20-11 20-11z"
          fill="#F97216"
          id="e1jpemtt300595"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1167 732-155 76s4-39 50-66c48-29 105-10 105-10zm-4 202h-57c0-9 7-16 16-16h41v16z"
          fill="#383944"
          id="e1jpemtt300596"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1090 846c5 50 48 88 76 88h62v-46c-55 0-32-96-32-96l-6-58c-1-15 5-28 6-29 5-2 9-5 11-9l-6-23a74 74 0 0 0-5-12 18 18 0 0 0-24 18s-39 33-37 34c-45 35-45 133-45 133z"
          fill="url(#e1jpemtt300597-fill)"
          id="e1jpemtt300597"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1228 911v23h41l-41-23z"
          fill="#383944"
          id="e1jpemtt300598"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1147 702a34 34 0 0 0 35 33c3 0 23-35 25-39l-6-23a74 74 0 0 0-5-12 18 18 0 0 0-24 18l-25 23z"
          fill="#FFDD49"
          id="e1jpemtt300599"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1183 860c11 16 26 28 45 28V752c0-8-2-16-5-23l-16-34c-2 5-27 29-36 48a117 117 0 0 0 12 117zm-101-213c23 10 54 49 52 66l17-5c16-7 20-10 21-29a18 18 0 0 1 24-18 47 47 0 0 0-40-25 37 37 0 0 0-34 21l-39-11c-1-1-2 1-1 1z"
          fill="#383944"
          id="e1jpemtt3005100"
          stroke="none"
          strokeWidth="1"
        />
        <circle
          fill="#FFF"
          id="e1jpemtt3005101"
          r="3.5"
          stroke="none"
          strokeWidth="1"
          transform="translate(1161 667)"
        />
        <path
          d="m1288 878-82-152s36-2 69 40c27 34 13 112 13 112z"
          fill="#383944"
          id="e1jpemtt3005102"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="m1094 652 17 12 13 12s-2-6-11-15-19-9-19-9z"
          fill="#F97216"
          id="e1jpemtt3005103"
          stroke="none"
          strokeWidth="1"
        />
        <path
          d="M1209 715c-9 9-17 19-23 31a117 117 0 0 0 12 116 80 80 0 0 0 20 20m147 128a117 117 0 0 0 14-158"
          fill="none"
          id="e1jpemtt3005104"
          stroke="#9FA1A2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        />
        <g id="e1jpemtt3005105" transform="translate(476 436)">
          <path
            d="M402 463v16h-28v-16h-57v-19l51-51h34v50h15v20h-15zm-28-47-27 27h27v-28zm103 65c-26 0-51-10-51-45 0-28 15-46 53-46 33 1 49 17 49 46 0 30-19 45-51 45zm0-72c-17 0-20 16-20 26 0 8 1 27 19 27 16 0 20-13 20-27 0-9-2-26-19-26zm143 54v16h-29v-16h-56v-19l50-52h35v51h15v20h-15zm-29-48-27 28h27v-28z"
            fill="#7DC5DB"
            id="e1jpemtt3005106"
            stroke="none"
            strokeWidth="1"
            transform="translate(-476 -436)"
          />
          <animateTransform
            attributeName="transform"
            dur="3s"
            keyTimes="0;0.5;1"
            repeatCount="indefinite"
            type="translate"
            values="476.049988,435.949997; 476.049988,451.34306; 476.049988,430.742148;"
          />
        </g>
        <clipPath id="e1jpemtt3005107">
          <use
            fill="#000"
            height="1106.1"
            id="e1jpemtt3005108"
            stroke="none"
            strokeWidth="1"
            width="1943.9"
            xlinkHref="#e1jpemtt30052"
          />
        </clipPath>
      </g>
    </svg>
  );
};

export default NotFoundSvg;
