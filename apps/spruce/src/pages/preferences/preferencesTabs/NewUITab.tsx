import { SettingsCard } from "components/SettingsCard";
import { BetaFeatureSettings } from "./newUITab/BetaFeatures";
import { PreferenceToggles } from "./newUITab/PreferenceToggles";

export const NewUITab: React.FC = () => (
  <>
    <SettingsCard>
      <PreferenceToggles />
    </SettingsCard>
    <SettingsCard>
      <BetaFeatureSettings />
    </SettingsCard>
  </>
);
