import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { useNavigate, useParams } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useProjectSettingsAnalytics } from "analytics";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
  slugs,
} from "constants/routes";
import {
  ProjectSettingsSection,
  SaveProjectSettingsForSectionMutation,
  SaveProjectSettingsForSectionMutationVariables,
  SaveRepoSettingsForSectionMutation,
  SaveRepoSettingsForSectionMutationVariables,
} from "gql/generated/types";
import {
  SAVE_PROJECT_SETTINGS_FOR_SECTION,
  SAVE_REPO_SETTINGS_FOR_SECTION,
} from "gql/mutations";
import { useHasProjectOrRepoEditPermission } from "hooks";
import { useProjectSettingsContext } from "./Context";
import { DefaultSectionToRepoModal } from "./DefaultSectionToRepoModal";
import { GeneralFormState } from "./tabs/GeneralTab/types";
import { AppSettingsFormState } from "./tabs/GithubAppSettingsTab/types";
import { formToGqlMap } from "./tabs/transformers";
import { FormToGqlFunction, WritableProjectSettingsType } from "./tabs/types";
import { ProjectType } from "./tabs/utils";

const defaultToRepoDisabled: Set<WritableProjectSettingsType> = new Set([
  ProjectSettingsTabRoutes.Notifications,
  ProjectSettingsTabRoutes.Plugins,
  ProjectSettingsTabRoutes.ViewsAndFilters,
  ProjectSettingsTabRoutes.GithubPermissionGroups,
]);

interface Props {
  id: string;
  projectType: ProjectType;
  tab: WritableProjectSettingsType;
}

export const HeaderButtons: React.FC<Props> = ({ id, projectType, tab }) => {
  const { sendEvent } = useProjectSettingsAnalytics();
  const dispatchToast = useToastContext();

  const isRepo = projectType === ProjectType.Repo;
  const { getTab, saveTab } = useProjectSettingsContext();
  const { formData, hasChanges, hasError, initialData } = getTab(tab);
  const navigate = useNavigate();
  const { [slugs.projectIdentifier]: identifier } = useParams();

  const [defaultModalOpen, setDefaultModalOpen] = useState(false);
  const [debugSpawnHostsModalOpen, setDebugSpawnHostsModalOpen] =
    useState(false);

  const { canEdit } = useHasProjectOrRepoEditPermission(id);

  const [saveProjectSection] = useMutation<
    SaveProjectSettingsForSectionMutation,
    SaveProjectSettingsForSectionMutationVariables
  >(SAVE_PROJECT_SETTINGS_FOR_SECTION, {
    onCompleted: (data) => {
      const newIdentifier =
        data?.saveProjectSettingsForSection?.projectRef?.identifier;
      saveTab(tab);
      dispatchToast.success("Successfully updated project");

      if (newIdentifier && identifier !== newIdentifier) {
        setTimeout(() => {
          navigate(getProjectSettingsRoute(newIdentifier, tab), {
            replace: true,
          });
        }, 500);
      }
    },
    onError: (err) => {
      dispatchToast.error(
        `There was an error saving the project: ${err.message}`,
      );
    },
    refetchQueries: (result) => {
      const newIdentifier =
        result.data?.saveProjectSettingsForSection?.projectRef?.identifier;
      return identifier === newIdentifier
        ? ["ProjectSettings", "ViewableProjectRefs", "ProjectBanner"]
        : [];
    },
  });

  const [saveRepoSection] = useMutation<
    SaveRepoSettingsForSectionMutation,
    SaveRepoSettingsForSectionMutationVariables
  >(SAVE_REPO_SETTINGS_FOR_SECTION, {
    onCompleted() {
      saveTab(tab);
      dispatchToast.success("Successfully updated repo");
    },
    onError(err) {
      dispatchToast.error(`There was an error saving the repo: ${err.message}`);
    },
    refetchQueries: ["RepoSettings", "ViewableProjectRefs"],
  });

  const save = () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const formToGql: FormToGqlFunction<typeof tab> = formToGqlMap[tab];
    const newData = formToGql(formData, isRepo, id);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const saveMutation = (update, section) =>
      isRepo
        ? saveRepoSection({
            variables: {
              section,
              repoSettings: update,
            },
          })
        : saveProjectSection({
            variables: {
              section,
              projectSettings: update,
            },
          });

    const section = mapRouteToSection[tab];
    saveMutation(newData, section);
    sendEvent({
      section,
      name: isRepo ? "Saved repo settings" : "Saved project settings",
    });
  };

  const isDisablingDebugSpawnHosts = () => {
    if (tab !== ProjectSettingsTabRoutes.General) {
      return false;
    }
    const generalFormData = formData as GeneralFormState;
    const wasDisabled =
      initialData?.projectRef?.debugSpawnHostsDisabled === true;
    const willBeDisabled =
      generalFormData.projectFlags.debug.debugSpawnHostsDisabled === true;
    return !wasDisabled && willBeDisabled;
  };

  const onClick = () => {
    if (isDisablingDebugSpawnHosts()) {
      setDebugSpawnHostsModalOpen(true);
    } else {
      save();
    }
  };

  // Prevent users from defaulting to repo if their project has a Github App
  // but the repo does not, which would result in losing credentials entirely.
  // If the repo has credentials, defaulting to repo is safe.
  let disableDefaultToRepo = false;
  if (tab === ProjectSettingsTabRoutes.GithubAppSettings) {
    const appFormData = formData as AppSettingsFormState;
    const projectAppId = appFormData?.appCredentials?.githubAppAuth?.appId ?? 0;
    const repoAppId =
      appFormData?.repoData?.appCredentials?.githubAppAuth?.appId ?? 0;
    disableDefaultToRepo = projectAppId > 0 && !(repoAppId > 0);
  }

  const canDefaultToRepo =
    !defaultToRepoDisabled.has(tab) && !disableDefaultToRepo;

  return (
    <ButtonRow>
      <Button
        data-cy="save-settings-button"
        disabled={hasError || !hasChanges}
        onClick={onClick}
        variant="primary"
      >
        Save changes on page
      </Button>
      {projectType === ProjectType.AttachedProject && canDefaultToRepo && (
        <>
          <Button
            data-cy="default-to-repo-button"
            disabled={!canEdit}
            onClick={() => setDefaultModalOpen(true)}
            title="Clicking this button will open a confirmation modal with more information."
          >
            Default to repo on page
          </Button>
          <DefaultSectionToRepoModal
            handleClose={() => setDefaultModalOpen(false)}
            open={defaultModalOpen}
            projectId={id}
            section={mapRouteToSection[tab]}
          />
        </>
      )}
      <ConfirmationModal
        cancelButtonProps={{
          onClick: () => setDebugSpawnHostsModalOpen(false),
        }}
        confirmButtonProps={{
          children: "Yes, save",
          onClick: () => {
            setDebugSpawnHostsModalOpen(false);
            save();
          },
        }}
        data-cy="disable-debug-spawn-hosts-modal"
        open={debugSpawnHostsModalOpen}
        title="Disable Debug Spawn Hosts?"
        variant="danger"
      >
        Are you sure you want to disable debug spawn hosts? Any existing debug
        spawn hosts will be terminated.
      </ConfirmationModal>
    </ButtonRow>
  );
};

