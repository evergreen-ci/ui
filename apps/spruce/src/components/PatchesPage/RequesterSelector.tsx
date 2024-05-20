import Dropdown from "components/Dropdown";
import { TreeSelect } from "components/TreeSelect";
import { noFilterMessage } from "constants/strings";
import { useStatusesFilter } from "hooks";
import { PatchPageQueryParams } from "types/patch";

export const RequesterSelector: React.FC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Requesters });

  return (
    <Dropdown
      data-cy="requester-selector"
      buttonText={`Patch submission: ${
        statusVal.length
          ? statusVal.map((v) => statusValToCopy[v]).join(", ")
          : noFilterMessage
      }`}
    >
      <TreeSelect
        onChange={statusValOnChange}
        state={statusVal}
        tData={treeData}
        hasStyling={false}
      />
    </Dropdown>
  );
};

export const ALL_REQUESTERS = "all";

enum Requesters {
  GithubPRRequester = "github_pull_request",
  PatchVersionRequester = "patch_request",
}

const statusValToCopy = {
  [ALL_REQUESTERS]: "All",
  [Requesters.GithubPRRequester]: "PR Commits",
  [Requesters.PatchVersionRequester]: "CLI",
};

const treeData = [
  {
    title: statusValToCopy[ALL_REQUESTERS],
    value: ALL_REQUESTERS,
    key: ALL_REQUESTERS,
  },
  {
    title: statusValToCopy[Requesters.GithubPRRequester],
    value: Requesters.GithubPRRequester,
    key: Requesters.GithubPRRequester,
  },
  {
    title: statusValToCopy[Requesters.PatchVersionRequester],
    value: Requesters.PatchVersionRequester,
    key: Requesters.PatchVersionRequester,
  },
];
