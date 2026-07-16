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
  args: {
    darkMode: false,
    shouldAlternateRowColor: true,
  },
  render: (args) => <TemplateComponent {...args} data={lgRows} />,
};

export const EmptyState: CustomStoryObj<typeof BaseTable> = {
  args: {
    darkMode: false,
    shouldAlternateRowColor: true,
  },
  render: (args) => <TemplateComponent {...args} data={[]} />,
};

export const NestedRows: CustomStoryObj<typeof BaseTable> = {
  args: {
    darkMode: false,
    shouldAlternateRowColor: true,
  },
  render: (args) => <TemplateComponent {...args} data={nestedRows} />,
};

export const SelectedRows: CustomStoryObj<typeof BaseTable> = {
  args: {
    darkMode: false,
    shouldAlternateRowColor: true,
  },
  render: (args) => (
    <TemplateComponent
      {...args}
      data={lgRows}
      selectedRowIndexes={[0, 5, 10, 15]}
    />
  ),
};

export const LongContent: CustomStoryObj<typeof BaseTable> = {
  args: {
    darkMode: false,
    shouldAlternateRowColor: true,
  },
  render: (args) => <TemplateComponent {...args} data={longContentRows} />,
};
const virtualScrollingContainerHeight = css`
  height: 500px;
`;

export const VirtualTable: CustomStoryObj<typeof BaseTable> = {
  args: {
    darkMode: false,
    shouldAlternateRowColor: true,
  },
  render: (args) => (
    <TemplateComponent
      {...args}
      className={virtualScrollingContainerHeight}
      data={virtualRows}
      useVirtualScrolling
    />
  ),
};

export const Loading: CustomStoryObj<typeof BaseTable> = {
  args: {
    darkMode: false,
    loading: true,
    loadingRows: 5,
  },
  render: (args) => <TemplateComponent {...args} data={[]} />,
};

interface DataShape {
  name: string;
  type: string;
  size: string;
}

const makeDefaultRows = (count: number): DataShape[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `name ${i}`,
    size: `size ${i}`,
    type: `type ${i}`,
  }));

const lgRows = makeDefaultRows(20);
const virtualRows = makeDefaultRows(20);

const nestedRows: DataShape[] = Array.from({ length: 10 }, (_, i) => ({
  name: `name ${i}`,
  size: `size ${i}`,
  subRows: [
    {
      name: `nested name ${i}`,
      size: `nested size ${i}`,
      type: `nested type ${i}`,
    },
  ],
  type: `type ${i}`,
}));

const longContent = "long ".repeat(50);
const longContentRows: DataShape[] = Array.from({ length: 3 }, (_, i) => ({
  name: `${longContent} name ${i}`,
  size: `${longContent} size ${i}`,
  subRows: [
    {
      name: `${longContent} nested name ${i}`,
      size: `${longContent} nested size ${i}`,
      type: `${longContent} nested type ${i}`,
    },
  ],
  type: `${longContent} type ${i}`,
}));

const columns: LGColumnDef<DataShape>[] = [
  {
    accessorKey: "name",
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
    enableSorting: true,
    header: "Name",
    size: 60,
  },
  {
    accessorKey: "type",
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
    enableSorting: true,
    header: "Type",
    size: 60,
  },
  {
    accessorKey: "size",
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
    enableSorting: true,
    header: "Size",
    size: 60,
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
    columns,
    data: tableData,
  });

  const virtualTable = useLeafyGreenVirtualTable<DataShape>({
    columns,
    containerRef: tableContainerRef,
    data: tableData,
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
