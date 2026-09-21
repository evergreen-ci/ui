import { MemoryRouter } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { OMIT_INACTIVE_WATERFALL_BUILDS } from "constants/cookies";
import { WaterfallMenu } from ".";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter initialEntries={["/project/spruce/waterfall"]}>
    {children}
  </MemoryRouter>
);

const renderWaterfallMenu = (props: {
  isWalkthroughMenuStep?: boolean;
  omitInactiveBuilds?: boolean;
  projectIdentifier?: string;
  restartWalkthrough?: () => void;
  setOmitInactiveBuilds?: (value: boolean) => void;
}) => {
  const {
    isWalkthroughMenuStep = false,
    omitInactiveBuilds = false,
    projectIdentifier = "spruce",
    restartWalkthrough = vi.fn(),
    setOmitInactiveBuilds = vi.fn(),
  } = props;

  const { Component } = RenderFakeToastContext(
    <MockedProvider>
      <WaterfallMenu
        isWalkthroughMenuStep={isWalkthroughMenuStep}
        omitInactiveBuilds={omitInactiveBuilds}
        projectIdentifier={projectIdentifier}
        restartWalkthrough={restartWalkthrough}
        setOmitInactiveBuilds={setOmitInactiveBuilds}
      />
    </MockedProvider>,
  );

  return render(<Component />, { wrapper: Wrapper });
};

describe("WaterfallMenu", () => {
  it("renders the menu button", async () => {
    const user = userEvent.setup();
    renderWaterfallMenu({});

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeVisible();
    });
  });

  it("renders the Settings section with OmitInactiveBuilds option", async () => {
    const user = userEvent.setup();
    renderWaterfallMenu({});

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Omit inactive builds: off")).toBeVisible();
    });
    expect(
      screen.getByRole("menuitem", { name: "Omit inactive builds: off" }),
    ).toBeVisible();
  });

  it("calls setOmitInactiveBuilds and updates localStorage when checkbox is toggled on", async () => {
    const setOmitInactiveBuilds = vi.fn();
    const user = userEvent.setup();
    const localStorageSpy = vi.spyOn(Storage.prototype, "setItem");

    renderWaterfallMenu({ setOmitInactiveBuilds });

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Omit inactive builds: off")).toBeVisible();
    });

    await user.click(screen.getByText("Omit inactive builds: off"));

    expect(setOmitInactiveBuilds).toHaveBeenCalledWith(true);
    expect(localStorageSpy).toHaveBeenCalledWith(
      OMIT_INACTIVE_WATERFALL_BUILDS,
      "true",
    );

    localStorageSpy.mockRestore();
  });

  it("calls setOmitInactiveBuilds and updates localStorage when checkbox is toggled off", async () => {
    const setOmitInactiveBuilds = vi.fn();
    const user = userEvent.setup();
    const localStorageSpy = vi.spyOn(Storage.prototype, "setItem");

    renderWaterfallMenu({ omitInactiveBuilds: true, setOmitInactiveBuilds });

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Omit inactive builds: on")).toBeVisible();
    });

    await user.click(screen.getByText("Omit inactive builds: on"));

    expect(setOmitInactiveBuilds).toHaveBeenCalledWith(false);
    expect(localStorageSpy).toHaveBeenCalledWith(
      OMIT_INACTIVE_WATERFALL_BUILDS,
      "false",
    );

    localStorageSpy.mockRestore();
  });

  it("renders all menu items", async () => {
    const user = userEvent.setup();
    renderWaterfallMenu({});

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Search by git hash")).toBeVisible();
    });

    expect(screen.getByText("Jump to most recent commit")).toBeVisible();
    expect(screen.getByText("Clear all filters")).toBeVisible();
    expect(screen.getByText("Add notification")).toBeVisible();
    expect(screen.getByText("Restart walkthrough")).toBeVisible();
    expect(screen.getByText("Settings")).toBeVisible();
  });

  it("opens for the walkthrough menu step", async () => {
    renderWaterfallMenu({ isWalkthroughMenuStep: true });

    expect(
      await screen.findByRole("menu", { name: "Waterfall menu" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Waterfall menu" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("calls restartWalkthrough when restart walkthrough is clicked", async () => {
    const restartWalkthrough = vi.fn();
    const user = userEvent.setup();

    renderWaterfallMenu({ restartWalkthrough });

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Restart walkthrough")).toBeVisible();
    });

    await user.click(screen.getByText("Restart walkthrough"));

    expect(restartWalkthrough).toHaveBeenCalled();
  });

  it("does not submit an invalid git hash with Enter", async () => {
    const user = userEvent.setup();
    renderWaterfallMenu({});

    await user.click(screen.getByRole("button", { name: "Waterfall menu" }));
    await user.click(screen.getByText("Search by git hash"));

    const dialog = await screen.findByTestId("git-commit-search-modal");
    const input = within(dialog).getByRole("textbox", {
      name: "Git Commit Hash",
    });
    await user.type(input, "short{Enter}");

    expect(dialog).toBeVisible();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("clears the git hash after the dialog closes", async () => {
    const user = userEvent.setup();
    renderWaterfallMenu({});

    await user.click(screen.getByRole("button", { name: "Waterfall menu" }));
    await user.click(screen.getByText("Search by git hash"));
    await user.type(
      within(await screen.findByTestId("git-commit-search-modal")).getByRole(
        "textbox",
        { name: "Git Commit Hash" },
      ),
      "abcdefg",
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Waterfall menu" }));
    await user.click(screen.getByText("Search by git hash"));

    expect(
      within(await screen.findByTestId("git-commit-search-modal")).getByRole(
        "textbox",
        { name: "Git Commit Hash" },
      ),
    ).toHaveValue("");
  });

  it.each([
    ["Search by git hash", "git-commit-search-modal"],
    ["Add notification", "waterfall-notification-modal"],
  ])("closes the menu when opening %s", async (menuItem, modalTestId) => {
    const user = userEvent.setup();
    renderWaterfallMenu({});

    const menuButton = screen.getByRole("button", { name: "Waterfall menu" });
    await user.click(menuButton);
    await user.click(screen.getByText(menuItem));

    expect(await screen.findByTestId(modalTestId)).toBeVisible();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
