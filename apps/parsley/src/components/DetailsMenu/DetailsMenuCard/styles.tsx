import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { Subtitle } from "@leafygreen-ui/typography";
import { styled } from "@linaria/react";
import { size } from "@evg-ui/lib/constants/tokens";

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${size.m};
`;

const DetailName = styled(
  Subtitle as React.FC<React.ComponentProps<typeof Subtitle>>,
)`
  font-size: ${size.s};
  margin-right: ${size.xs};
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface DetailsLabelProps {
  label: string;
  children: string;
}
const DetailsLabel: React.FC<DetailsLabelProps> = ({ children, label }) => (
  <LabelWrapper>
    <DetailName>{children}</DetailName>
    <InfoSprinkle>{label}</InfoSprinkle>
  </LabelWrapper>
);
export { DetailRow, DetailsLabel };
