import { CustomMeta, CustomStoryObj } from "test_utils/types";
import ListArea from ".";
import { patchData } from "./testData";

const patches = new Array(4).fill(patchData);
export default {
  component: ListArea,
} satisfies CustomMeta<typeof ListArea>;

export const Default: CustomStoryObj<typeof ListArea> = {
  render: (args) => <ListArea {...args} />,
  argTypes: {},
  args: {
    patches: { patches, filteredPatchCount: 4 },
    loading: false,
  },
};

export const Empty: CustomStoryObj<typeof ListArea> = {
  render: (args) => <ListArea {...args} />,
  argTypes: {},
  args: {
    patches: { patches: [], filteredPatchCount: 0 },
    loading: false,
  },
};
