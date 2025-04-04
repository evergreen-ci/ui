import { Fragment } from "react";
import styled from "@emotion/styled";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { notificationFields } from "constants/subscription";
import { Notifications } from "gql/generated/types";

interface NotificationFieldProps {
  notifications: { [key: string]: string | null | undefined };
  notificationStatus: Notifications;
  setNotificationStatus: (notifications: { [key: string]: string }) => void;
}

export const NotificationField: React.FC<NotificationFieldProps> = ({
  notificationStatus,
  notifications,
  setNotificationStatus,
}) => (
  <GridContainer>
    <NotificationMethod>
      <span>Email</span>
      <span>Slack</span>
      <span>None</span>
    </NotificationMethod>
    {Object.keys(notifications).map((notification, index) => (
      <Fragment key={notification}>
        <NotificationEvent row={index}>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          {notificationFields[notification]}
        </NotificationEvent>
        <StyledRadioGroup
          onChange={(e) => {
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            setNotificationStatus({
              ...notificationStatus,
              [notification]: e.target.value,
            });
          }}
          row={index}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          value={notificationStatus[notification]}
        >
          <Radio value="email" />
          <Radio value="slack" />
          <Radio value="" />
        </StyledRadioGroup>
      </Fragment>
    ))}
  </GridContainer>
);

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(6, 1fr);
  margin-bottom: ${size.s};
  width: 350px;
`;

const NotificationMethod = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${size.xs};
  gap: ${size.l};
  grid-column: 2;
  grid-row: 1;
`;

const NotificationEvent = styled.span<{ row: number }>`
  font-size: ${fontSize.m};
  margin-bottom: ${size.s};
  grid-column: 1;
  grid-row: ${({ row }) => row + 2};
`;

const StyledRadioGroup = styled(RadioGroup)<{ row: number }>`
  display: flex;
  flex-direction: row;
  gap: ${size.l};
  grid-column: 2;
  grid-row: ${({ row }) => row + 2};
`;
