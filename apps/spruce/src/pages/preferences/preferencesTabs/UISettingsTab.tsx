import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useAdminBetaFeatures, useUserBetaFeatures } from "@evg-ui/lib/hooks";
import { SettingsCard } from "components/SettingsCard";
import { BetaFeatureSettings } from "./uiSettingsTab/BetaFeatures";
import { PreferenceToggles } from "./uiSettingsTab/PreferenceToggles";

export const UISettingsTab: React.FC = () => {
  const { userBetaSettings } = useUserBetaFeatures();
  const { adminBetaSettings } = useAdminBetaFeatures();

  return (
    <>
      <SettingsCard>
        <PreferenceToggles />
      </SettingsCard>
      <SettingsCard>
        {userBetaSettings && adminBetaSettings ? (
          <BetaFeatureSettings
            adminBetaSettings={adminBetaSettings}
            userBetaSettings={userBetaSettings}
          />
        ) : (
          <ParagraphSkeleton />
        )}
      </SettingsCard>
    </>
  );
};
