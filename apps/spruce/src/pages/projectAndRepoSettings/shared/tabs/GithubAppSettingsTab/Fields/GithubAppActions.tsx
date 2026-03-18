import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { css } from "@emotion/react";
import { Banner, Variant as BannerVariant } from "@leafygreen-ui/banner";
import { Button, Variant as ButtonVariant } from "@leafygreen-ui/button";
import {
  ConfirmationModal,
  Variant as ModalVariant,
} from "@leafygreen-ui/confirmation-modal";
import { Field } from "@rjsf/core";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { githubAppCredentialsDocumentationUrl } from "constants/externalResources";
import {
  DeleteGithubAppCredentialsMutation,
  DeleteGithubAppCredentialsMutationVariables,
} from "gql/generated/types";
import { DELETE_GITHUB_APP_CREDENTIALS } from "gql/mutations";

const DeleteAppCredentialsButton: React.FC<{
  ["data-cy"]: string;
  projectId: string;
  disabled: boolean;
  hasRepoApp: boolean;
}> = ({ "data-cy": dataCy, disabled, hasRepoApp, projectId }) => {
  const [open, setOpen] = useState(false);
  const dispatchToast = useToastContext();

  const [deleteGithubAppCredentials, { loading }] = useMutation<
    DeleteGithubAppCredentialsMutation,
    DeleteGithubAppCredentialsMutationVariables
  >(DELETE_GITHUB_APP_CREDENTIALS, {
    onCompleted: () => {
      dispatchToast.success(
        "GitHub app credentials were successfully deleted.",
      );
    },
    onError: (err) => {
      dispatchToast.error(
        `There was an error deleting the GitHub app credentials: ${err.message}`,
      );
    },
    refetchQueries: ["ProjectSettings"],
  });

  return (
    <>
      <ConfirmationModal
        cancelButtonProps={{
          onClick: () => setOpen(false),
        }}
        confirmButtonProps={{
          children: "Delete",
          disabled: loading,
          onClick: () => {
            deleteGithubAppCredentials({ variables: { projectId } });
            setOpen(false);
          },
        }}
        data-cy="delete-github-credentials-modal"
        open={open}
        title="Delete GitHub app credentials?"
        variant={ModalVariant.Danger}
      >
        <p>
          Confirm that you want to remove the GitHub app credentials associated
          with this project.
        </p>
        {!hasRepoApp && (
          <Banner
            data-cy="delete-credentials-warning-banner"
            variant={BannerVariant.Warning}
          >
            Deleting your project&apos;s GitHub app credentials will cause this
            project to use the shared GitHub app, which has lower rate limits.
            To avoid reduced rate limits, add a new GitHub app after deleting.
          </Banner>
        )}
      </ConfirmationModal>
      <Button
        data-cy={dataCy}
        disabled={disabled}
        onClick={() => setOpen(true)}
        variant={ButtonVariant.Danger}
      >
        Delete key
      </Button>
    </>
  );
};

const GithubAppActions: Field = ({ disabled, uiSchema }) => {
  const {
    options: { defaultsToRepo, hasRepoApp, isAppDefined, projectId },
  } = uiSchema;

  // You should not be able to delete the repo GitHub app from a project.
  if (defaultsToRepo) {
    return null;
  }

  return isAppDefined ? (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: ${size.xs};
      `}
    >
      {!hasRepoApp && (
        <Banner
          data-cy="github-app-rate-limit-banner"
          variant={BannerVariant.Warning}
        >
          Removing your project&apos;s GitHub app credentials without adding a
          replacement will cause this project to fall back to the shared GitHub
          app, which has lower rate limits.
        </Banner>
      )}
      <DeleteAppCredentialsButton
        data-cy="delete-app-credentials-button"
        disabled={disabled}
        hasRepoApp={hasRepoApp}
        projectId={projectId}
      />
    </div>
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
