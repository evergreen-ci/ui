import React from "react";
import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { TitleContainer } from "../SharedStyles";
import { getFormSchema } from "./formSchema";
import { TabProps } from "./types";

export const FeatureFlagsTab: React.FC<TabProps> = ({ featureFlagsData }) => {
  const initialFormState = featureFlagsData;
  const formSchema = getFormSchema();
  console.log("FeatureFlagsTab initialFormState", initialFormState);
  return (
    <>
      <TitleContainer>
        <H2>Feature Flags</H2>
      </TitleContainer>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsTabRoutes.FeatureFlags}
      />
    </>
  );
};
