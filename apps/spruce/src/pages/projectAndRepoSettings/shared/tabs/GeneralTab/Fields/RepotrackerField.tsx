import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@leafygreen-ui/button";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Field } from "@rjsf/core";
import { useToastContext } from "@evg-ui/lib/context/toast";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import {
  ForceRepotrackerRunMutation,
  ForceRepotrackerRunMutationVariables,
} from "gql/generated/types";
import { FORCE_REPOTRACKER_RUN } from "gql/mutations";

interface ModalProps {
  closeModal: () => void;
  open: boolean;
  projectId: string;
}

const Modal: React.FC<ModalProps> = ({ closeModal, open, projectId }) => {
  const dispatchToast = useToastContext();

  const [forceRepotrackerRun, { loading }] = useMutation<
    ForceRepotrackerRunMutation,
    ForceRepotrackerRunMutationVariables
  >(FORCE_REPOTRACKER_RUN, {
    onCompleted() {
      dispatchToast.success("Created repotracker job.");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error creating the repotracker job: ${err.message}`,
      );
    },
  });

  const runRepotracker = () => {
    forceRepotrackerRun({
      variables: {
        projectId,
      },
    });
  };

  const onConfirm = () => {
    runRepotracker();
    closeModal();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: closeModal,
      }}
      confirmButtonProps={{
        children: "Confirm",
        disabled: loading,
        onClick: onConfirm,
      }}
      open={open}
      title="Force Repotracker Run"
    >
      Are you sure you would like to force a Repotracker run?
    </ConfirmationModal>
  );
};

export const RepotrackerField: Field = ({ disabled, uiSchema }) => {
  const {
    options: { projectId },
  } = uiSchema;

  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <Modal
          closeModal={() => setOpen(false)}
          open={open}
          projectId={projectId}
        />
      )}
      <ElementWrapper>
        <Button
          data-cy="force-repotracker-run-button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          size="small"
        >
          Force Repotracker Run
        </Button>
      </ElementWrapper>
    </>
  );
};
