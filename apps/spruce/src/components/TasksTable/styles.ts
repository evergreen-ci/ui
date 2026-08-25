import { css } from "@emotion/react";

// Reduce the amount of padding in the review column
// Consumed via the Emotion css prop in pages, so it must stay SerializedStyles —
// the css prop rejects plain strings.
export const taskReviewStyles = css`
  th:first-of-type#reviewed {
    padding-left: var(--via-space-200);
    padding-right: 0;
  }
`;
