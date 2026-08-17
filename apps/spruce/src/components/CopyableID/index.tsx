import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { CopyButton } from "components/CopyButton";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";

interface CopyableIDProps {
  "data-testid"?: string;
  textToCopy: string;
  tooltipLabel: string;
}

export const CopyableID: React.FC<CopyableIDProps> = ({
  "data-testid": dataTestId,
  textToCopy,
  tooltipLabel,
}) => (
  <MetadataItem as="div" data-testid={dataTestId}>
    <Container>
      <LabelWrapper>
        <MetadataLabel>ID: </MetadataLabel>
        {textToCopy}
      </LabelWrapper>
      <CopyButtonWrapper>
        <CopyButton textToCopy={textToCopy} tooltipLabel={tooltipLabel} />
      </CopyButtonWrapper>
    </Container>
  </MetadataItem>
);

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xs};
`;

const LabelWrapper = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
`;

const CopyButtonWrapper = styled.span`
  height: ${size.s};
  position: relative;
  bottom: 3px;
`;
