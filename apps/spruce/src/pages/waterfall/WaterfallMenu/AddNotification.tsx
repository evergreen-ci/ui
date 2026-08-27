import { useState } from "react";
import Bell from "@via-ds/icons/Bell";
import { useWaterfallAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { NotificationModal } from "components/Notifications";
import { waterfallTriggers } from "constants/triggers";
import { subscriptionMethods } from "types/subscription";

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
        sendAnalyticsEvent={(subscription) =>
          sendEvent({
            name: "Created notification",
            "subscription.type": subscription.subscriber.type || "",
            "subscription.trigger": subscription.trigger || "",
          })
        }
        subscriptionMethods={subscriptionMethods}
        triggers={waterfallTriggers}
        type="project"
        visible={isModalVisible}
      />
    </>
  );
};
