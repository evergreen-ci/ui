import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import Breadcrumbs from "components/Breadcrumbs";
import { ToggleChatbotButton } from "components/Chatbot/ToggleChatbotButton";
import { subheaderHeight } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { EvergreenTaskSubHeader } from "./EvergreenTaskSubHeader";
import { SectionControls } from "./SectionControls";

const { gray } = palette;

interface SubHeaderProps {
  setSidePanelCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubHeader: React.FC<SubHeaderProps> = ({ setSidePanelCollapsed }) => {
  const { isUploadedLog, logMetadata } = useLogContext();
  const { buildID, execution, fileName, groupID, logType, taskID, testID } =
    logMetadata || {};

  return (
    <Container data-cy="log-header">
      {isUploadedLog ? (
        <Header>
          <Icon glyph="File" size="large" />
          <Breadcrumbs
            breadcrumbs={
              fileName
                ? [
                    {
                      text: fileName,
                      trimLength: 50,
                    },
                  ]
                : []
            }
          />
        </Header>
      ) : (
        <>
          <Header>
            {taskID && (
              <EvergreenTaskSubHeader
                buildID={buildID as string}
                execution={Number(execution)}
                fileName={fileName}
                groupID={groupID}
                logType={logType}
                taskID={taskID}
                testID={testID as string}
              />
            )}
            <SectionControls />
          </Header>
          <ToggleChatbotButton setSidePanelCollapsed={setSidePanelCollapsed} />
        </>
      )}
    </Container>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.s};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${subheaderHeight};

  background-color: ${gray.light3};
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.05);
  padding: 0 ${size.s} 0 ${size.xs};
`;

export default SubHeader;
