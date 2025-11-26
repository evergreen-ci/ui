import { useRef } from "react";
import styled from "@emotion/styled";
import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { size } from "@evg-ui/lib/constants/tokens";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import { TestSelectionGuideCue } from "./TestSelectionGuideCue";

type Props = {
  testSelectionEnabled: boolean;
};

export const TestSelection: React.FC<Props> = ({ testSelectionEnabled }) => {
  const testSelectionGuideCue = useRef<HTMLDivElement>(null);
  return (
    <MetadataItem as="div">
      <TestSelectionGuideCue
        enabled={testSelectionEnabled}
        refEl={testSelectionGuideCue}
      />
      <ItemWrapper ref={testSelectionGuideCue}>
        <MetadataLabel>Test Selection:</MetadataLabel>
        <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
          If enabled, a subset of tests will run based on the project&apos;s
          optimization strategies.
        </InfoSprinkle>
        <Badge
          variant={
            testSelectionEnabled ? BadgeVariant.Blue : BadgeVariant.LightGray
          }
        >
          {testSelectionEnabled ? "enabled" : "disabled"}
        </Badge>
      </ItemWrapper>
    </MetadataItem>
  );
};

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
