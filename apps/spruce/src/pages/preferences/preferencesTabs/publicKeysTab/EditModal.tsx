import { useState, useMemo } from "react";
import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { AjvError } from "@rjsf/core";
import { diff } from "deep-object-diff";
import { useToastContext } from "@evg-ui/lib/context";
import { usePreferencesAnalytics } from "analytics";
import { SpruceForm, ValidateProps } from "components/SpruceForm";
import {
  UpdatePublicKeyMutation,
  UpdatePublicKeyMutationVariables,
  CreatePublicKeyMutation,
  CreatePublicKeyMutationVariables,
  PublicKey,
} from "gql/generated/types";
import { CREATE_PUBLIC_KEY, UPDATE_PUBLIC_KEY } from "gql/mutations";
import { string } from "utils";

const { stripNewLines } = string;

export interface EditModalPropsState {
  initialPublicKey?: { name: string; key: string }; // initialPublicKey is the key that will be updated in the db when provided
  visible: boolean;
}

interface EditModalProps extends EditModalPropsState {
  onCancel: () => void;
  myPublicKeys: PublicKey[];
}

export const EditModal: React.FC<EditModalProps> = ({
  initialPublicKey,
  myPublicKeys,
  onCancel,
  visible,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();
  const [formErrors, setFormErrors] = useState<AjvError[]>([]);

  const [updatePublicKey] = useMutation<
    UpdatePublicKeyMutation,
    UpdatePublicKeyMutationVariables
  >(UPDATE_PUBLIC_KEY, {
    onCompleted() {
      dispatchToast.success("Updated public key.");
    },
    onError(error) {
      dispatchToast.error(
        `There was an error editing the public key: ${error.message}`,
      );
    },
    refetchQueries: ["MyPublicKeys"],
  });

  const [createPublicKey] = useMutation<
    CreatePublicKeyMutation,
    CreatePublicKeyMutationVariables
  >(CREATE_PUBLIC_KEY, {
    onCompleted() {
      dispatchToast.success("Created new public key.");
    },
    onError(error) {
      dispatchToast.error(
        `There was an error creating the public key: ${error.message}`,
      );
    },
    refetchQueries: ["MyPublicKeys"],
  });

  const initialState = useMemo(
    () => ({
      name: initialPublicKey?.name ?? "",
      key: initialPublicKey?.key ?? "",
    }),
    [initialPublicKey?.name, initialPublicKey?.key],
  );
  const replaceKeyName = initialState.name;
  const [formState, setFormState] = useState<FormState>(initialState);

  const hasChanges = useMemo(() => {
    const changes = diff(initialState, formState);
    return Object.entries(changes).length > 0;
  }, [initialState, formState]);

  const closeModal = () => {
    onCancel();
    setFormState(initialState);
  };

  const onClickSave = () => {
    const nextKeyInfo = {
      name: formState.name,
      key: stripNewLines(formState.key),
    };
    if (replaceKeyName) {
      sendEvent({ name: "Changed public key" });
      updatePublicKey({
        variables: { targetKeyName: replaceKeyName, updateInfo: nextKeyInfo },
      });
    } else {
      sendEvent({ name: "Created new public key" });
      createPublicKey({ variables: { publicKeyInput: nextKeyInfo } });
    }
    closeModal();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: closeModal,
      }}
      confirmButtonProps={{
        children: "Save",
        disabled: formErrors.length > 0 || !hasChanges,
        onClick: onClickSave,
      }}
      data-cy="key-edit-modal"
      open={visible}
      title={replaceKeyName ? "Update Public Key" : "Add Public Key"}
    >
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          setFormErrors(errors);
        }}
        schema={schema}
        uiSchema={uiSchema}
        // @ts-expect-error: Will work regardless of type error
        validate={validator(myPublicKeys, replaceKeyName)}
      />
    </ConfirmationModal>
  );
};

type FormState = {
  name: string;
  key: string;
};

const schema = {
  required: ["name", "key"],
  properties: {
    name: {
      type: "string" as const,
      title: "Key Name",
      minLength: 1,
    },
    key: {
      type: "string" as const,
      title: "Public Key",
      format: "validSSHPublicKey",
    },
  },
};

const uiSchema = {
  name: {
    "ui:data-cy": "key-name-input",
  },
  key: {
    "ui:data-cy": "key-value-input",
    "ui:widget": "textarea",
    "ui:description":
      "The SSH key must begin with 'ssh-rsa' or 'ssh-dss' or 'ssh-ed25519' or 'ecdsa-sha2-nistp256'.",
    "ui:rows": 8,
  },
};

export const validator = (myPublicKeys: PublicKey[], replaceKeyName?: string) =>
  ((formState, errors) => {
    const { name } = formState;
    if (!myPublicKeys.length) return errors;

    if (myPublicKeys.find((p) => p.name === name) && name !== replaceKeyName) {
      errors.name?.addError?.("Duplicate key names are not allowed.");
    }

    return errors;
  }) satisfies ValidateProps<FormState>;
