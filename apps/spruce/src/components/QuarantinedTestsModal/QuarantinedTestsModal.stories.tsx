import { WordBreak } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { QuarantinedTestsModal } from ".";

type StoryRow = {
  testName: string;
};

const columns: LGColumnDef<StoryRow>[] = [
  {
    id: "testName",
    header: "Test Name",
    accessorKey: "testName",
    cell: ({ getValue }) => <WordBreak>{getValue() as string}</WordBreak>,
  },
];

const getRows = (count: number): StoryRow[] =>
  Array.from({ length: count }, (_, i) => ({
    testName: `tests/unit/quarantined_test_${i}.js`,
  }));

export default {
  component: QuarantinedTestsModal,
} satisfies CustomMeta<typeof QuarantinedTestsModal>;

export const Default: CustomStoryObj<typeof QuarantinedTestsModal> = {
  render: () => (
    <QuarantinedTestsModal
      columns={columns}
      dataCyPrefix="story-quarantined-tests"
      getSearchText={({ testName }) => testName}
      onClickDownload={() => {}}
      open
      rows={getRows(8)}
      searchPlaceholder="Search test names"
      setOpen={() => {}}
      subtitle="8 tests were quarantined in TSS when this task ran. This snapshot may not match the current quarantine state."
      totalCount={8}
    />
  ),
};

export const Truncated: CustomStoryObj<typeof QuarantinedTestsModal> = {
  render: () => (
    <QuarantinedTestsModal
      columns={columns}
      dataCyPrefix="story-quarantined-tests"
      getSearchText={({ testName }) => testName}
      onClickDownload={() => {}}
      open
      rows={getRows(50)}
      searchPlaceholder="Search test names"
      setOpen={() => {}}
      subtitle="120 tests were quarantined in TSS when this task ran. This snapshot may not match the current quarantine state."
      totalCount={120}
    />
  ),
};
