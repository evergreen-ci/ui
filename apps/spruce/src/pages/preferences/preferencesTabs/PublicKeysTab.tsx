import { useState } from "react";
import styled from "@emotion/styled";
import { PlusButton } from "components/Buttons";
import { size } from "constants/tokens";
import { EditModal, EditModalPropsState } from "./publicKeysTab/EditModal";
import { PublicKeysTable } from "./publicKeysTab/PublicKeysTable";

export const PublicKeysTab: React.FC = () => {
  const [editModalProps, setEditModalProps] = useState<EditModalPropsState>(
    // @ts-ignore: FIXME. This comment was added by an automated script.
    defaultEditModalProps,
  );

  const onCancel = () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    setEditModalProps(defaultEditModalProps);
  };

  return (
    <div>
      <PlusButton
        size="small"
        data-cy="add-key-button"
        onClick={() => {
          setEditModalProps({
            visible: true,
            // @ts-ignore: FIXME. This comment was added by an automated script.
            initialPublicKey: null,
          });
        }}
      >
        Add key
      </PlusButton>
      <TableContainer>
        <PublicKeysTable setEditModalProps={setEditModalProps} />
      </TableContainer>
      <EditModal {...editModalProps} onCancel={onCancel} />
    </div>
  );
};

const defaultEditModalProps = {
  visible: false,
  initialPublicKey: null,
};

const TableContainer = styled.div`
  margin-top: ${size.m};
`;
