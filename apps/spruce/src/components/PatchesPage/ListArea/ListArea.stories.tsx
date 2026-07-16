import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { patchData } from "./testData";
import ListArea from ".";

const patches = new Array(4).fill(patchData);
export default {
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
  component: ListArea,
} satisfies CustomMeta<typeof ListArea>;

export const Default: CustomStoryObj<typeof ListArea> = {
  args: {
    patches,
  },
  argTypes: {},
  render: (args) => <ListArea {...args} />,
};

export const Empty: CustomStoryObj<typeof ListArea> = {
  args: {
    patches: [],
  },
  argTypes: {},
  render: (args) => <ListArea {...args} />,
};
