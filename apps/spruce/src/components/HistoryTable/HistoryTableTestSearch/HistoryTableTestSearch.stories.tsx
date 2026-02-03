import { size } from "@evg-ui/lib/constants";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import FilterChips, { useFilterChipQueryParams } from "components/FilterChips";
import { TestStatus } from "types/history";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

export default {
  title: "Components/HistoryTable/HistoryTableTestSearch",
  component: HistoryTableTestSearch,
} satisfies CustomMeta<typeof HistoryTableTestSearch>;

export const Default: CustomStoryObj<typeof HistoryTableTestSearch> = {
  render: () => <TestSearch />,
};

const TestSearch = () => {
  const { chips, handleClearAll, handleOnRemove } = useFilterChipQueryParams(
    new Set([TestStatus.Failed, TestStatus.Passed, TestStatus.All]),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <HistoryTableTestSearch />
      <div style={{ paddingTop: size.s }}>
        <FilterChips
          chips={chips}
          onClearAll={handleClearAll}
          onRemove={handleOnRemove}
        />
      </div>
    </div>
  );
};
