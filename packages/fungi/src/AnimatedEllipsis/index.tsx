import styled from "@emotion/styled";

export const AnimatedEllipsis = styled.span`
  display: inline-block;
  width: 1.5em;
  text-align: left;
  &::after {
    content: "";
    display: inline-block;
    width: 1.5em;
    animation: ellipsis steps(4, end) 1.2s infinite;
    overflow: hidden;
    vertical-align: bottom;
  }
  @keyframes ellipsis {
    0% {
      content: "";
    }
    25% {
      content: ".";
    }
    50% {
      content: "..";
    }
    75% {
      content: "...";
    }
    100% {
      content: "";
    }
  }
`;
