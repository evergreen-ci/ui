import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { Row } from "components/LogRow/types";
import { size } from "constants/tokens";
import { CaretToggle } from "../CaretToggle";

const { gray } = palette;

interface SectionHeaderProps extends Row {
  commandName: string;
  functionID: string;
  commandID: string;
  onOpen: (v: {
    commandID: string;
    functionID: string;
    isOpen: boolean;
  }) => void;
  open: boolean;
}

const SubsectionHeader: React.FC<SectionHeaderProps> = ({
  commandID,
  commandName,
  functionID,
  onOpen,
  open,
}) => {
  const { sendEvent } = useLogWindowAnalytics();

  return (
    <Wrapper aria-expanded={open} data-cy="section-header">
      <CaretToggle
        onClick={() => {
          sendEvent({
            name: "Toggled Section",
            open: !open,
            sectionName: commandName,
            sectionType: "command",
          });
          onOpen({ commandID, functionID, isOpen: !open });
        }}
        open={open}
      />
      <Body>Command: {commandName}</Body>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.xxs} 0;
  padding-left: 48px;
  border-bottom: 1px solid ${gray.light1};
  background-color: ${gray.light2};
`;

export default SubsectionHeader;
