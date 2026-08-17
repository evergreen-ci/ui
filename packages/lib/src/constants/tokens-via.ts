import tokens from "@via-ds/tokens";

export const size = {
  xxs: tokens.space[100].$value, // 4px
  xs: tokens.space[200].$value, // 8px
  s: tokens.space[400].$value, // 16px
  m: tokens.space[600].$value, // 24px
  l: tokens.space[800].$value, // 32px
  xl: tokens.space[1600].$value, // 64px
  xxl: tokens.space[1800].$value, // 72px
} as const;

export const palette = {
  black: tokens.color.neutral[900].$value,
  white: tokens.color.neutral["000"].$value,
  blue: {
    base: tokens.color.blue[400].$value,
    dark1: tokens.color.blue[500].$value,
    dark2: tokens.color.blue[600].$value,
    dark3: tokens.color.blue[700].$value,
    light1: tokens.color.blue[300].$value,
    light2: tokens.color.blue[200].$value,
    light3: tokens.color.blue[100].$value,
  },
  gray: {
    base: tokens.color.neutral[400].$value,
    dark1: tokens.color.neutral[500].$value,
    dark2: tokens.color.neutral[600].$value,
    dark3: tokens.color.neutral[700].$value,
    dark4: tokens.color.neutral[800].$value,
    light1: tokens.color.neutral[300].$value,
    light2: tokens.color.neutral[200].$value,
    light3: tokens.color.neutral[100].$value,
  },
  green: {
    base: tokens.color.green[400].$value,
    dark1: tokens.color.green[500].$value,
    dark2: tokens.color.green[600].$value,
    dark3: tokens.color.green[700].$value,
    light1: tokens.color.green[300].$value,
    light2: tokens.color.green[200].$value,
    light3: tokens.color.green[100].$value,
  },
  purple: {
    base: tokens.color.purple[400].$value,
    dark2: tokens.color.purple[600].$value,
    dark3: tokens.color.purple[700].$value,
    light2: tokens.color.purple[200].$value,
    light3: tokens.color.purple[100].$value,
  },
  red: {
    base: tokens.color.red[400].$value,
    dark2: tokens.color.red[600].$value,
    dark3: tokens.color.red[700].$value,
    light1: tokens.color.red[300].$value,
    light2: tokens.color.red[200].$value,
    light3: tokens.color.red[100].$value,
  },
  yellow: {
    base: tokens.color.yellow[400].$value,
    dark2: tokens.color.yellow[600].$value,
    dark3: tokens.color.yellow[700].$value,
    light2: tokens.color.yellow[200].$value,
    light3: tokens.color.yellow[100].$value,
  },
} as const;
