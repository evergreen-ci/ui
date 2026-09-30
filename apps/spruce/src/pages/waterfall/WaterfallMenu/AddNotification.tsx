import { useWaterfallAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { waterfallTriggers } from "constants/triggers";
import { subscriptionMethods } from "types/subscription";

interface AddNotificationProps {
  open: boolean;
  projectIdentifier: string;
  setMenuOpen: (open: boolean) => void;
  setOpen: (open: boolean) => void;
}

export const AddNotification: React.FC<AddNotificationProps> = ({
  open,
  projectIdentifier,
  setMenuOpen,
  setOpen,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  return (
    <NotificationModal
      data-testid="waterfall-notification-modal"
      onCancel={() => {
        setOpen(false);
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
      visible={open}
    />
  );
};
