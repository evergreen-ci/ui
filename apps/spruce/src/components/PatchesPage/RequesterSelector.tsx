import { Combobox, ComboboxItem } from "@via-ds/components";
import { Requester } from "constants/requesters";
import { requesterSubscriberOptions } from "constants/triggers";
import { useStatusesFilter } from "hooks";
import { PatchPageQueryParams } from "types/patch";

export const RequesterSelector: React.FC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Requesters });

  return (
    <Combobox
      aria-label="Patch submission"
      data-testid="requester-selector"
      onChange={(selectedKeys) =>
        statusValOnChange(selectedKeys.map((key) => key.toString()))
      }
      placeholder="Patch submission"
      selectionMode="multiple"
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
