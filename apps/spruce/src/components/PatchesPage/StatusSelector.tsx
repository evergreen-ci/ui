import { Chip, ChipGroup, Combobox, ComboboxItem } from "@via-ds/components";
import { useStatusesFilter } from "hooks";
import {
  ALL_PATCH_STATUS,
  PatchPageQueryParams,
  PatchStatus,
} from "types/patch";
import styles from "./index.module.css";

export const StatusSelector: React.FC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Statuses });

  const onChange = (selectedKeys: React.Key[]) => {
    const nextStatuses = selectedKeys.map((key) => key.toString());
    const selectedAll = nextStatuses.includes(ALL_PATCH_STATUS);
    const previouslySelectedAll = statusVal.includes(ALL_PATCH_STATUS);

    if (selectedAll && !previouslySelectedAll) {
      statusValOnChange(statusValues);
    } else if (!selectedAll && previouslySelectedAll) {
      statusValOnChange([]);
    } else if (
      selectedAll &&
      previouslySelectedAll &&
      nextStatuses.length < statusValues.length
    ) {
      statusValOnChange(
        nextStatuses.filter((status) => status !== ALL_PATCH_STATUS),
      );
    } else {
      statusValOnChange(nextStatuses);
    }
  };

  const selectedOptions = statusOptions.filter(({ value }) =>
    statusVal.includes(value),
  );

  return (
    <div className={styles.comboboxFilter} data-testid="my-patch-status-select">
      <Combobox
        aria-label="Patch status"
        onChange={onChange}
        placeholder="Patch Status"
        selectionMode="multiple"
        showChips={false}
        value={statusVal}
      >
        {statusOptions.map(({ label, value }) => (
          <ComboboxItem
            key={value}
            data-testid={`${value}-option`}
            id={value}
            textValue={label}
          >
            {label}
          </ComboboxItem>
        ))}
      </Combobox>
      {selectedOptions.length > 0 && (
        <ChipGroup aria-label="Selected patch statuses">
          {selectedOptions.map(({ label, value }) => (
            <Chip key={value} id={value}>
              {label}
            </Chip>
          ))}
        </ChipGroup>
      )}
    </div>
  );
};

const statusOptions = [
  {
    label: "All",
    value: ALL_PATCH_STATUS,
  },
  {
    label: "Succeeded",
    value: PatchStatus.Success,
  },
  {
    label: "Created/Unconfigured",
    value: PatchStatus.Created,
  },
  {
    label: "Running",
    value: PatchStatus.Started,
  },
  {
    label: "Failed",
    value: PatchStatus.Failed,
  },
];

const statusValues = statusOptions.map(({ value }) => value);
