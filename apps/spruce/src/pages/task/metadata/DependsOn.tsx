import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getTaskRoute } from "constants/routes";
import { MetStatus, RequiredStatus } from "gql/generated/types";

interface Props {
  buildVariant: string;
  metStatus: MetStatus;
  requiredStatus: RequiredStatus;
  name: string;
  taskId: string;
}
export const DependsOn: React.FC<Props> = ({
  buildVariant,
  metStatus,
  name,
  requiredStatus,
  taskId,
}) => (
  <DependsOnWrapper>
    <LeftContainer>{metStatusToIcon[metStatus]}</LeftContainer>
    <RightContainer>
      <StyledRouterLink data-cy="depends-on-link" to={getTaskRoute(taskId)}>
        {name}
      </StyledRouterLink>
      <Subtitle>in {buildVariant}</Subtitle>
      {requiredStatusToBadge[requiredStatus]}
    </RightContainer>
  </DependsOnWrapper>
);

const DependsOnWrapper = styled.div`
  display: flex;
  padding-bottom: ${size.xs};
`;

const LeftContainer = styled.div`
  width: ${size.m};
  padding-top: ${size.xxs};
  padding-right: ${size.xs};
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  word-break: break-all;
  padding-right: ${size.xxs};
`;

const Subtitle = styled(Disclaimer)`
  padding-bottom: ${size.xxs};
`;

const StyledBadge = styled(Badge)`
  align-self: flex-start;
`;

const metStatusToIcon = {
  [MetStatus.Started]: <TaskStatusIcon status={TaskStatus.Started} />,
  [MetStatus.Met]: <TaskStatusIcon status={TaskStatus.Succeeded} />,
  [MetStatus.Unmet]: <TaskStatusIcon status={TaskStatus.Failed} />,
  [MetStatus.Pending]: <TaskStatusIcon status={TaskStatus.Pending} />,
};

const requiredStatusToBadge = {
  [RequiredStatus.MustFail]: (
    <StyledBadge variant={Variant.Red}>Must fail</StyledBadge>
  ),
  [RequiredStatus.MustFinish]: (
    <StyledBadge variant={Variant.Blue}>Must finish</StyledBadge>
  ),
  [RequiredStatus.MustSucceed]: (
    <StyledBadge variant={Variant.Green}>Must succeed</StyledBadge>
  ),
};
