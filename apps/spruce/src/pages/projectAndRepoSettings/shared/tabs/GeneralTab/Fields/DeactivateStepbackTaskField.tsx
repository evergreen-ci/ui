import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@leafygreen-ui/button";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Description } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { SpruceForm } from "components/SpruceForm";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import {
  DeactivateStepbackTaskMutation,
  DeactivateStepbackTaskMutationVariables,
} from "gql/generated/types";
import { DEACTIVATE_STEPBACK_TASK } from "gql/mutations";

interface ModalProps {
  closeModal: () => void;
  open: boolean;
  projectId: string;
}

const Modal: React.FC<ModalProps> = ({ closeModal, open, projectId }) => {
  const dispatchToast = useToastContext();
  const [formState, setFormState] = useState(
    deactivateStepbackForm.defaultFormData,
  );
  const [hasError, setHasError] = useState(true);

  const [deactivateStepbackTask, { loading }] = useMutation<
    DeactivateStepbackTaskMutation,
    DeactivateStepbackTaskMutationVariables
  >(DEACTIVATE_STEPBACK_TASK, {
    onCompleted() {
      dispatchToast.success("Stepback task was deactivated.");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error deactivating the stepback task: ${err.message}`,
      );
    },
  });

  const onConfirm = () => {
    const { buildVariantName, taskName } = formState;
    deactivateStepbackTask({
      variables: {
        projectId,
        buildVariantName,
        taskName,
      },
    });
    closeModal();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: closeModal,
      }}
      confirmButtonProps={{
        children: "Confirm",
        disabled: hasError || loading,
        onClick: onConfirm,
      }}
      data-cy="deactivate-stepback-modal"
      open={open}
      title="Deactivate Scheduled Stepback Task"
    >
      <p>
        Specify a stepback task to deactivate. To deactivate stepback more
        broadly, disable stepback for the project.
      </p>
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={deactivateStepbackForm.schema}
        uiSchema={deactivateStepbackForm.uiSchema}
      />
    </ConfirmationModal>
  );
};

export const DeactivateStepbackTaskField: Field = ({ disabled, uiSchema }) => {
  const {
    options: { projectId },
  } = uiSchema;

  const [open, setOpen] = useState(false);
  const id = "deactivate-stepback-button";

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
        <label htmlFor={id}>Deactivate Currently Scheduled Stepback Task</label>
        <Description>
          Deactivate a specific stepback task. This will not turn off future
          stepbacks for the task.
        </Description>
        <div>
          <Button
            data-cy={id}
            disabled={disabled}
            id={id}
            onClick={() => setOpen(true)}
            size="small"
          >
            Deactivate
          </Button>
        </div>
      </ElementWrapper>
    </>
  );
};

const deactivateStepbackForm = {
  defaultFormData: {
    buildVariantName: "",
    taskName: "",
  },
  schema: {
    type: "object" as const,
    required: ["buildVariantName", "taskName"],
    properties: {
      buildVariantName: {
        type: "string" as const,
        title: "Build Variant Name",
        minLength: 1,
        format: "noSpaces",
      },
      taskName: {
        type: "string" as const,
        title: "Task Name",
        minLength: 1,
        format: "noSpaces",
      },
    },
  },
  uiSchema: {
    buildVariantName: {
      "ui:data-cy": "deactivate-variant-name-input",
      "ui:placeholder": "ex. ubuntu1604",
    },
    taskName: {
      "ui:data-cy": "deactivate-task-name-input",
      "ui:placeholder": "ex. dist",
    },
  },
};
