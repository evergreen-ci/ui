import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import ReleaseStepBadge from "./ReleaseStepBadge";
import { ReleaseStep, ReleaseStepStatus } from "./types";
import { msToDuration } from "./utils";

interface ReleaseStepDetailsProps {
  step: ReleaseStep;
}

const ReleaseStepDetails: React.FC<ReleaseStepDetailsProps> = ({ step }) => (
  <StepDetails>
    <StepName status={step.status} weight="bold">
      {step.name}
    </StepName>
    <DurationContainer>
      <Icon glyph="Clock" />
      {step.duration > 0 ? msToDuration(step.duration) : "-"}
    </DurationContainer>
    <div>
      <ReleaseStepBadge status={step.status} />
    </div>
  </StepDetails>
);

const StepDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DurationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StepName = styled(Body)<{ status: ReleaseStepStatus }>`
  color: ${({ status }) =>
    status === ReleaseStepStatus.COMPLETED
      ? palette.green.dark2
      : palette.gray.dark1};
`;

export default ReleaseStepDetails;
