import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useDistroSettingsAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { getDistroSettingsRoute } from "constants/routes";
import {
  CreateDistroMutation,
  CreateDistroMutationVariables,
} from "gql/generated/types";
import { CREATE_DISTRO } from "gql/mutations";
import { modalFormDefinition } from "./createDistroSchema";

const { initialFormData, schema, uiSchema } = modalFormDefinition;

interface Props {
  handleClose: () => void;
  open: boolean;
}

export const CreateModal: React.FC<Props> = ({ handleClose, open }) => {
  const navigate = useNavigate();
  const dispatchToast = useToastContext();
  const { sendEvent } = useDistroSettingsAnalytics();

  const [formState, setFormState] = useState(initialFormData);
  const [hasError, setHasError] = useState(true);

  const [createDistro] = useMutation<
    CreateDistroMutation,
    CreateDistroMutationVariables
  >(CREATE_DISTRO, {
    onCompleted({ createDistro: { newDistroId } }) {
      navigate(getDistroSettingsRoute(newDistroId), { replace: true });
      dispatchToast.success(`Created distro “${newDistroId}”`);
    },
    onError(err) {
      dispatchToast.error(`Creating distro: ${err.message}`);
    },
  });

  const onConfirm = () => {
    createDistro({
      variables: {
        opts: {
          newDistroId: formState.newDistroId,
          singleTaskDistro: formState.singleTaskDistro,
        },
      },
    });
    sendEvent({
      name: "Created new distro",
      "distro.id": formState.newDistroId,
    });
    handleClose();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: handleClose,
      }}
      confirmButtonProps={{
        children: "Create",
        disabled: hasError,
        onClick: onConfirm,
      }}
      data-cy="create-distro-modal"
      open={open}
      title="Create New Distro"
    >
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
    </ConfirmationModal>
  );
};
