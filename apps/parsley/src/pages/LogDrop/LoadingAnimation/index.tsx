import styled from "@emotion/styled";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { fontSize, size } from "@evg-ui/lib/constants";
import LoadingBar from "components/LoadingBar";

const LoadingAnimation: React.FC = () => (
  <AnimateIn>
    <StyledBody>Loading log...</StyledBody>
    <LoadingBar indeterminate />
  </AnimateIn>
);

const StyledBody = styled(Body)<BodyProps>`
  font-size: ${fontSize.l};
  margin-bottom: ${size.xs};
`;

const AnimateIn = styled.div`
  animation: fadein 0.5s;
  width: 100%;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default LoadingAnimation;
