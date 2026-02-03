import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants";

// Reduce the amount of padding in the review column
export const taskReviewStyles = css`
  th:first-of-type#reviewed {
    padding-left: ${size.xs};
    padding-right: 0;
  }
`;
