import { transitionDuration } from "@evg-ui/lib/constants/tokens";

export const hoverStyles = `
  :hover {
    cursor: pointer;
    background-color: var(--via-color-neutral-200);
  }
  transition-duration: ${transitionDuration.default}ms;
  transition-timing-function: ease-in-out;
  transition-delay: 0s;
  transition-behavior: normal;
  transition-property: background-color, color;
`;

export const overlineStyles = `
  color: var(--via-color-neutral-500);
  padding: var(--via-space-100) var(--via-space-200);
`;
