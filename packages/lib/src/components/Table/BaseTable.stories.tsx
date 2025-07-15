import { useState, useRef } from "react";
import { css } from "@leafygreen-ui/emotion";
import {
  LGColumnDef,
  useLeafyGreenTable,
  useLeafyGreenVirtualTable,
} from "@leafygreen-ui/table";
import { CustomStoryObj, CustomMeta } from "../../test_utils/types";
import { WordBreak } from "../styles";
import { BaseTable } from "./BaseTable";

export default {
  component: BaseTable,
} satisfies CustomMeta<typeof BaseTable>;

export const Default: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={lgRows} />,
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};

export const EmptyState: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={[]} />,
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};

export const NestedRows: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={nestedRows} />,
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};

export const SelectedRows: CustomStoryObj<typeof BaseTable> = {
  render: (args) => (
    <TemplateComponent
      {...args}
      data={lgRows}
      selectedRowIndexes={[0, 5, 10, 15]}
    />
  ),
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};

export const LongContent: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={longContentRows} />,
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};
const virtualScrollingContainerHeight = css`
  height: 500px;
`;

export const VirtualTable: CustomStoryObj<typeof BaseTable> = {
  render: (args) => (
    <TemplateComponent
      {...args}
      className={virtualScrollingContainerHeight}
      data={virtualRows}
      useVirtualScrolling
    />
  ),
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};

export const Loading: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={[]} />,
  args: {
    loading: true,
    darkMode: false,
    loadingRows: 5,
  },
};

interface DataShape {
  name: string;
  type: string;
  size: string;
}

const makeDefaultRows = (count: number): DataShape[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `name ${i}`,
    type: `type ${i}`,
    size: `size ${i}`,
  }));

const lgRows = makeDefaultRows(20);
const virtualRows = makeDefaultRows(20);

const nestedRows: DataShape[] = Array.from({ length: 10 }, (_, i) => ({
  name: `name ${i}`,
  type: `type ${i}`,
  size: `size ${i}`,
  subRows: [
    {
      name: `nested name ${i}`,
      type: `nested type ${i}`,
      size: `nested size ${i}`,
    },
  ],
}));

const longContent = "long ".repeat(50);
const longContentRows: DataShape[] = Array.from({ length: 3 }, (_, i) => ({
  name: `${longContent} name ${i}`,
  type: `${longContent} type ${i}`,
  size: `${longContent} size ${i}`,
  subRows: [
    {
      name: `${longContent} nested name ${i}`,
      type: `${longContent} nested type ${i}`,
      size: `${longContent} nested size ${i}`,
    },
  ],
}));

const columns: LGColumnDef<DataShape>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    size: 60,
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: true,
    size: 60,
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
  },
  {
    accessorKey: "size",
    header: "Size",
    enableSorting: true,
    size: 60,
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
  },
];

const TemplateComponent: React.FC<
  React.ComponentProps<typeof BaseTable> & {
    data: DataShape[];
    useVirtualScrolling?: boolean;
  }
> = (args) => {
  const { data, useVirtualScrolling, ...rest } = args;
  const tableData = useState(() => data)[0];
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const lgTable = useLeafyGreenTable<DataShape>({
    data: tableData,
    columns,
  });

  const virtualTable = useLeafyGreenVirtualTable<DataShape>({
    containerRef: tableContainerRef,
    data: tableData,
    columns,
  });

  return useVirtualScrolling ? (
    <BaseTable {...rest} ref={tableContainerRef} table={virtualTable} />
  ) : (
    <BaseTable {...rest} table={lgTable} />
  );
};

interface CellProps {
  value: string;
}

const Cell: React.FC<CellProps> = ({ value }) => (
  <div style={{ padding: "8px 0px" }}>
    <WordBreak>{value}</WordBreak>
  </div>
);
