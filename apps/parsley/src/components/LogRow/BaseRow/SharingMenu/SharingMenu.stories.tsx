import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { MultiLineSelectContextProvider } from "context/MultiLineSelectContext";
import SharingMenu from ".";

export default {
  component: SharingMenu,
} satisfies CustomMeta<typeof SharingMenu>;

export const Default: CustomStoryObj<typeof SharingMenu> = {
  argTypes: {},
  args: { lineNumber: 0 },

  render: (args) => (
    <MultiLineSelectContextProvider>
      <SharingMenu {...args} />
    </MultiLineSelectContextProvider>
  ),
};
