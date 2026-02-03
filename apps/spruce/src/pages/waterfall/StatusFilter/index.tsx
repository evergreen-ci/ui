import { useCallback, useEffect, useRef, useState } from "react";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { SortedTaskStatus } from "@evg-ui/lib/types/task";
import { useWaterfallAnalytics } from "analytics";
import { WaterfallFilterOptions } from "../types";

const DEBOUNCE_DELAY_MS = 500;

export const StatusFilter = () => {
  const { sendEvent } = useWaterfallAnalytics();
  const [statuses, setStatuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );
  const [localStatuses, setLocalStatuses] = useState<string[]>(statuses);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (value: string[]) => {
      // Update local state immediately for responsive UI.
      setLocalStatuses(value);
      sendEvent({ name: "Filtered by task status", statuses: value });
      // Debounce the actual query param update.
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        setStatuses(value);
      }, DEBOUNCE_DELAY_MS);
    },
    [setStatuses, sendEvent],
  );

  // Cleanup timer.
  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    },
    [],
  );

  return (
    <Combobox
      data-cy="status-filter"
      label="Task Status"
      multiselect
      onChange={handleChange}
      overflow="scroll-x"
      placeholder="Displaying all statuses"
      value={localStatuses}
    >
      {SortedTaskStatus.map((ts) => (
        <ComboboxOption
          key={`${ts}-option`}
          data-cy={`${ts}-option`}
          displayName={taskStatusToCopy[ts]}
          value={ts}
        />
      ))}
    </Combobox>
  );
};
