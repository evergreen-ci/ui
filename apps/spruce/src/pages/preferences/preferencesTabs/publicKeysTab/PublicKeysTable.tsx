import { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
} from "@evg-ui/lib/components/Table";
import { TablePlaceholder } from "@evg-ui/lib/components/Table/TablePlaceholder";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import {
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  PublicKey,
  RemovePublicKeyMutation,
  RemovePublicKeyMutationVariables,
} from "gql/generated/types";
import { REMOVE_PUBLIC_KEY } from "gql/mutations";
import { MY_PUBLIC_KEYS } from "gql/queries";
import { EditModalPropsState } from "./EditModal";

type PublicKeysTableProps = {
  setEditModalProps: React.Dispatch<React.SetStateAction<EditModalPropsState>>;
};

export const PublicKeysTable: React.FC<PublicKeysTableProps> = ({
  setEditModalProps,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = usePreferencesAnalytics();

  const { data: myKeysData, loading: loadingMyPublicKeys } = useQuery<
    MyPublicKeysQuery,
    MyPublicKeysQueryVariables
  >(MY_PUBLIC_KEYS, {
    onError(error) {
      dispatchToast.error(
        `There was an error fetching your public keys: ${error.message}`,
      );
    },
  });

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

  const columns = useMemo(
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        cell: ({ getValue }) => (
          <WordBreak data-cy="table-key-name">{getValue()}</WordBreak>
        ),
      },
      {
        header: "Actions",
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        cell: ({ row }) => {
          const { key, name } = row.original;
          return (
            <ButtonContainer>
              <Button
                data-cy="edit-btn"
                leftGlyph={<Icon glyph="Edit" />}
                onClick={() => {
                  setEditModalProps({
                    initialPublicKey: { key, name },
                    visible: true,
                  });
                }}
                size="small"
              />
              <Popconfirm
                align="right"
                onConfirm={() => {
                  sendEvent({ name: "Deleted public key" });
                  removePublicKey({ variables: { keyName: name } });
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
        },
      },
    ],
    [loadingRemovePublicKey, removePublicKey, sendEvent, setEditModalProps],
  );

  const table = useLeafyGreenTable<PublicKey>({
    columns,
    data: myKeysData?.myPublicKeys ?? [],
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
      loading={loadingMyPublicKeys}
      shouldAlternateRowColor
      table={table}
    />
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;
