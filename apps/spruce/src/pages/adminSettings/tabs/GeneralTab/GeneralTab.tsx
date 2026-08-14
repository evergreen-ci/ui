import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { FormSkeleton } from "@leafygreen-ui/skeleton-loader";
import { AdminSettingsGeneralSection } from "constants/routes";
import {
  AdminSettingsQuery,
  AdminSettingsQueryVariables,
} from "gql/generated/types";
import { ADMIN_SETTINGS } from "gql/queries";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { useAdminSettingsContext } from "../../Context";
import { gqlToFormMap } from "../transformers";
import { FormStateMap, WritableAdminSettingsType } from "../types";
import { AnnouncementTab } from "./AnnouncementsTab/AnnouncementTab";
import { AuthenticationTab } from "./AuthenticationTab/AuthenticationTab";
import { BackgroundProcessingTab } from "./BackgroundProcessingTab/BackgroundProcessingTab";
import { ExternalCommunicationsTab } from "./ExternalCommunicationsTab/ExternalCommunicationTab";
import { OtherTab } from "./OtherTab/OtherTab";
import { ProvidersTab } from "./ProvidersTab/ProvidersTab";
import { RunnersTab } from "./RunnersTab/RunnersTab";
import { WebTab } from "./WebTab/WebTab";

export const GeneralTab: React.FC = () => {
  const { data, loading } = useQuery<
    AdminSettingsQuery,
    AdminSettingsQueryVariables
  >(ADMIN_SETTINGS);

  const adminSettings = data?.adminSettings;
  const tabData = useMemo(
    () => (adminSettings ? getTabData(adminSettings) : undefined),
    [adminSettings],
  );

  if (loading) {
    return <FormSkeleton data-testid="admin-settings-skeleton" />;
  }

  if (!tabData) {
    return null;
  }

  return <GeneralTabContent tabData={tabData} />;
};

const GeneralTabContent: React.FC<{ tabData: FormStateMap }> = ({
  tabData,
}) => {
  const { setInitialData } = useAdminSettingsContext();

  useEffect(() => {
    setInitialData(tabData);
  }, [setInitialData, tabData]);

  useScrollToAnchor();

  return (
    <>
      <AnnouncementTab
        announcementsData={tabData[AdminSettingsGeneralSection.Announcements]}
      />
      <RunnersTab runnersData={tabData[AdminSettingsGeneralSection.Runners]} />
      <WebTab webData={tabData[AdminSettingsGeneralSection.Web]} />
      <AuthenticationTab
        authenticationData={tabData[AdminSettingsGeneralSection.Authentication]}
      />
      <ExternalCommunicationsTab
        ExternalCommunicationsData={
          tabData[AdminSettingsGeneralSection.ExternalCommunications]
        }
      />
      <BackgroundProcessingTab
        backgroundProcessingData={
          tabData[AdminSettingsGeneralSection.BackgroundProcessing]
        }
      />
      <ProvidersTab
        providersData={tabData[AdminSettingsGeneralSection.Providers]}
      />
      <OtherTab otherData={tabData[AdminSettingsGeneralSection.Other]} />
    </>
  );
};

const getTabData = (
  data: NonNullable<AdminSettingsQuery["adminSettings"]>,
): FormStateMap =>
  Object.keys(gqlToFormMap).reduce((obj, tab) => {
    const gqlToFormFn = gqlToFormMap[tab as WritableAdminSettingsType];
    if (gqlToFormFn) {
      return {
        ...obj,
        [tab]: gqlToFormFn(data),
      };
    }
    return obj;
  }, {} as FormStateMap);
