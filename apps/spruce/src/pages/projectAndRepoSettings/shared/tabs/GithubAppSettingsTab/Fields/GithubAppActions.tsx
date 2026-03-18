import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { css } from "@emotion/react";
import { Banner, Variant as BannerVariant } from "@leafygreen-ui/banner";
import { Button } from "@leafygreen-ui/button";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { NumberInput } from "@leafygreen-ui/number-input";
import TextArea from "@leafygreen-ui/text-area";
import { Field } from "@rjsf/core";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { githubAppCredentialsDocumentationUrl } from "constants/externalResources";
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

const ReplaceAppCredentialsButton: React.FC<{
  projectId: string;
  disabled: boolean;
  isRepo: boolean;
}> = ({ disabled, isRepo, projectId }) => {
  const [open, setOpen] = useState(false);
  const [appId, setAppId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
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
  const isValid = Number(appId) > 0 && privateKey.length > 0;

  const handleClose = () => {
    setOpen(false);
    setAppId("");
    setPrivateKey("");
  };

  const handleReplace = () => {
    const githubAppAuth = {
      appId: Number(appId),
      privateKey,
    };
    if (isRepo) {
      saveRepoSettings({
        variables: {
          repoSettings: {
            repoId: projectId,
            githubAppAuth,
            projectRef: { id: projectId },
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
            projectRef: { id: projectId },
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
          disabled: loading || !isValid,
          onClick: handleReplace,
        }}
        data-cy="replace-github-credentials-modal"
        open={open}
        title="Replace GitHub app credentials"
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: ${size.s};
          `}
        >
          <p>Enter new GitHub app credentials to replace the existing ones.</p>
          <NumberInput
            data-cy="replace-app-id-input"
            label="New App ID"
            onChange={(e) => setAppId(e.target.value)}
            placeholder="Enter app ID"
            value={appId}
          />
          <TextArea
            data-cy="replace-private-key-input"
            label="New Private Key"
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Enter private key"
            value={privateKey}
          />
        </div>
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
    options: { defaultsToRepo, isAppDefined, isRepo, projectId },
  } = uiSchema;

  // You should not be able to modify the repo GitHub app from a project.
  if (defaultsToRepo) {
    return null;
  }

  return isAppDefined ? (
    <ReplaceAppCredentialsButton
      disabled={disabled}
      isRepo={isRepo}
      projectId={projectId}
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
