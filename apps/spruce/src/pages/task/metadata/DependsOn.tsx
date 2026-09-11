import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import Calendar from "@via-ds/icons/Calendar";
import Checkmark from "@via-ds/icons/Checkmark";
import Refresh from "@via-ds/icons/Refresh";
import X from "@via-ds/icons/X";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
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
      <StyledRouterLink data-testid="depends-on-link" to={getTaskRoute(taskId)}>
        {name}
      </StyledRouterLink>
      <Subtitle>in {buildVariant}</Subtitle>
      {requiredStatusToBadge[requiredStatus]}
    </RightContainer>
  </DependsOnWrapper>
);

const DependsOnWrapper = styled.div`
  display: flex;
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

const { gray, green, red, yellow } = palette;

const metStatusToIcon = {
  [MetStatus.Started]: <Refresh fill={yellow.dark2} />,
  [MetStatus.Met]: <Checkmark fill={green.dark1} />,
  [MetStatus.Unmet]: <X fill={red.base} />,
  [MetStatus.Pending]: <Calendar fill={gray.dark3} />,
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
