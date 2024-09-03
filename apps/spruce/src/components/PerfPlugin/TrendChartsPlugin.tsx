import styled from "@emotion/styled";
import { environmentVariables } from "utils";

const { getSignalProcessingUrl } = environmentVariables;

interface Props {
  taskId: string;
}

const TrendChartsPlugin: React.FC<Props> = ({ taskId }) => (
  <StyledIframe
    allow="clipboard-read; clipboard-write"
    src={`${getSignalProcessingUrl()}/task/${taskId}/performanceData`}
    title="Task Performance Data"
  />
);

const StyledIframe = styled.iframe`
  width: 100%;
  height: 1000px;
`;

export default TrendChartsPlugin;
