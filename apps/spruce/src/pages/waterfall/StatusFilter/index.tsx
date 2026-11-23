import { Combobox, ComboboxItem } from "@via-ds/components/combobox";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { SortedTaskStatus } from "@evg-ui/lib/types/task";
import { useWaterfallAnalytics } from "analytics";
import { WaterfallFilterOptions } from "../types";

export const StatusFilter = () => {
  const { sendEvent } = useWaterfallAnalytics();
  const [statuses, setStatuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );

  const handleChange = (keys: React.Key[]) => {
    const value = keys.map(String);
    setStatuses(value);
    sendEvent({ name: "Filtered by task status", statuses: value });
  };

  return (
    <Combobox<object, "multiple">
      data-testid="status-filter"
      label="Task Status"
      menuTriggerAriaLabel="Task Status"
      onChange={handleChange}
      placeholder="All"
      selectionMode="multiple"
      showChips={false}
      value={statuses}
    >
      {SortedTaskStatus.map((ts) => (
        <ComboboxItem
          key={`${ts}-option`}
          data-testid={`${ts}-option`}
          id={ts}
          textValue={taskStatusToCopy[ts]}
        >
          {taskStatusToCopy[ts]}
        </ComboboxItem>
      ))}
    </Combobox>
  );
};
