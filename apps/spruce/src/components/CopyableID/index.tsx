import styled from "@emotion/styled";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { CopyButton } from "components/CopyButton";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";

interface CopyableIDProps {
  "data-cy"?: string;
  textToCopy: string;
  tooltipLabel: string;
  truncateAt?: number;
}

export const CopyableID: React.FC<CopyableIDProps> = ({
  "data-cy": dataCy,
  textToCopy,
  tooltipLabel,
  truncateAt,
}) => {
  const displayText = truncateAt
    ? `${textToCopy.slice(0, truncateAt)}...`
    : textToCopy;

  return (
    <MetadataItem data-cy={dataCy}>
      <MetadataLabel>ID: </MetadataLabel>
      <WordBreakText all>{displayText}</WordBreakText>
      <CopyWrapper>
        <CopyButton textToCopy={textToCopy} tooltipLabel={tooltipLabel} />
      </CopyWrapper>
    </MetadataItem>
  );
};

const WordBreakText = styled(WordBreak)`
  margin-right: ${size.xxs};
`;

const CopyWrapper = styled.span`
  vertical-align: baseline;
`;
