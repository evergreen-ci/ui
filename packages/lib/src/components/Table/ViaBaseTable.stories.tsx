import { useRef, useState } from "react";
import { CustomMeta, CustomStoryObj } from "../../test_utils/types";
import { WordBreak } from "../styles";
import styles from "./BaseTable.stories.module.css";
import { ViaBaseTable } from "./ViaBaseTable";
import { ViaColumnDef, useTable, useVirtualTable } from ".";

export default {
  component: ViaBaseTable,
} satisfies CustomMeta<typeof ViaBaseTable>;

export const Default: CustomStoryObj<typeof ViaBaseTable> = {
  render: (args) => <TemplateComponent {...args} data={rows} />,
  args: {
    shouldAlternateRowColor: true,
  },
};

export const EmptyState: CustomStoryObj<typeof ViaBaseTable> = {
  render: (args) => <TemplateComponent {...args} data={[]} />,
  args: {
    shouldAlternateRowColor: true,
  },
};

export const SelectableRows: CustomStoryObj<typeof ViaBaseTable> = {
  render: (args) => (
    <TemplateComponent {...args} data={rows} hasSelectableRows />
  ),
  args: {
    shouldAlternateRowColor: true,
  },
};

export const LongContent: CustomStoryObj<typeof ViaBaseTable> = {
  render: (args) => <TemplateComponent {...args} data={longContentRows} />,
  args: {
    shouldAlternateRowColor: true,
  },
};

export const VirtualTable: CustomStoryObj<typeof ViaBaseTable> = {
  render: (args) => (
    <TemplateComponent
      {...args}
      className={styles.virtualScrollingContainer}
      data={rows}
      useVirtualScrolling
    />
  ),
  args: {
    shouldAlternateRowColor: true,
  },
};

export const Loading: CustomStoryObj<typeof ViaBaseTable> = {
  render: (args) => <TemplateComponent {...args} data={[]} />,
  args: {
    loading: true,
    loadingRows: 5,
  },
};

interface DataShape {
  name: string;
  type: string;
  size: string;
}

const rows: DataShape[] = Array.from({ length: 20 }, (_, i) => ({
  name: `name ${i}`,
  type: `type ${i}`,
  size: `size ${i}`,
}));

const longContent = "long ".repeat(50);
const longContentRows: DataShape[] = Array.from({ length: 3 }, (_, i) => ({
  name: `${longContent} name ${i}`,
  type: `${longContent} type ${i}`,
  size: `${longContent} size ${i}`,
}));

const columns: ViaColumnDef<DataShape>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    meta: { search: { "data-testid": "name-filter" } },
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
  {
    accessorKey: "size",
    header: "Size",
    enableSorting: true,
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
    meta: {
      treeSelect: {
        "data-testid": "size-filter",
        options: [
          { title: "Small", value: "small", key: "small" },
          { title: "Large", value: "large", key: "large" },
        ],
      },
    },
  },
];

const TemplateComponent: React.FC<
  React.ComponentProps<typeof ViaBaseTable> & {
    data: DataShape[];
    hasSelectableRows?: boolean;
    useVirtualScrolling?: boolean;
  }
> = ({ data, hasSelectableRows, useVirtualScrolling, ...rest }) => {
  const tableData = useState(() => data)[0];
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useTable<DataShape>({
    columns,
    data: tableData,
    hasSelectableRows,
  });

  const virtualTable = useVirtualTable<DataShape>({
    columns,
    containerRef: tableContainerRef,
    data: tableData,
  });

  return useVirtualScrolling ? (
    <ViaBaseTable {...rest} ref={tableContainerRef} table={virtualTable} />
  ) : (
    <ViaBaseTable {...rest} table={table} />
  );
};
