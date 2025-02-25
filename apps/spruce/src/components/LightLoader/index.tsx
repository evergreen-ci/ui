import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";

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
    height: 32px;
    width: 32px;
    margin: 6px;
    border: 6px solid currentColor;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: currentColor transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
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
