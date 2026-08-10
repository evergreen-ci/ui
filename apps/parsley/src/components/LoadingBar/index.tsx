import { palette } from "@leafygreen-ui/palette";
import { styled } from "@linaria/react";
import { size } from "@evg-ui/lib/constants/tokens";

interface LoadingBarProps {
  progress?: number;
  indeterminate: boolean;
}

interface BarStyle extends React.CSSProperties {
  "--progress": string;
}

const getBarStyle = (progress: number): BarStyle => ({
  "--progress": `${progress}%`,
});

const LoadingBar: React.FC<LoadingBarProps> = ({
  indeterminate = false,
  progress = 100,
}) => (
  <Container>
    <Bar
      data-full={indeterminate || progress === 100}
      data-indeterminate={indeterminate}
      style={getBarStyle(indeterminate ? 100 : progress)}
    />
  </Container>
);

const Container = styled.div`
  height: inherit;
  background-color: ${palette.gray.light2};
  border-radius: ${size.xxs};
  width: 100%;
  overflow: hidden;
`;

const Bar = styled.div`
  /* border radius left */
  border-top-left-radius: ${size.xxs};
  border-bottom-left-radius: ${size.xxs};
  height: 6px;
  background-color: ${palette.green.base};
  box-shadow: 0 0 ${size.xs} ${palette.green.light2};
  width: var(--progress);

  &[data-full="true"] {
    /* border radius right */
    border-top-right-radius: ${size.xxs};
    border-bottom-right-radius: ${size.xxs};
  }

  &[data-indeterminate="true"] {
    position: relative;
    bottom: 0;
    top: 0;
    width: 50%;

    /* Move the bar infinitely */
    animation: none;
    transform: translateX(-50%);
    animation-name: indeterminate-progress-bar;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes indeterminate-progress-bar {
    0% {
      transform: translateX(-150%);
    }
    100% {
      transform: translateX(200%);
    }
  }
`;

export default LoadingBar;
