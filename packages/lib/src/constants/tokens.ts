import { spacing, transitionDuration } from "@leafygreen-ui/tokens";

// Should be used for spacing such as margins and padding.
export const size = {
  xxs: `${spacing[100]}px`, // 4px
  xs: `${spacing[200]}px`, // 8px
  s: `${spacing[400]}px`, // 16px
  m: `${spacing[600]}px`, // 24px
  l: `${spacing[800]}px`, // 32px
  xl: `${spacing[1600]}px`, // 64px
  xxl: `${spacing[1800]}px`, // 72px
} as const;

export const zIndex = {
  backdrop: -1,

  // Set these values to 1 to utilize LeafyGreen's built-in stacking context
  drawer: 1,
  modal: 1,
  popover: 1,
  sideNav: 1,
  stickyHeader: 1,
  tooltip: 20,
  toast: 40,
  dropdown: 50,
  max_do_not_use: 1000, // should only be used for things like the welcome modal that need to overlay EVERYTHING
} as const;

export const fontSize = {
  l: "18px",
  m: "14px",
  s: "8px",
} as const;

export const textInputHeight = "36px";

/**
 * The LeafyGreen table header columns have a default left padding of 32px.
 * This constant can be used to achieve alignment with the header columns.
 */
export const tableColumnOffset = size.l;

export { transitionDuration };
