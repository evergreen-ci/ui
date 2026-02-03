import {
  render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import * as ErrorReporting from "@evg-ui/lib/utils";
import {
  WalkthroughGuideCue,
  WalkthroughStep,
  WalkthroughGuideCueProps,
} from ".";

describe("walkthrough guide cue", async () => {
  beforeEach(() => {
    vi.spyOn(ErrorReporting, "reportError");
  });

  beforeAll(() => {
    stubGetClientRects();
    vi.clearAllMocks();
  });

  const walkthroughSteps: WalkthroughStep[] = [
    {
      title: "Step 1",
      description: "this is step 1",
      targetId: "step-1",
    },
    {
      title: "Step 2",
      description: "this is step 2",
      targetId: "step-2",
    },
  ];

  const GuideCueWalkthroughContent = (
    props: Pick<
      WalkthroughGuideCueProps,
      "defaultOpen" | "onClose" | "walkthroughSteps"
    >,
  ) => (
    <div>
      <button data-guide-cue-id="step-1" type="submit">
        button
      </button>
      <div data-guide-cue-id="step-2">div</div>
      <WalkthroughGuideCue
        dataAttributeName="data-guide-cue-id"
        defaultOpen
        onClose={props.onClose}
        walkthroughSteps={props.walkthroughSteps}
      />
    </div>
  );

  const guideCueIsVisible = async () =>
    waitFor(() => {
      expect(screen.getByDataCy("walkthrough-guide-cue")).toBeVisible();
    });

  const backdropIsVisible = async () =>
    waitFor(() => {
      expect(screen.getByDataCy("walkthrough-backdrop")).toBeVisible();
    });

  const guideCueIsNotVisible = async () =>
    waitFor(() => {
      expect(screen.queryByDataCy("walkthrough-guide-cue")).toBeNull();
    });

  const backdropIsNotVisible = async () =>
    waitFor(() => {
      expect(screen.queryByDataCy("walkthrough-guide-cue")).toBeNull();
    });

  it("should not open guide cue if defaultOpen is false", async () => {
    render(
      <GuideCueWalkthroughContent
        defaultOpen={false}
        onClose={vi.fn()}
        walkthroughSteps={walkthroughSteps}
      />,
    );
    await guideCueIsNotVisible();
    await backdropIsNotVisible();
  });

  it("should call onClose function when walkthrough ends", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <GuideCueWalkthroughContent
        defaultOpen
        onClose={onClose}
        walkthroughSteps={walkthroughSteps.slice(0, 1)}
      />,
    );
    await guideCueIsVisible();
    await backdropIsVisible();
    const closeButton = screen.getByRole("button", { name: "Get started" });
    expect(closeButton).toBeVisible();
    await user.click(closeButton);
    await guideCueIsNotVisible();
    await backdropIsNotVisible();
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("backdrop should only be visible when walkthrough is active", async () => {
    const user = userEvent.setup();
    render(
      <GuideCueWalkthroughContent
        defaultOpen
        onClose={vi.fn()}
        walkthroughSteps={walkthroughSteps.slice(0, 1)}
      />,
    );
    await guideCueIsVisible();
    await backdropIsVisible();
    const closeButton = screen.getByRole("button", { name: "Get started" });
    expect(closeButton).toBeVisible();
    await user.click(closeButton);
    await guideCueIsNotVisible();
    await backdropIsNotVisible();
  });

  it("can end walkthrough using the dismiss button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <GuideCueWalkthroughContent
        defaultOpen
        onClose={onClose}
        walkthroughSteps={walkthroughSteps}
      />,
    );
    await guideCueIsVisible();
    await backdropIsVisible();
    const dismissButton = screen.getByRole("button", { name: "Close Tooltip" });
    await user.click(dismissButton);
    await guideCueIsNotVisible();
    await backdropIsNotVisible();
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("can go through all walkthrough steps", async () => {
    const user = userEvent.setup();
    render(
      <GuideCueWalkthroughContent
        defaultOpen
        onClose={vi.fn()}
        walkthroughSteps={walkthroughSteps}
      />,
    );

    // Should see Step 1.
    await guideCueIsVisible();
    await backdropIsVisible();
    expect(screen.getByText("Step 1")).toBeVisible();

    // Click the next button.
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeVisible();
    await user.click(nextButton);
    await guideCueIsNotVisible();
    await backdropIsVisible();

    // Should see Step 2.
    await guideCueIsVisible();
    expect(screen.getByText("Step 2")).toBeVisible();

    // Close guide cue.
    const closeButton = screen.getByRole("button", { name: "Get started" });
    expect(closeButton).toBeVisible();
    await user.click(closeButton);
    await guideCueIsNotVisible();
    await backdropIsNotVisible();
  });

  it("closes the walkthrough if the next step cannot be found", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <div>
        <div data-guide-cue-id="step-1">div</div>
        <WalkthroughGuideCue
          dataAttributeName="data-guide-cue-id"
          defaultOpen
          onClose={onClose}
          walkthroughSteps={walkthroughSteps}
        />
      </div>,
    );

    // Should see Step 1.
    await guideCueIsVisible();
    await backdropIsVisible();
    expect(screen.getByText("Step 1")).toBeVisible();

    // Step 2 cannot be found, so the walkthrough should end.
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeVisible();
    await user.click(nextButton);
    await guideCueIsNotVisible();
    await backdropIsNotVisible();
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    // Errors should be reported.
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(ErrorReporting.reportError).toHaveBeenCalledTimes(1);
    expect(ErrorReporting.reportError).toHaveBeenCalledWith(
      new Error("Cannot find element for the next step in walkthrough: step-2"),
    );
  });
});
