import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import ListArea from ".";
import { patchData } from "./testData";

const patches = new Array(4).fill(patchData);
export default {
  component: ListArea,
  args: {
    loading: false,
    pageType: "project",
  },
  argTypes: {
    pageType: {
      control: "radio",
      options: ["project", "user"],
    },
  },
} satisfies CustomMeta<typeof ListArea>;

export const Default: CustomStoryObj<typeof ListArea> = {
  render: (args) => <ListArea {...args} />,
  argTypes: {},
  args: {
    patches,
  },
};

export const Empty: CustomStoryObj<typeof ListArea> = {
  render: (args) => <ListArea {...args} />,
  argTypes: {},
  args: {
    patches: [],
  },
};
