import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { transitionDuration } from "@leafygreen-ui/tokens";

const { green } = palette;

// LightLoader is an alternate loader component to avoid the bloat included in LeafyGreen's loader component due to use of react-lottie-player.
export const LightLoader: React.FC = () => (
  <Loader className="lds-ring">
    <div />
    <div />
    <div />
    <div />
  </Loader>
);

const Loader = styled.div`
  color: ${green.base};
  width: fit-content;
  height: fit-content;
  div {
    display: block;
    position: absolute;
    height: 28px;
    width: 28px;
    margin: 6px;
    border: 3px solid currentColor;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: currentColor transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -${transitionDuration.slowest}ms;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -${transitionDuration.slower}ms;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -${transitionDuration.default}ms;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
