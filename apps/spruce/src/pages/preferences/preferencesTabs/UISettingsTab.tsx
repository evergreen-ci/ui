import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { SettingsCard } from "components/SettingsCard";
import { useAdminBetaFeatures, useUserBetaFeatures } from "hooks";
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
