import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { PlusButton } from "components/Buttons";
import {
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
} from "gql/generated/types";
import { MY_PUBLIC_KEYS } from "gql/queries";
import { EditModal } from "./publicKeysTab/EditModal";
import { PublicKeysTable } from "./publicKeysTab/PublicKeysTable";

export const PublicKeysTab: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const {
    data: myKeysData,
    error,
    loading: loadingMyPublicKeys,
  } = useQuery<MyPublicKeysQuery, MyPublicKeysQueryVariables>(MY_PUBLIC_KEYS);
  useErrorToast(error, "There was an error fetching your public keys");
  const myPublicKeys = myKeysData?.myPublicKeys ?? [];

  return (
    <div>
      <PlusButton
        data-cy="add-key-button"
        onClick={() => {
          setVisible(true);
        }}
        size="small"
      >
        Add key
      </PlusButton>
      <EditModal
        initialPublicKey={undefined}
        myPublicKeys={myPublicKeys}
        onCancel={() => setVisible(false)}
        visible={visible}
      />
      <TableContainer>
        <PublicKeysTable
          loading={loadingMyPublicKeys}
          myPublicKeys={myPublicKeys}
        />
      </TableContainer>
    </div>
  );
};

const TableContainer = styled.div`
  margin-top: ${size.m};
`;
