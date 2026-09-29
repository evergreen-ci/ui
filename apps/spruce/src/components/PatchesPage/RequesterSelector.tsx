import { Select, SelectItem } from "@via-ds/components";
import { Requester } from "constants/requesters";
import { requesterSubscriberOptions } from "constants/triggers";
import { useStatusesFilter } from "hooks";
import { PatchPageQueryParams } from "types/patch";
import styles from "./index.module.css";

export const RequesterSelector: React.FC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Requesters });

  return (
    <Select
      aria-label="Patch submission"
      className={styles.filterField}
      data-testid="requester-selector"
      onChange={(selectedKeys) =>
        statusValOnChange(selectedKeys.map((key) => key.toString()))
      }
      placeholder="Patch submission"
      selectionMode="multiple"
      value={statusVal}
    >
      {options.map(({ displayName, value }) => (
        <SelectItem
          key={value}
          data-testid={`${value}-option`}
          id={value}
          textValue={displayName}
        >
          {displayName}
        </SelectItem>
      ))}
    </Select>
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
