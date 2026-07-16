import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { MessageRenderer } from ".";

export default {
  component: MessageRenderer,
} satisfies CustomMeta<typeof MessageRenderer>;

export const Default = {
  args: {
    id: "123",
    metadata: {
      chips: [
        {
          badgeLabel: "Line 1",
          content: "console.log('hello')",
          identifier: "test-1",
        },
        {
          badgeLabel: "Lines 3-5",
          content: "console.log('world')",
          identifier: "test-2",
        },
      ],
      originalMessage: "Is this the first time this task has failed?",
    },
    parts: [
      {
        text: "Is this the first time this task has failed?",
        type: "text",
      },
    ],
    role: "user",
  },
} satisfies CustomStoryObj<typeof MessageRenderer>;

export const Agent = {
  // @ts-expect-error - toolState is a custom storybook arg, not a MessageRenderer prop
  render: ({ toolState = "output-available" }: { toolState?: string }) => {
    const message = {
      id: "iHbTMI7vnSuBYpQ1",
      parts: [
        {
          state: toolState,
          toolCallId: "call_w3dcpqbFvyZmIZMIv0k0qRXH",
          type: "tool-askEvergreenAgentTool",
        },
        {
          text: 'The task spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12 has not failed before; its status has always been "success" in its history. This is not the first time it has run, but it has not previously failed.',
          type: "text",
        },
      ],
      role: "assistant",
    };
    // @ts-expect-error - message structure doesn't match exact MessageRenderer props
    return <MessageRenderer {...message} />;
  },
} satisfies CustomStoryObj<typeof MessageRenderer>;
