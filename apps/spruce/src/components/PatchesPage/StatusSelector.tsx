import { TreeSelect } from "@evg-ui/lib/components/TreeSelect";
import Dropdown from "components/Dropdown";
import { noFilterMessage } from "constants/strings";
import { useStatusesFilter } from "hooks";
import {
  ALL_PATCH_STATUS,
  PatchPageQueryParams,
  PatchStatus,
} from "types/patch";

export const StatusSelector: React.FC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Statuses });

  return (
    <Dropdown
      buttonText={`Patch Status: ${
        statusVal.length
          ? // @ts-expect-error: FIXME. This comment was added by an automated script.
            statusVal.map((v) => statusValToCopy[v]).join(", ")
          : noFilterMessage
      }`}
      data-cy="my-patch-status-select"
    >
      <TreeSelect
        onChange={statusValOnChange}
        state={statusVal}
        tData={treeData}
      />
    </Dropdown>
  );
};

const statusValToCopy = {
  [ALL_PATCH_STATUS]: "All",
  [PatchStatus.Created]: "Created/Unconfigured",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
  [PatchStatus.Success]: "Succeeded",
};

const treeData = [
  {
    key: ALL_PATCH_STATUS,
    title: statusValToCopy[ALL_PATCH_STATUS],
    value: ALL_PATCH_STATUS,
  },
  {
    key: PatchStatus.Success,
    title: statusValToCopy[PatchStatus.Success],
    value: PatchStatus.Success,
  },
  {
    key: PatchStatus.Created,
    title: statusValToCopy[PatchStatus.Created],
    value: PatchStatus.Created,
  },
  {
    key: PatchStatus.Started,
    title: statusValToCopy[PatchStatus.Started],
    value: PatchStatus.Started,
  },
  {
    key: PatchStatus.Failed,
    title: statusValToCopy[PatchStatus.Failed],
    value: PatchStatus.Failed,
  },
];