const mapRouteToSection: Record<
  WritableProjectSettingsType,
  ProjectSettingsSection
> = {
  [ProjectSettingsTabRoutes.General]: ProjectSettingsSection.General,
  [ProjectSettingsTabRoutes.Access]: ProjectSettingsSection.Access,
  [ProjectSettingsTabRoutes.Variables]: ProjectSettingsSection.Variables,
  [ProjectSettingsTabRoutes.GithubCommitQueue]:
    ProjectSettingsSection.GithubAndCommitQueue,
  [ProjectSettingsTabRoutes.Notifications]:
    ProjectSettingsSection.Notifications,
  [ProjectSettingsTabRoutes.PatchAliases]: ProjectSettingsSection.PatchAliases,
  [ProjectSettingsTabRoutes.VirtualWorkstation]:
    ProjectSettingsSection.Workstation,
  [ProjectSettingsTabRoutes.ProjectTriggers]: ProjectSettingsSection.Triggers,
  [ProjectSettingsTabRoutes.PeriodicBuilds]:
    ProjectSettingsSection.PeriodicBuilds,
  [ProjectSettingsTabRoutes.Plugins]: ProjectSettingsSection.Plugins,
  [ProjectSettingsTabRoutes.ViewsAndFilters]:
    ProjectSettingsSection.ViewsAndFilters,
  [ProjectSettingsTabRoutes.GithubAppSettings]:
    ProjectSettingsSection.GithubAppSettings,
  [ProjectSettingsTabRoutes.GithubPermissionGroups]:
    ProjectSettingsSection.GithubPermissions,
  [ProjectSettingsTabRoutes.TestSelection]:
    ProjectSettingsSection.TestSelection,
};

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  min-width: fit-content;
`;
