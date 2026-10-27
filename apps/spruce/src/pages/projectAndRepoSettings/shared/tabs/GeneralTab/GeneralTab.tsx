import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { SOURCE_CACHE_ALL_PROJECTS_FLAG } from "constants/serviceFlags";
import {
  ServiceFlagsListQuery,
  ServiceFlagsListQueryVariables,
} from "gql/generated/types";
import { SERVICE_FLAGS_LIST } from "gql/queries";
import { useProjectSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { GeneralFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<TabProps> = ({
  projectData,
  projectId,
  projectType,
  repoData,
}) => {
  const { getTab } = useProjectSettingsContext();
  const tabData = getTab(tab);
  const { formData } = tabData;
  const { initialData } = tabData;

  const initialFormState = projectData || repoData;

  const {
    projectRef: {
      identifier: initialIdentifier,
      owner: initialOwner,
      repo: initialRepo,
    },
  } = initialData ?? { projectRef: {} };

  const identifierHasChanges = useMemo(
    () =>
      initialIdentifier !== formData?.generalConfiguration?.other?.identifier,
    [initialIdentifier, formData?.generalConfiguration?.other?.identifier],
  );

  const { data: flagsData } = useQuery<
    ServiceFlagsListQuery,
    ServiceFlagsListQueryVariables
  >(SERVICE_FLAGS_LIST);
  const sourceCacheAllProjectsEnabled =
    flagsData?.adminSettings?.serviceFlagsList?.some(
      ({ enabled, name }) => name === SOURCE_CACHE_ALL_PROJECTS_FLAG && enabled,
    ) ?? false;

  const formSchema = useMemo(
    () =>
      getFormSchema(
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        projectId,
        projectType,
        identifierHasChanges,
        initialOwner,
        initialRepo,
        projectType === ProjectType.AttachedProject ? repoData : null,
        sourceCacheAllProjectsEnabled,
      ),
    [
      identifierHasChanges,
      initialOwner,
      initialRepo,
      projectId,
      projectType,
      repoData,
      sourceCacheAllProjectsEnabled,
    ],
  );

  if (!initialFormState) return null;

  return (
    <BaseTab
      customValidate={validate(projectType)}
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};

const validate = (projectType: ProjectType) =>
  ((formData, errors) => {
    if (projectType === ProjectType.Repo) {
      return errors;
    }

    const {
      generalConfiguration: { branch, enabled },
    } = formData;

    // Ensure that both attached and unattached projects have a branch specified if they are enabled.
    if (enabled && !branch) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      errors.generalConfiguration.branch.addError(
        "A branch is required for enabled projects.",
      );
    }

    return errors;
  }) satisfies ValidateProps<GeneralFormState>;
