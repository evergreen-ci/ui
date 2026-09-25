import { useState } from "react";
import Bell from "@via-ds/icons/Bell";
import { useWaterfallAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { NotificationModal } from "components/Notifications";
import { getCreatedNotificationEvent } from "components/Notifications/utils";
import { waterfallTriggers } from "constants/triggers";
import {
  NotificationModalSource,
  subscriptionMethods,
} from "types/subscription";

interface AddNotificationProps {
  projectIdentifier: string;
  setMenuOpen: (open: boolean) => void;
}

export const AddNotification: React.FC<AddNotificationProps> = ({
  projectIdentifier,
  setMenuOpen,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { sendEvent } = useWaterfallAnalytics();
  return (
    <>
      <DropdownItem
        data-testid="add-notification"
        glyph={<Bell />}
        onClick={() => {
          sendEvent({
            name: "Viewed notification modal",
            "notification.source": NotificationModalSource.WaterfallMenu,
          });
          setIsModalVisible(true);
        }}
      >
        Add notification
      </DropdownItem>
      <NotificationModal
        data-testid="waterfall-notification-modal"
        onCancel={() => {
          setIsModalVisible(false);
          setMenuOpen(false);
        }}
        resourceId={projectIdentifier}
        sendAnalyticsEvent={(subscription, details) =>
          sendEvent(
            getCreatedNotificationEvent(
              NotificationModalSource.WaterfallMenu,
              subscription,
              details,
            ),
          )
        }
        subscriptionMethods={subscriptionMethods}
        triggers={waterfallTriggers}
        type="project"
        visible={isModalVisible}
      />
    </>
  );
};
