import { useState, useEffect, useCallback, useRef } from "react";

import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import VariantHistoryRow from "pages/variantHistory/VariantHistoryRow";
import HistoryTable from "./HistoryTable";
import { mainlineCommitData } from "./testData";
import { context } from ".";

const { HistoryTableProvider, useHistoryTable } = context;

export default {
  component: HistoryTable,
} satisfies CustomMeta<typeof HistoryTable>;

export const VariantHistoryTable: CustomStoryObj<typeof HistoryTable> = {
  render: () => (
    <HistoryTableProvider>
      <HistoryTableWrapper />
    </HistoryTableProvider>
  ),
};

const HistoryTableWrapper: React.FC = () => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { addColumns, ingestNewCommits } = useHistoryTable();
  const [isLoading, setIsLoading] = useState(false);
  const [oldData, setOldData] = useState(mainlineCommitData);
  const timeoutRef = useRef(null);
  useEffect(() => {
    const variantColumns = ["Lint", "test-model-distro", "dist"];
    addColumns(variantColumns);
    ingestNewCommits(mainlineCommitData);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    setIsLoading(true);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      const newData = generateNewCommitData(oldData);
      ingestNewCommits(newData);
      setOldData(newData);
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldData]);

  return (
    <div style={{ height: 600, width: "100%", border: "red 1px solid" }}>
      <HistoryTable loading={isLoading} loadMoreItems={loadMore}>
        {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
        {VariantHistoryRow}
      </HistoryTable>
    </div>
  );
};

// This is a helper function to generate new commit data
const generateNewCommitData = (oldData: typeof mainlineCommitData) => {
  const commitData = { ...oldData };
  // get last 5 versions from commit data
  const last5Versions = commitData.versions.slice(-5);
  let counter = 1;
  const updatedVersions = last5Versions.map((version) => {
    const newVersion = { ...version };
    if (newVersion.version) {
      // version order number is a random number
      const dt = new Date(newVersion.version.createTime);
      dt.setDate(dt.getDate() - 1);
      newVersion.version.createTime = dt.toISOString();
      newVersion.version.order -= counter;
      counter += 1;
    } else {
      newVersion.rolledUpVersions = newVersion.rolledUpVersions.map(
        (rolledUpVersion) => {
          const newRolledUpVersion = { ...rolledUpVersion };
          const dt = new Date(newRolledUpVersion.createTime);
          dt.setDate(dt.getDate() - 1);
          newRolledUpVersion.createTime = dt.toISOString();
          newRolledUpVersion.order -= counter;
          counter += 1;
          return newRolledUpVersion;
        },
      );
    }
    return newVersion;
  });

  return {
    ...commitData,
    versions: updatedVersions,
  };
};
