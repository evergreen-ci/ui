import { useRef } from "react";
import styled from "@emotion/styled";
import { Badge, Variant as BadgeVariant } from "@leafygreen-ui/badge";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { size } from "@evg-ui/lib/constants/tokens";
import { MetadataItem } from "components/MetadataCard";
import { TestSelectionGuideCue } from "./TestSelectionGuideCue";

type Props = {
  testSelectionEnabled: boolean;
};

export const TestSelection: React.FC<Props> = ({ testSelectionEnabled }) => {
  const testSelectionGuideCue = useRef<HTMLDivElement>(null);
  return (
    <MetadataItem as="div" label="Test Selection">
      <TestSelectionGuideCue
        enabled={testSelectionEnabled}
        refEl={testSelectionGuideCue}
      />
      <BadgeWrapper ref={testSelectionGuideCue}>
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
      </BadgeWrapper>
    </MetadataItem>
  );
};

const BadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${size.xxs};
  vertical-align: middle;
`;
