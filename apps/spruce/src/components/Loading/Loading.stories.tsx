import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { PatchAndTaskFullPageLoad } from "./PatchAndTaskFullPageLoad";

export default {
  title: "components/PatchAndTaskFullPageLoad",
} satisfies CustomMeta<typeof PatchAndTaskFullPageLoad>;

export const Default: CustomStoryObj<typeof PatchAndTaskFullPageLoad> = {
  render: (args) => <PatchAndTaskFullPageLoad {...args} />,
};
