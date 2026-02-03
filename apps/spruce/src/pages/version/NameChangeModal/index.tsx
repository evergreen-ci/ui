import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { IconButton } from "@leafygreen-ui/icon-button";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useToastContext } from "@evg-ui/lib/context";
import { SpruceForm } from "components/SpruceForm";
import {
  UpdatePatchDescriptionMutation,
  UpdatePatchDescriptionMutationVariables,
} from "gql/generated/types";
import { UPDATE_PATCH_DESCRIPTION } from "gql/mutations";
import { getFormSchema } from "./getFormSchema";

interface NameChangeModalProps {
  originalPatchName: string;
  patchId: string;
}
export const NameChangeModal: React.FC<NameChangeModalProps> = ({
  originalPatchName,
  patchId,
}) => {
  const [formState, setFormState] = useState<{ newPatchName?: string }>({});
  const [hasFormError, setHasFormError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { schema, uiSchema } = getFormSchema(originalPatchName);
  const dispatchToast = useToastContext();
  const [updateDescription, { loading }] = useMutation<
    UpdatePatchDescriptionMutation,
    UpdatePatchDescriptionMutationVariables
  >(UPDATE_PATCH_DESCRIPTION, {
    onCompleted() {
      setIsOpen(false);
      dispatchToast.success("Patch name was successfully updated.");
    },
    onError({ message }) {
      dispatchToast.error(`Error updating patch name: ${message}.`);
    },
    refetchQueries: ["Version"],
  });

  const { newPatchName = "" } = formState;

  return (
    <>
      <StyledIconButton
        aria-label="name-change-modal-trigger"
        data-cy="name-change-modal-trigger"
        onClick={() => setIsOpen(true)}
      >
        <Icon glyph="Edit" />
      </StyledIconButton>
      <ConfirmationModal
        cancelButtonProps={{
          onClick: () => setIsOpen(false),
        }}
        confirmButtonProps={{
          children: "Confirm",
          disabled:
            newPatchName === originalPatchName || hasFormError || loading,
          onClick: () =>
            updateDescription({
              variables: { patchId, description: newPatchName },
            }),
        }}
        open={isOpen}
        title="Update Patch Name"
      >
        <SpruceForm
          formData={formState}
          onChange={({ errors, formData }) => {
            setHasFormError(!!errors.length);
            setFormState(formData);
          }}
          schema={schema}
          uiSchema={uiSchema}
        />
      </ConfirmationModal>
    </>
  );
};

const StyledIconButton = styled(IconButton)`
  vertical-align: top;
  margin-left: ${size.xxs};
`;
