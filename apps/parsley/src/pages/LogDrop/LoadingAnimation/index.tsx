import { Body } from "@leafygreen-ui/typography";
import { styled } from "@linaria/react";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import LoadingBar from "components/LoadingBar";

const LoadingAnimation: React.FC = () => (
  <AnimateIn>
    <StyledBody>Loading log...</StyledBody>
    <LoadingBar indeterminate />
  </AnimateIn>
);

// Linaria's styled() cannot infer props from LeafyGreen's polymorphic components,
// so Body is narrowed to its default rendered element.
const StyledBody = styled(
  Body as React.FC<React.ComponentPropsWithoutRef<"p">>,
)`
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
