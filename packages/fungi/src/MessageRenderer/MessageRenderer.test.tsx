import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { FungiUIMessage, MessageRenderer } from ".";

const dislikeLabel = "Dislike this message";
const likeLabel = "Like this message";

describe("MessageRenderer", () => {
  describe("MessageEvaluation", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    describe("assistant message", () => {
      it("does not show a rating button when there is no onclick handler", () => {
        render(<MessageRenderer {...assistantMessage()} />);
        expect(screen.queryByLabelText(dislikeLabel)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(likeLabel)).not.toBeInTheDocument();
      });

      it("does not show a rating button when there is no onclick handler", () => {
        const ratingMock = vi.fn();
        render(
          <MessageRenderer
            {...assistantMessage("streaming")}
            onRatingChange={ratingMock}
          />,
        );
        expect(screen.queryByLabelText(dislikeLabel)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(likeLabel)).not.toBeInTheDocument();
      });

      it("clicks button when message is streamed and there is a handler", async () => {
        const user = userEvent.setup();
        const ratingMock = vi.fn();
        render(
          <MessageRenderer
            {...assistantMessage()}
            onRatingChange={ratingMock}
          />,
        );
        expect(screen.getByLabelText(dislikeLabel)).toBeVisible();
        expect(screen.getByLabelText(likeLabel)).toBeVisible();

        await user.click(screen.getByLabelText(likeLabel));
        expect(ratingMock).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ target: expect.anything() }),
          { rating: "liked" },
        );

        await user.click(screen.getByLabelText(dislikeLabel));
        expect(ratingMock).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ target: expect.anything() }),
          { rating: "disliked" },
        );
      });
    });

    describe("user message", () => {
      it("does not show feedback buttons for user messages", () => {
        const ratingMock = vi.fn();
        render(
          <MessageRenderer {...userMessage} onRatingChange={ratingMock} />,
        );
        expect(screen.queryByLabelText(dislikeLabel)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(likeLabel)).not.toBeInTheDocument();
      });
    });
  });
});

const userMessage: FungiUIMessage = {
  parts: [
    {
      state: "done",
      type: "text",
      text: "Is this the first time this task has failed?",
    },
  ],
  id: "123",
  role: "user",
};

const assistantMessage = (
  state: "streaming" | "done" | undefined = "done",
): FungiUIMessage => ({
  id: "iHbTMI7vnSuBYpQ1",
  role: "assistant",
  parts: [
    {
      state,
      type: "text",
      text: 'The task spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12 has not failed before; its status has always been "success" in its history. This is not the first time it has run, but it has not previously failed.',
    },
  ],
});
