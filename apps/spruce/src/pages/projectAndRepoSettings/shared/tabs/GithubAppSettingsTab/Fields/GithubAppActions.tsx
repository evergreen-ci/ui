import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Banner, Variant as BannerVariant } from "@leafygreen-ui/banner";
import { Button } from "@leafygreen-ui/button";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Field } from "@rjsf/core";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { SpruceForm } from "components/SpruceForm";
import { SpruceFormProps } from "components/SpruceForm/types";
import { githubAppCredentialsDocumentationUrl } from "constants/externalResources";
import { ProjectSettingsTabRoutes } from "constants/routes";
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
import { useProjectSettingsContext } from "pages/projectAndRepoSettings/shared/Context";
import { formToGql } from "../transformers";
import { AppSettingsFormState } from "../types";

interface ReplaceFormState {
  appId?: number | null;
  privateKey?: string;
}

const replaceFormSchema: SpruceFormProps = {
  schema: {
    type: "object" as const,
    description:
      "Enter new GitHub app credentials to replace the existing ones.",
    properties: {
      appId: {
        type: "number" as const,
        title: "New App ID",
        minimum: 1,
      },
      privateKey: {
        type: "string" as const,
        title: "New Private Key",
        minLength: 1,
      },
    },
    required: ["appId", "privateKey"],
  },
  uiSchema: {
    appId: {
      "ui:data-cy": "replace-app-id-input",
    },
    privateKey: {
      "ui:data-cy": "replace-private-key-input",
      "ui:widget": "textarea",
    },
  },
};

const ReplaceAppCredentialsButton: React.FC<{
  projectId: string;
  disabled: boolean;
  isRepo: boolean;
  githubPermissionGroupByRequester: Record<string, string>;
}> = ({ disabled, githubPermissionGroupByRequester, isRepo, projectId }) => {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<ReplaceFormState>({});
  const [hasFormError, setHasFormError] = useState(true);
  const dispatchToast = useToastContext();

  const refetchQueries = isRepo ? ["RepoSettings"] : ["ProjectSettings"];

  const [saveProjectSettings, { loading: projectLoading }] = useMutation<
    SaveProjectSettingsForSectionMutation,
    SaveProjectSettingsForSectionMutationVariables
  >(SAVE_PROJECT_SETTINGS_FOR_SECTION, {
    onCompleted: () => {
      dispatchToast.success(
        "GitHub app credentials were successfully replaced.",
      );
      handleClose();
    },
    onError: (err) => {
      dispatchToast.error(
        `There was an error replacing the GitHub app credentials: ${err.message}`,
      );
    },
    refetchQueries,
  });

  const [saveRepoSettings, { loading: repoLoading }] = useMutation<
    SaveRepoSettingsForSectionMutation,
    SaveRepoSettingsForSectionMutationVariables
  >(SAVE_REPO_SETTINGS_FOR_SECTION, {
    onCompleted: () => {
      dispatchToast.success(
        "GitHub app credentials were successfully replaced.",
      );
      handleClose();
    },
    onError: (err) => {
      dispatchToast.error(
        `There was an error replacing the GitHub app credentials: ${err.message}`,
      );
    },
    refetchQueries,
  });

  const loading = projectLoading || repoLoading;

  const handleClose = () => {
    setOpen(false);
    setFormState({});
    setHasFormError(true);
  };

  const handleReplace = () => {
    const githubAppAuth = {
      appId: formState.appId ?? 0,
      privateKey: formState.privateKey ?? "",
    };
    const projectRef = {
      id: projectId,
      githubPermissionGroupByRequester,
    };
    if (isRepo) {
      saveRepoSettings({
        variables: {
          repoSettings: {
            repoId: projectId,
            githubAppAuth,
            projectRef,
          },
          section: ProjectSettingsSection.GithubAppSettings,
        },
      });
    } else {
      saveProjectSettings({
        variables: {
          projectSettings: {
            projectId,
            githubAppAuth,
            projectRef,
          },
          section: ProjectSettingsSection.GithubAppSettings,
        },
      });
    }
  };

  return (
    <>
      <ConfirmationModal
        cancelButtonProps={{
          onClick: handleClose,
        }}
        confirmButtonProps={{
          children: "Replace",
          disabled: loading || hasFormError,
          onClick: handleReplace,
        }}
        data-cy="replace-github-credentials-modal"
        open={open}
        title="Replace GitHub app credentials"
      >
        <SpruceForm
          formData={formState}
          onChange={({ errors, formData }) => {
            setHasFormError(!!errors.length);
            setFormState(formData);
          }}
          schema={replaceFormSchema.schema}
          uiSchema={replaceFormSchema.uiSchema}
        />
      </ConfirmationModal>
      <Button
        data-cy="replace-app-credentials-button"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        Replace key
      </Button>
    </>
  );
};

const GithubAppActions: Field = ({ disabled, uiSchema }) => {
  const {
    options: { defaultsToRepo, isAppDefined, isRepo, projectOrRepoId },
  } = uiSchema;

  const { getTab } = useProjectSettingsContext();
  const { formData } = getTab(ProjectSettingsTabRoutes.GithubAppSettings);
  const appFormData = formData as AppSettingsFormState;

  const githubPermissionGroupByRequester = appFormData
    ? formToGql(appFormData, isRepo, projectOrRepoId).projectRef
        .githubPermissionGroupByRequester
    : {};

  // You should not be able to modify the repo GitHub app from a project.
  if (defaultsToRepo) {
    return null;
  }

  return isAppDefined ? (
    <ReplaceAppCredentialsButton
      disabled={disabled}
      githubPermissionGroupByRequester={githubPermissionGroupByRequester}
      isRepo={isRepo}
      projectId={projectOrRepoId}
    />
  ) : (
    <Banner
      data-cy="github-app-credentials-banner"
      variant={BannerVariant.Warning}
    >
      App ID and key must be saved in order for token permissions restrictions
      to take effect. <br />
      For more information, see the{" "}
      <StyledLink href={githubAppCredentialsDocumentationUrl}>
        GitHub App Documentation
      </StyledLink>
      .
    </Banner>
  );
};

export default GithubAppActions;
