import styled from "@emotion/styled";
import { size, transitionDuration } from "@evg-ui/lib/constants";

export const StickyHeaderContainer = styled.div<{
  showShadow: boolean;
  saveable: boolean;
}>`
  align-items: start;
  background-color: white;
  display: flex;
  gap: ${size.s};
  justify-content: space-between;
  margin: 0 -${size.l};
  padding: 0 ${size.l} ${size.s} ${size.l};

  ${({ saveable }) => saveable && "position: sticky;"}
  z-index: 1;
  top: 0;

  ${({ showShadow }) =>
    showShadow
      ? "box-shadow: 0 3px 4px -4px rgba(0, 0, 0, 0.6);"
      : "box-shadow: unset;"}
  transition: box-shadow ${transitionDuration.default}ms ease-in-out;
`;
