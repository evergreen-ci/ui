import { useState } from "react";
import { Button } from "@leafygreen-ui/button";
import { useVersionAnalytics } from "analytics";
import { NotificationModalSource } from "types/subscription";
import { PatchNotificationModal } from "./addNotification/PatchNotificationModal";

interface Props {
  patchId: string;
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}

export const AddNotification: React.FC<Props> = ({ patchId }) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const { sendEvent } = useVersionAnalytics(patchId);

  return (
    <>
      <Button
        data-testid="notify-patch"
        onClick={() => {
          sendEvent({
            name: "Viewed notification modal",
            "notification.source": NotificationModalSource.NotifyMeButton,
          });
          setIsVisibleModal(true);
        }}
        size="small"
      >
        Notify me
      </Button>
      <PatchNotificationModal
        onCancel={() => setIsVisibleModal(false)}
        source={NotificationModalSource.NotifyMeButton}
        versionId={patchId}
        visible={isVisibleModal}
      />
    </>
  );
};
