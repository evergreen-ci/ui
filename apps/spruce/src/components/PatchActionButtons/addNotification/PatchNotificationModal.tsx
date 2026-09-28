import { useVersionAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
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
      sendEvent={sendEvent}
      source={source}
      subscriptionMethods={versionSubscriptionMethods}
      triggers={versionTriggers}
      type="version"
      visible={visible}
    />
  );
};
