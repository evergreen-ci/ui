import { MultiLineSelectContextProvider } from "context/MultiLineSelectContext";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import SharingMenu from ".";

export default {
  component: SharingMenu,
} satisfies CustomMeta<typeof SharingMenu>;

export const Default: CustomStoryObj<typeof SharingMenu> = {
  argTypes: {},
  args: { defaultOpen: true },

  render: (args) => (
    <MultiLineSelectContextProvider>
      <SharingMenu {...args} />
    </MultiLineSelectContextProvider>
  ),
};
