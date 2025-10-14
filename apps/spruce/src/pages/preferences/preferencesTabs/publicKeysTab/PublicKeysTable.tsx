import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { WordBreak } from "@evg-ui/lib/components/styles";
import {
  filterFns,
  getFilteredRowModel,
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components/Table";
import { TablePlaceholder } from "@evg-ui/lib/components/Table/TablePlaceholder";
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

type PublicKeysTableProps = {
  myPublicKeys: PublicKey[];
  loading: boolean;
};

export const PublicKeysTable: React.FC<PublicKeysTableProps> = ({
  loading,
  myPublicKeys,
}) => {
  const columns: LGColumnDef<PublicKey>[] = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        filterFns: filterFns.includesString,
        meta: {
          search: {
            placeholder: "Key name",
          },
        },
        cell: ({ getValue }) => (
          <WordBreak data-cy="table-key-name">{getValue() as string}</WordBreak>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <ActionButtons myPublicKeys={myPublicKeys} publicKey={row.original} />
        ),
      },
    ],
    [myPublicKeys],
  );

  const table = useLeafyGreenTable<PublicKey>({
    columns,
    data: myPublicKeys,
    defaultColumn: {
      // Workaround for react-table auto sizing limitations.
      // https://github.com/TanStack/table/discussions/4179#discussioncomment-7142606
      size: "auto" as unknown as number,
    },
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <BaseTable
      emptyComponent={<TablePlaceholder glyph="Key" message="No keys saved." />}
      loading={loading}
      shouldAlternateRowColor
      table={table}
    />
  );
};

interface ActionButtonsProps {
  publicKey: PublicKey;
  myPublicKeys: PublicKey[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
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
        size="small"
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
            size="small"
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
