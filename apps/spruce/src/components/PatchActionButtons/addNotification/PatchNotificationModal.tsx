import { useVersionAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { getCreatedNotificationEvent } from "components/Notifications/utils";
import { versionTriggers } from "constants/triggers";
import {
  NotificationModalSource,
  subscriptionMethods as versionSubscriptionMethods,
} from "types/subscription";

interface ModalProps {
  onCancel: () => void;
  source: NotificationModalSource;
  versionId: string;
  visible: boolean;
}

export const PatchNotificationModal: React.FC<ModalProps> = ({
  onCancel,
  source,
  versionId,
  visible,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);

  return (
    <NotificationModal
      data-testid="patch-notification-modal"
      onCancel={onCancel}
      resourceId={versionId}
      sendAnalyticsEvent={(subscription, details) =>
        sendEvent(getCreatedNotificationEvent(source, subscription, details))
      }
      subscriptionMethods={versionSubscriptionMethods}
      triggers={versionTriggers}
      type="version"
      visible={visible}
    />
  );
};
