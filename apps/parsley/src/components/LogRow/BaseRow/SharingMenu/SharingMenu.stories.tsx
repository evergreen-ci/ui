import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { MultiLineSelectContextProvider } from "context/MultiLineSelectContext";
import SharingMenu from ".";

export default {
  component: SharingMenu,
} satisfies CustomMeta<typeof SharingMenu>;

export const Default: CustomStoryObj<typeof SharingMenu> = {
  argTypes: {},
  args: { lineIndex: 0, lineNumber: 0, scrollToLine: () => {} },

  render: (args) => (
    <MultiLineSelectContextProvider>
      <SharingMenu {...args} />
    </MultiLineSelectContextProvider>
  ),
};
