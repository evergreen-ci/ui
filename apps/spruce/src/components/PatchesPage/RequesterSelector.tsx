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
      data-cy="requester-selector"
      label=""
      multiselect
      onChange={statusValOnChange}
      overflow="scroll-x"
      placeholder="Patch submission"
      value={statusVal}
    >
      {options.map(({ displayName, key, value }) => (
        <ComboboxOption
          key={key}
          data-cy={`${value}-option`}
          displayName={displayName}
          value={value}
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
