import { MessageRenderer } from ".";

export default {
  component: MessageRenderer,
};

export const Default = {
  args: {
    parts: [
      {
        type: "text",
        text: "Is this the first time this task has failed?",
      },
    ],
    id: "123",
    role: "user",
  },
};

export const Agent = {
  argTypes: {
    toolState: {
      control: { type: "select" },
      options: ["output-error", "input-streaming", "output-available"],
      type: "string",
    },
  },
  args: {
    toolState: "output-available",
  },
  // @ts-expect-error
  render: ({ toolState }) => {
    const message = {
      id: "iHbTMI7vnSuBYpQ1",
      role: "assistant",
      parts: [
        {
          type: "tool-askEvergreenAgentTool",
          toolCallId: "call_w3dcpqbFvyZmIZMIv0k0qRXH",
          state: toolState,
        },
        {
          type: "text",
          text: 'The task spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12 has not failed before; its status has always been "success" in its history. This is not the first time it has run, but it has not previously failed.',
          state: "done",
        },
      ],
    };
    // @ts-expect-error
    return <MessageRenderer {...message} />;
  },
};
