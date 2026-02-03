import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { useToastContext } from "@evg-ui/lib/context";
import { useProjectSettingsAnalytics } from "analytics";
import {
  AttachProjectToRepoMutation,
  AttachProjectToRepoMutationVariables,
  DetachProjectFromRepoMutation,
  DetachProjectFromRepoMutationVariables,
} from "gql/generated/types";
import {
  ATTACH_PROJECT_TO_REPO,
  DETACH_PROJECT_FROM_REPO,
} from "gql/mutations";

type ModalProps = {
  handleClose: () => void;
  open: boolean;
  projectId: string;
  repoName: string;
  repoOwner: string;
  shouldAttach: boolean;
};

export const AttachDetachModal: React.FC<ModalProps> = ({
  handleClose,
  open,
  projectId,
  repoName,
  repoOwner,
  shouldAttach,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useProjectSettingsAnalytics();

  const [attachProjectToRepo] = useMutation<
    AttachProjectToRepoMutation,
    AttachProjectToRepoMutationVariables
  >(ATTACH_PROJECT_TO_REPO, {
    onCompleted() {
      dispatchToast.success("Successfully attached to repo");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error attaching the project: ${err.message}`,
      );
    },
    refetchQueries: [
      "ProjectSettings",
      "RepoSettings",
      "ViewableProjectRefs",
      "GithubProjectConflicts",
    ],
  });

  const [detachProjectFromRepo] = useMutation<
    DetachProjectFromRepoMutation,
    DetachProjectFromRepoMutationVariables
  >(DETACH_PROJECT_FROM_REPO, {
    onCompleted() {
      dispatchToast.success("Successfully detached from repo");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error detaching the project: ${err.message}`,
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings", "ViewableProjectRefs"],
  });

  const onConfirm = () => {
    if (shouldAttach) {
      attachProjectToRepo({ variables: { projectId } });
      sendEvent({
        name: "Clicked attach project to repo button",
        "repo.owner": repoOwner,
        "repo.name": repoName,
      });
    } else {
      detachProjectFromRepo({ variables: { projectId } });
      sendEvent({
        name: "Clicked detach project from repo button",
        "repo.owner": repoOwner,
        "repo.name": repoName,
      });
    }
    handleClose();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: handleClose,
      }}
      confirmButtonProps={{
        children: shouldAttach ? "Attach" : "Detach",
        onClick: onConfirm,
      }}
      data-cy="attach-repo-modal"
      open={open}
      title={`Are you sure you want to ${
        shouldAttach ? "attach to" : "detach from"
      } ${repoOwner}/${repoName}?`}
      variant="danger"
    >
      {shouldAttach ? (
        <>
          Attaching to repo means that for each project setting, users will have
          the option of using the value defined at the repo level instead of
          setting it individually for this branch.
        </>
      ) : (
        <>
          Detaching means that this branch will no longer use defaults defined
          at the repo level. For any settings that are currently using the
          default, the current state will be saved to this branch, but
          repo-level settings will not be considered in the future.
        </>
      )}
    </ConfirmationModal>
  );
};
