import { actions } from "storybook/actions";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import Breadcrumbs from ".";

export default {
  component: Breadcrumbs,
} satisfies CustomMeta<typeof Breadcrumbs>;

export const Default: CustomStoryObj<typeof Breadcrumbs> = {
  render: () => (
    <Breadcrumbs
      breadcrumbs={[
        {
          text: "spruce",
          to: "/project/spruce/waterfall",
          onClick: () => actions("Clicked first link"),
        },
        { text: "511232" },
      ]}
    />
  ),
};
