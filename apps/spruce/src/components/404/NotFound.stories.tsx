import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";

import NotFoundSvg from "./NotFoundSvg";

export default {
  component: NotFoundSvg,
} satisfies CustomMeta<typeof NotFoundSvg>;

export const Default404: CustomStoryObj<typeof NotFoundSvg> = {
  render: () => (
    <div style={{ height: "100%", width: "100%" }}>
      <NotFoundSvg />
    </div>
  ),
};
