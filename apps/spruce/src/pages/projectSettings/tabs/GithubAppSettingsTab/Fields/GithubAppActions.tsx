import { useState } from "react";
import { useMutation } from "@apollo/client";
import Banner from "@leafygreen-ui/banner";
import Button from "@leafygreen-ui/button";
import { Field } from "@rjsf/core";
import { ConfirmationModal } from "components/ConfirmationModal";
import { StyledLink } from "components/styles";
import { githubAppCredentialsDocumentationUrl } from "constants/externalResources";
import { useToastContext } from "context/toast";
import {
  DeleteGithubAppCredentialsMutation,
  DeleteGithubAppCredentialsMutationVariables,
} from "gql/generated/types";
import { DELETE_GITHUB_APP_CREDENTIALS } from "gql/mutations";

const DeleteAppCredentialsButton: React.FC<{
  ["data-cy"]: string;
  projectId: string;
}> = ({ "data-cy": dataCy, projectId }) => {
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
        `There was an error deleting GitHub app credentials: ${err.message}`,
      );
    },
    refetchQueries: ["ProjectSettings"],
  });

  return (
    <>
      <ConfirmationModal
        buttonText="Delete"
        data-cy="delete-github-credentials-modal"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          deleteGithubAppCredentials({ variables: { projectId } });
          setOpen(false);
        }}
        open={open}
        submitDisabled={loading}
        title="Delete GitHub app credentials?"
        variant="danger"
      >
        <p>
          Confirm that you want to remove the GitHub app credentials associated
          with this project.
        </p>
      </ConfirmationModal>
      <Button data-cy={dataCy} onClick={() => setOpen(true)}>
        Delete key
      </Button>
    </>
  );
};

const GithubAppActions: Field = ({ uiSchema }) => {
  const {
    options: { isAppDefined, projectId },
  } = uiSchema;

  return isAppDefined ? (
    <DeleteAppCredentialsButton
      data-cy="delete-app-credentials-button"
      projectId={projectId}
    />
  ) : (
    <Banner data-cy="github-app-credentials-banner" variant="warning">
      App ID and Key must be saved in order for token permissions restrictions
      to take effect. <br />
      <StyledLink href={githubAppCredentialsDocumentationUrl}>
        GitHub App Documentation
      </StyledLink>
    </Banner>
  );
};

export default GithubAppActions;
