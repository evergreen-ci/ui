import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { useNavigate, useParams } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useDistroSettingsAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { getDistroSettingsRoute, slugs } from "constants/routes";
import {
  CopyDistroMutation,
  CopyDistroMutationVariables,
} from "gql/generated/types";
import { COPY_DISTRO } from "gql/mutations";
import { modalFormDefinition } from "./copyDistroSchema";

const { initialFormData, schema, uiSchema } = modalFormDefinition;

interface Props {
  handleClose: () => void;
  open: boolean;
}

export const CopyModal: React.FC<Props> = ({ handleClose, open }) => {
  const { [slugs.distroId]: distroId } = useParams();
  const navigate = useNavigate();
  const dispatchToast = useToastContext();
  const { sendEvent } = useDistroSettingsAnalytics();

  const [formState, setFormState] = useState(initialFormData);
  const [hasError, setHasError] = useState(true);

  const [copyDistro] = useMutation<
    CopyDistroMutation,
    CopyDistroMutationVariables
  >(COPY_DISTRO, {
    onCompleted({ copyDistro: { newDistroId } }) {
      navigate(getDistroSettingsRoute(newDistroId), { replace: true });
      dispatchToast.success(`Created distro “${newDistroId}”`);
    },
    onError(err) {
      dispatchToast.error(`Duplicating distro: ${err.message}`);
    },
  });

  const onConfirm = () => {
    copyDistro({
      variables: {
        opts: {
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          distroIdToCopy: distroId,
          newDistroId: formState.newDistroId,
        },
      },
    });
    sendEvent({
      name: "Clicked duplicate distro",
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
        children: "Duplicate",
        disabled: hasError,
        onClick: onConfirm,
      }}
      data-cy="copy-distro-modal"
      open={open}
      title={`Duplicate “${distroId}”`}
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
