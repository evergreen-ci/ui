import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Body } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useProjectSettingsAnalytics } from "analytics";
import { projectSettingsRepoSettingsDocumentationUrl } from "constants/externalResources";
import {
  DefaultSectionToRepoMutation,
  DefaultSectionToRepoMutationVariables,
  ProjectSettingsSection,
} from "gql/generated/types";
import { DEFAULT_SECTION_TO_REPO } from "gql/mutations";

interface Props {
  handleClose: () => void;
  open: boolean;
  projectId: string;
  section: ProjectSettingsSection;
}

export const DefaultSectionToRepoModal = ({
  handleClose,
  open,
  projectId,
  section,
}: Props) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useProjectSettingsAnalytics();

  const [defaultSectionToRepo] = useMutation<
    DefaultSectionToRepoMutation,
    DefaultSectionToRepoMutationVariables
  >(DEFAULT_SECTION_TO_REPO, {
    onCompleted() {
      dispatchToast.success("Successfully defaulted page to repo");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error defaulting to repo: ${err.message}`,
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings"],
  });

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: handleClose,
      }}
      confirmButtonProps={{
        children: "Confirm",
        onClick: () => {
          defaultSectionToRepo({ variables: { projectId, section } });
          sendEvent({
            name: "Clicked default section to repo button",
            section,
          });
          handleClose();
        },
      }}
      data-cy="default-to-repo-modal"
      open={open}
      requiredInputText="confirm"
      title="Are you sure you want to default all settings in this section to the repo settings?"
      variant="danger"
    >
      <>
        <Body weight="medium">
          This operation is not reversible and will overwrite any existing
          project settings! Read more{" "}
          <StyledLink href={projectSettingsRepoSettingsDocumentationUrl}>
            here.
          </StyledLink>
        </Body>
        Settings will continue to be modifiable at the project level.
      </>
    </ConfirmationModal>
  );
};
