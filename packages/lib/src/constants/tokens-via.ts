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
  black: tokens.color.black.$value,
  white: tokens.color.white.$value,
  blue: {
    base: tokens.color.blue.base.$value,
    dark1: tokens.color.blue.dark1.$value,
    dark2: tokens.color.blue.dark2.$value,
    dark3: tokens.color.blue.dark3.$value,
    light1: tokens.color.blue.light1.$value,
    light2: tokens.color.blue.light2.$value,
    light3: tokens.color.blue.light3.$value,
  },
  gray: {
    base: tokens.color.gray.base.$value,
    dark1: tokens.color.gray.dark1.$value,
    dark2: tokens.color.gray.dark2.$value,
    dark3: tokens.color.gray.dark3.$value,
    dark4: tokens.color.gray.dark4.$value,
    light1: tokens.color.gray.light1.$value,
    light2: tokens.color.gray.light2.$value,
    light3: tokens.color.gray.light3.$value,
  },
  green: {
    base: tokens.color.green.base.$value,
    dark1: tokens.color.green.dark1.$value,
    dark2: tokens.color.green.dark2.$value,
    dark3: tokens.color.green.dark3.$value,
    light1: tokens.color.green.light1.$value,
    light2: tokens.color.green.light2.$value,
    light3: tokens.color.green.light3.$value,
  },
  purple: {
    base: tokens.color.purple.base.$value,
    dark2: tokens.color.purple.dark2.$value,
    dark3: tokens.color.purple.dark3.$value,
    light2: tokens.color.purple.light2.$value,
    light3: tokens.color.purple.light3.$value,
  },
  red: {
    base: tokens.color.red.base.$value,
    dark2: tokens.color.red.dark2.$value,
    dark3: tokens.color.red.dark3.$value,
    light1: tokens.color.red.light1.$value,
    light2: tokens.color.red.light2.$value,
    light3: tokens.color.red.light3.$value,
  },
  yellow: {
    base: tokens.color.yellow.base.$value,
    dark2: tokens.color.yellow.dark2.$value,
    dark3: tokens.color.yellow.dark3.$value,
    light2: tokens.color.yellow.light2.$value,
    light3: tokens.color.yellow.light3.$value,
  },
} as const;
