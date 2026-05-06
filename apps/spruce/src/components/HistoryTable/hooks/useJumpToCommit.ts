import { useEffect } from "react";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { HistoryQueryParams } from "types/history";
import { useHistoryTable } from "../HistoryTableContext";

const useJumpToCommit = () => {
  const [skipOrderNumber] = useQueryParam<number | undefined>(
    HistoryQueryParams.SelectedCommit,
    undefined,
  );

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { setSelectedCommit } = useHistoryTable();
  useEffect(() => {
    if (skipOrderNumber) {
      setSelectedCommit(skipOrderNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipOrderNumber]);
};

export default useJumpToCommit;
