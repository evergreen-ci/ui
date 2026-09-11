import { Chip, ChipGroup, Combobox, ComboboxItem } from "@via-ds/components";
import { Requester } from "constants/requesters";
import { requesterSubscriberOptions } from "constants/triggers";
import { useStatusesFilter } from "hooks";
import { PatchPageQueryParams } from "types/patch";
import styles from "./index.module.css";

export const RequesterSelector: React.FC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Requesters });

  const selectedOptions = options.filter(({ value }) =>
    statusVal.includes(value),
  );

  return (
    <div className={styles.comboboxFilter} data-testid="requester-selector">
      <Combobox
        aria-label="Patch submission"
        onChange={(selectedKeys) =>
          statusValOnChange(selectedKeys.map((key) => key.toString()))
        }
        placeholder="Patch submission"
        selectionMode="multiple"
        showChips={false}
        value={statusVal}
      >
        {options.map(({ displayName, value }) => (
          <ComboboxItem
            key={value}
            data-testid={`${value}-option`}
            id={value}
            textValue={displayName}
          >
            {displayName}
          </ComboboxItem>
        ))}
      </Combobox>
      {selectedOptions.length > 0 && (
        <ChipGroup aria-label="Selected patch submissions">
          {selectedOptions.map(({ displayName, value }) => (
            <Chip key={value} id={value}>
              {displayName}
            </Chip>
          ))}
        </ChipGroup>
      )}
    </div>
  );
};

const options = [
  {
    displayName: requesterSubscriberOptions[Requester.GitHubPR],
    value: Requester.GitHubPR,
  },
  {
    displayName: requesterSubscriberOptions[Requester.Patch],
    value: Requester.Patch,
  },
];
