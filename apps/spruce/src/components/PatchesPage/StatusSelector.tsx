import { TreeSelect } from "@evg-ui/lib/components";
import Dropdown from "components/Dropdown";
import { noFilterMessage } from "constants/strings";
import { useStatusesFilter } from "hooks";
import {
  PatchPageQueryParams,
  PatchStatus,
  ALL_PATCH_STATUS,
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
  [PatchStatus.Success]: "Succeeded",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
};

const treeData = [
  {
    title: statusValToCopy[ALL_PATCH_STATUS],
    value: ALL_PATCH_STATUS,
    key: ALL_PATCH_STATUS,
  },
  {
    title: statusValToCopy[PatchStatus.Success],
    value: PatchStatus.Success,
    key: PatchStatus.Success,
  },
  {
    title: statusValToCopy[PatchStatus.Created],
    value: PatchStatus.Created,
    key: PatchStatus.Created,
  },
  {
    title: statusValToCopy[PatchStatus.Started],
    value: PatchStatus.Started,
    key: PatchStatus.Started,
  },
  {
    title: statusValToCopy[PatchStatus.Failed],
    value: PatchStatus.Failed,
    key: PatchStatus.Failed,
  },
];
