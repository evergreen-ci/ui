import { css } from "@emotion/react";

// Reduce the amount of padding in the review column
export const taskReviewStyles = css`
  th:first-of-type#reviewed {
    padding-left: 8px;
    padding-right: 0;
  }
`;
