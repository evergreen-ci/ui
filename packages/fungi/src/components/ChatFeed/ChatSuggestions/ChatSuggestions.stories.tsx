import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import ChatSuggestions from ".";

export default {
  component: ChatSuggestions,
} satisfies CustomMeta<typeof ChatSuggestions>;

export const Default: CustomStoryObj<typeof ChatSuggestions> = {
  argTypes: {
    chatSuggestions: { control: "object" },
    handleSend: { action: "send" },
  },
  args: {
    chatSuggestions: ["Hello", "World", "How are you?"],
    handleSend: (message: string) => console.log(message),
  },
};
