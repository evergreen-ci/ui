import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { FullPageLoad } from ".";

export default {
  component: FullPageLoad,
} satisfies CustomMeta<typeof FullPageLoad>;

export const Default: CustomStoryObj<typeof FullPageLoad> = {};
