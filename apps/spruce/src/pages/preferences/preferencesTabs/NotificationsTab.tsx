import { CardSkeleton } from "@leafygreen-ui/skeleton-loader";
import { SettingsCard } from "components/SettingsCard";
import { useUserSettings } from "hooks";
import { Settings } from "./notificationTab/Settings";
import { UserSubscriptions } from "./notificationTab/UserSubscriptions";

export const NotificationsTab: React.FC = () => {
  const { loading, userSettings } = useUserSettings();
  const { notifications, slackMemberId, slackUsername } = userSettings ?? {};

  if (loading || !userSettings) {
    return <CardSkeleton />;
  }

  return (
    <>
      <SettingsCard>
        <Settings
          notifications={notifications ?? {}}
          slackMemberId={slackMemberId ?? ""}
          slackUsername={slackUsername ?? ""}
        />
      </SettingsCard>
      <UserSubscriptions />
    </>
  );
};
