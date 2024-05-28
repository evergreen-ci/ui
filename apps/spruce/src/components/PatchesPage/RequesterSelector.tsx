import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { githubPRRequester, patchRequester } from "constants/patch";
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
    displayName: requesterSubscriberOptions[githubPRRequester],
    value: githubPRRequester,
    key: githubPRRequester,
  },
  {
    displayName: requesterSubscriberOptions[patchRequester],
    value: patchRequester,
    key: patchRequester,
  },
];
