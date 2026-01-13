import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import { Icon } from "@leafygreen-ui/icon";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import {
  PublicKey,
  RemovePublicKeyMutation,
  RemovePublicKeyMutationVariables,
} from "gql/generated/types";
import { REMOVE_PUBLIC_KEY } from "gql/mutations";
import { EditModal } from "./EditModal";

interface ActionButtonsProps {
  myPublicKeys: PublicKey[];
  publicKey: PublicKey;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  myPublicKeys,
  publicKey,
}) => {
  const [visible, setVisible] = useState(false);
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const [removePublicKey, { loading: loadingRemovePublicKey }] = useMutation<
    RemovePublicKeyMutation,
    RemovePublicKeyMutationVariables
  >(REMOVE_PUBLIC_KEY, {
    onError(error) {
      dispatchToast.error(
        `There was an error removing the public key: ${error.message}`,
      );
    },
    refetchQueries: ["MyPublicKeys"],
  });

  return (
    <ButtonContainer>
      <Button
        data-cy="edit-btn"
        leftGlyph={<Icon glyph="Edit" />}
        onClick={() => setVisible(true)}
        size={ButtonSize.Small}
      />
      <EditModal
        initialPublicKey={publicKey}
        myPublicKeys={myPublicKeys}
        onCancel={() => setVisible(false)}
        visible={visible}
      />
      <Popconfirm
        align="right"
        onConfirm={() => {
          sendEvent({ name: "Deleted public key" });
          removePublicKey({ variables: { keyName: publicKey.name } });
        }}
        trigger={
          <Button
            data-cy="delete-btn"
            disabled={loadingRemovePublicKey}
            size={ButtonSize.Small}
          >
            <Icon glyph="Trash" />
          </Button>
        }
      >
        Delete this public key?
      </Popconfirm>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;
