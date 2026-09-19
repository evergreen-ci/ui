import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { PatchStatus } from "types/patch";
import { PatchStatusBadge } from "./PatchStatusBadge";

export default {
  component: PatchStatusBadge,
} satisfies CustomMeta<typeof PatchStatusBadge>;

export const AllStatuses: CustomStoryObj<typeof PatchStatusBadge> = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      {Object.values(PatchStatus).map((status) => (
        <PatchStatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};
