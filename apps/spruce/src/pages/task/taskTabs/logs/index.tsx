import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskAnalytics } from "analytics";
import { siderCardWidth } from "components/styles/Layout";
import { getParsleyTaskLogLink } from "constants/externalResources";
import { getTaskHTMLLogRoute } from "constants/routes";
import { TaskLogLinks } from "gql/generated/types";
import { useUpdateURLQueryParams } from "hooks";
import { LogTypes, QueryParams } from "types/task";
import { EventLog, AgentLog, SystemLog, TaskLog, AllLog } from "./LogTypes";

const DEFAULT_LOG_TYPE = LogTypes.Task;

const options = {
  [LogTypes.Agent]: AgentLog,
  [LogTypes.System]: SystemLog,
  [LogTypes.Task]: TaskLog,
  [LogTypes.Event]: EventLog,
  [LogTypes.All]: AllLog,
};

interface Props {
  logLinks: TaskLogLinks;
  taskId: string;
  execution: number;
}
const Logs: React.FC<Props> = ({ execution, logLinks, taskId }) => {
  const { sendEvent } = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const parsed = queryString.parse(search);
  const logTypeParam = (parsed[QueryParams.LogType] || "")
    .toString()
    .toLowerCase() as LogTypes;

  const [currentLog, setCurrentLog] = useState<LogTypes>(
    Object.values(LogTypes).includes(logTypeParam)
      ? logTypeParam
      : DEFAULT_LOG_TYPE,
  );
  const [noLogs, setNoLogs] = useState(false);

  const onChangeLog = (value: string): void => {
    const nextLogType = value as LogTypes;
    setCurrentLog(nextLogType);
    updateQueryParams({ [QueryParams.LogType]: nextLogType });
    sendEvent({
      name: "Changed log preview type",
      "log.type": nextLogType,
    });
  };

  const { htmlLink, parsleyLink, rawLink } = getLinks(
    logLinks,
    currentLog,
    taskId,
    execution,
  );
  const LogComp = options[currentLog];

  return (
    <LogContainer>
      <LogHeader>
        <SegmentedControl
          aria-controls="Select a log type"
          label="Log Tail"
          name="log-select"
          onChange={onChangeLog}
          value={currentLog}
        >
          <SegmentedControlOption id="cy-task-option" value={LogTypes.Task}>
            Task Logs
          </SegmentedControlOption>
          <SegmentedControlOption id="cy-agent-option" value={LogTypes.Agent}>
            Agent Logs
          </SegmentedControlOption>
          <SegmentedControlOption id="cy-system-option" value={LogTypes.System}>
            System Logs
          </SegmentedControlOption>
          <SegmentedControlOption id="cy-all-option" value={LogTypes.All}>
            Combined Logs
          </SegmentedControlOption>
        </SegmentedControl>

        <ButtonContainer>
          <Button
            data-cy="cy-event-option"
            onClick={() => onChangeLog(LogTypes.Event)}
            variant={currentLog === LogTypes.Event ? "primary" : "default"}
          >
            Event Log
          </Button>
        </ButtonContainer>
      </LogHeader>
      <LogContentWrapper>
        {LogComp && <LogComp setNoLogs={setNoLogs} />}
        {currentLog !== LogTypes.Event && (
          <>
            <FadeOverlay />
            <FloatingButtonContainer>
              {parsleyLink && (
                <Button
                  data-cy="parsley-log-btn"
                  disabled={noLogs}
                  href={parsleyLink}
                  onClick={() =>
                    sendEvent({
                      name: "Clicked log link",
                      "log.type": currentLog,
                      "log.viewer": "parsley",
                    })
                  }
                  title="View complete logs in Parsley"
                  variant={Variant.PrimaryOutline}
                >
                  Complete Logs on Parsley
                </Button>
              )}
              {htmlLink && (
                <Button
                  data-cy="html-log-btn"
                  disabled={noLogs}
                  href={htmlLink}
                  onClick={() =>
                    sendEvent({
                      name: "Clicked log link",
                      "log.type": currentLog,
                      "log.viewer": "html",
                    })
                  }
                  title="Plain, colorized log viewer"
                >
                  HTML
                </Button>
              )}
              {rawLink && (
                <Button
                  data-cy="raw-log-btn"
                  disabled={noLogs}
                  href={rawLink}
                  onClick={() =>
                    sendEvent({
                      name: "Clicked log link",
                      "log.type": currentLog,
                      "log.viewer": "raw",
                    })
                  }
                  title="Plain text log viewer"
                >
                  Raw
                </Button>
              )}
            </FloatingButtonContainer>
          </>
        )}
      </LogContentWrapper>
    </LogContainer>
  );
};

const LogContainer = styled.div`
  // Subtract sider card width and margins.
  width: calc(100vw - ${siderCardWidth}px - 80px);
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.s};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;

const LogContentWrapper = styled.div`
  position: relative;
`;

const FadeOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  z-index: 1;
`;

const FloatingButtonContainer = styled.div`
  position: absolute;
  top: ${size.s};
  right: ${size.s};
  display: flex;
  gap: ${size.xs};
  z-index: 2;
`;

interface GetLinksResult {
  htmlLink?: string;
  parsleyLink?: string;
  rawLink?: string;
}

const getLinks = (
  logLinks: TaskLogLinks,
  logType: LogTypes,
  taskId: string,
  execution: number,
): GetLinksResult => {
  if (!logLinks || logType === LogTypes.Event) {
    return {};
  }
  const rawLink = `${
    {
      [LogTypes.Agent]: logLinks.agentLogLink,
      [LogTypes.System]: logLinks.systemLogLink,
      [LogTypes.Task]: logLinks.taskLogLink,
      [LogTypes.All]: logLinks.allLogLink,
    }[logType] ?? ""
  }&text=true`;
  return {
    htmlLink: getTaskHTMLLogRoute(taskId, execution, logType),
    parsleyLink: getParsleyTaskLogLink(logType, taskId, execution),
    rawLink,
  };
};

export default Logs;
