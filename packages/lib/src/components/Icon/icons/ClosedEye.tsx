import { palette } from "@leafygreen-ui/palette";
import createGlyph from "./createGlyph";

const { black } = palette;

export const ClosedEye = createGlyph(
  "ClosedEye",
  "0 0 16 16",
  <>
    <path
      d="M15 7h-1.385c0 1.436-3.769 4.308-5.615 4.308v1.077c2.154 0 7-2.244 7-5.385ZM1 7h1.385c0 1.436 3.769 4.308 5.615 4.308v1.077c-2.154 0-7-2.244-7-5.385Z"
      fill="currentColor"
    />
    <path
      d="M8 12.385c-2.154 0-7-2.244-7-5.385h1.385c0 1.436 3.769 4.308 5.615 4.308m0 1.077v-1.077m0 1.077c2.154 0 7-2.244 7-5.385h-1.385c0 1.436-3.769 4.308-5.615 4.308M1 11.038l.862-.808.43.404-.861.808L1 11.038Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path
      d="M5.308 11.846h-.862l-.861 1.211L4 13.5l1.308-1.654ZM15 11.038l-.861-.808-.431.404.861.808.431-.404ZM10.421 11.757h.862l1.132 1.3-.43.404-1.564-1.704Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path
      d="M7.462 12.385h1.076V14H7.462v-1.615Z"
      fill="currentColor"
      stroke="currentColor"
      strokeLinejoin="round"
    />
  </>,
  { defaultFill: black },
);
