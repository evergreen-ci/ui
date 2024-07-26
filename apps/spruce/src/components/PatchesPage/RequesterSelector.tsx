import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { Requester } from "constants/requesters";
import { requesterSubscriberOptions } from "constants/triggers";
import { useStatusesFilter } from "hooks";
import { PatchPageQueryParams } from "types/patch";

export const RequesterSelector: React.FC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Requesters });

  return (
    <Combobox
      label=""
      data-cy="requester-selector"
      placeholder="Patch submission"
      value={statusVal}
      multiselect
      onChange={statusValOnChange}
      overflow="scroll-x"
    >
      {options.map(({ displayName, key, value }) => (
        <ComboboxOption
          key={key}
          value={value}
          displayName={displayName}
          data-cy={`${value}-option`}
        />
      ))}
    </Combobox>
  );
};

const options = [
  {
    displayName: requesterSubscriberOptions[Requester.GitHubPR],
    value: Requester.GitHubPR,
    key: Requester.GitHubPR,
  },
  {
    displayName: requesterSubscriberOptions[Requester.Patch],
    value: Requester.Patch,
    key: Requester.Patch,
  },
];
