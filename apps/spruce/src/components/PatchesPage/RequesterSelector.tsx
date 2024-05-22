import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useStatusesFilter } from "hooks";
import { PatchPageQueryParams } from "types/patch";

export const RequesterSelector: React.FC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Requesters });

  return (
    <Combobox
      label=""
      data-cy="requester-selector"
      placeholder="Select patch types"
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

enum Requesters {
  GithubPRRequester = "github_pull_request",
  PatchVersionRequester = "patch_request",
}

const options = [
  {
    displayName: "PR Commits",
    value: Requesters.GithubPRRequester,
    key: Requesters.GithubPRRequester,
  },
  {
    displayName: "CLI",
    value: Requesters.PatchVersionRequester,
    key: Requesters.PatchVersionRequester,
  },
];
