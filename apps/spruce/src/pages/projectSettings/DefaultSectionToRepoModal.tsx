import { useMutation } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
import { useProjectSettingsAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { StyledLink } from "components/styles";
import { projectSettingsRepoSettingsDocumentationUrl } from "constants/externalResources";
import { useToastContext } from "context/toast";
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
    variables: { projectId, section },
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
      buttonText="Confirm"
      data-cy="default-to-repo-modal"
      onCancel={handleClose}
      onConfirm={() => {
        defaultSectionToRepo();
        sendEvent({
          name: "Default section to repo",
          section,
        });
        handleClose();
      }}
      open={open}
      variant="danger"
      requiredInputText="confirm"
      title="Are you sure you want to default all settings in this section to the repo settings?"
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
