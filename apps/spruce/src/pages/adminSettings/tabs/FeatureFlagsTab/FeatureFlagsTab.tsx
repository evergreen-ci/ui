import React from "react";
import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { AdminSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./formSchema";
import { TabProps } from "./types";

const PageTitle = styled.h2`
  margin-bottom: ${size.s};
  font-size: 24px;
  font-weight: bold;
`;

export const FeatureFlagsTab: React.FC<TabProps> = ({ featureFlagsData }) => {
  const initialFormState = featureFlagsData;
  const formSchema = getFormSchema();
  return (
    <>
      <TitleContainer>
        <PageTitle>Feature Flags</PageTitle>
      </TitleContainer>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsTabRoutes.FeatureFlags}
      />
    </>
  );
};

const TitleContainer = styled.div`
  margin-bottom: ${size.m};
`;
