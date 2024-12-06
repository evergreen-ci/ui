import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { SettingsCard } from "components/SettingsCard";
import { useAdminBetaFeatures, useUserBetaFeatures } from "hooks";
import { BetaFeatureSettings } from "./newUITab/BetaFeatures";
import { PreferenceToggles } from "./newUITab/PreferenceToggles";

export const NewUITab: React.FC = () => {
  const { betaFeatures: userBetaFeatures } = useUserBetaFeatures();
  const { betaFeatures: adminBetaFeatures } = useAdminBetaFeatures();

  return (
    <>
      <SettingsCard>
        <PreferenceToggles />
      </SettingsCard>
      <SettingsCard>
        {userBetaFeatures && adminBetaFeatures ? (
          <BetaFeatureSettings
            adminBetaFeatures={adminBetaFeatures}
            userBetaFeatures={userBetaFeatures}
          />
        ) : (
          <ParagraphSkeleton />
        )}
      </SettingsCard>
    </>
  );
};
