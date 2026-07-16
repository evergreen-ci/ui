import { actions } from "storybook/actions";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import Breadcrumbs from ".";

export default {
  component: Breadcrumbs,
} satisfies CustomMeta<typeof Breadcrumbs>;

export const Default: CustomStoryObj<typeof Breadcrumbs> = {
  render: () => (
    <Breadcrumbs
      breadcrumbs={[
        {
          onClick: () => actions("Clicked first link"),
          text: "spruce",
          to: "/project/spruce/waterfall",
        },
        { text: "511232" },
      ]}
    />
  ),
};
