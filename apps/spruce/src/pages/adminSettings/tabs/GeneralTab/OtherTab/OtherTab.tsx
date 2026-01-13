import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import {
  ViewableProjectRefsQuery,
  ViewableProjectRefsQueryVariables,
} from "gql/generated/types";
import { VIEWABLE_PROJECTS } from "gql/queries";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const OtherTab: React.FC<TabProps> = ({ otherData }) => {
  const initialFormState = otherData;

  const { data: viewableProjectsData } = useQuery<
    ViewableProjectRefsQuery,
    ViewableProjectRefsQueryVariables
  >(VIEWABLE_PROJECTS);

  const formSchema = useMemo(() => {
    const projects =
      viewableProjectsData?.viewableProjectRefs
        ?.flatMap((group) => group.projects)
        ?.map((p) => ({
          id: p.id,
          displayName: p.displayName,
        })) ?? [];
    const repos =
      viewableProjectsData?.viewableProjectRefs
        ?.filter((group) => group.repo != null)
        .map((group) => ({
          id: group.repo!.id,
          displayName: group.groupDisplayName || group.repo!.id,
        })) ?? [];
    return getFormSchema({
      projectRefs: projects,
      repoRefs: repos,
    });
  }, [viewableProjectsData]);
  return (
    <>
      <H2>Other</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.Other}
      />
    </>
  );
};
