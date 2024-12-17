import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { ConfirmationModal } from "components/ConfirmationModal";
import Icon from "components/Icon";
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

  const { newPatchName } = formState;

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
        buttonText="Confirm"
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          updateDescription({
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            variables: { patchId, description: newPatchName },
          });
        }}
        open={isOpen}
        submitDisabled={
          newPatchName === originalPatchName || hasFormError || loading
        }
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
