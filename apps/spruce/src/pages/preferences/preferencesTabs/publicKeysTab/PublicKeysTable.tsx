import { useMemo } from "react";
import { WordBreak } from "@evg-ui/lib/components/styles";
import {
  filterFns,
  getFilteredRowModel,
  useLeafyGreenTable,
  BaseTable,
  LGColumnDef,
} from "@evg-ui/lib/components/Table";
import { TablePlaceholder } from "@evg-ui/lib/components/Table/TablePlaceholder";
import { PublicKey } from "gql/generated/types";
import { ActionButtons } from "./ActionButtons";

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
