import React from "react";
import { AdminSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./formSchema";
import { TabProps } from "./types";

export const FeatureFlagsTab: React.FC<TabProps> = ({ featureFlagsData }) => {
  const initialFormState = featureFlagsData;
  const formSchema = getFormSchema();
  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={AdminSettingsTabRoutes.FeatureFlags}
    />
  );
};
