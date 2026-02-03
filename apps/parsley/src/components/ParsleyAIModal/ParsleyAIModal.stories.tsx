import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { ParsleyAIModal } from ".";

export default {
  component: ParsleyAIModal,
} satisfies CustomMeta<typeof ParsleyAIModal>;

export const Default = {
  args: {
    open: true,
    setOpen: () => {},
  },
} satisfies CustomStoryObj<typeof ParsleyAIModal>;
