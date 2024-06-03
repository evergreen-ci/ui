import { spacing } from "@leafygreen-ui/tokens";

// Should be used for spacing such as margins and padding.
export const size = {
  xxs: `${spacing[100]}px`, // 4px
  xs: `${spacing[200]}px`, // 8px
  s: `${spacing[400]}px`, // 16px
  m: `${spacing[4]}px`, // 24px
  l: `${spacing[5]}px`, // 32px
  xl: `${spacing[6]}px`, // 64px
  xxl: `${spacing[7]}px`, // 88px
} as const;

export const textInputHeight = "36px";
