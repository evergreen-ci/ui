import { WordBreak } from "@evg-ui/lib/components/styles";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SkippedTestsModal } from ".";

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
    testName: `tests/unit/skipped_test_${i}.js`,
  }));

export default {
  component: SkippedTestsModal,
} satisfies CustomMeta<typeof SkippedTestsModal>;

export const Default: CustomStoryObj<typeof SkippedTestsModal> = {
  render: () => (
    <SkippedTestsModal
      columns={columns}
      dataCyPrefix="story-skipped-tests"
      getSearchText={({ testName }) => testName}
      onClickDownload={() => {}}
      open
      rows={getRows(8)}
      searchPlaceholder="Search test names"
      setOpen={() => {}}
      subtitle="8 tests were skipped by TSS when this task ran. This snapshot may differ from what TSS would skip now."
      totalCount={8}
    />
  ),
};

export const Truncated: CustomStoryObj<typeof SkippedTestsModal> = {
  render: () => (
    <SkippedTestsModal
      columns={columns}
      dataCyPrefix="story-skipped-tests"
      getSearchText={({ testName }) => testName}
      onClickDownload={() => {}}
      open
      rows={getRows(50)}
      searchPlaceholder="Search test names"
      setOpen={() => {}}
      subtitle="120 tests were skipped by TSS when this task ran. This snapshot may differ from what TSS would skip now."
      totalCount={120}
    />
  ),
};
