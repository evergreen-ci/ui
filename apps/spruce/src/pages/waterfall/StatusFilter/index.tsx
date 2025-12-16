import { useTransition } from "react";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { SortedTaskStatus } from "@evg-ui/lib/types/task";
import { useWaterfallAnalytics } from "analytics";
import { WaterfallFilterOptions } from "../types";

export const StatusFilter = () => {
  const { sendEvent } = useWaterfallAnalytics();
  const [, startTransition] = useTransition();
  const [statuses, setStatuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );

  const handleChange = (value: string[]) => {
    startTransition(() => {
      setStatuses(value);
    });
    sendEvent({ name: "Filtered by task status", statuses: value });
  };

  return (
    <Combobox
      data-cy="status-filter"
      label="Task Status"
      multiselect
      onChange={handleChange}
      overflow="scroll-x"
      placeholder="Displaying all statuses"
      value={statuses}
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
