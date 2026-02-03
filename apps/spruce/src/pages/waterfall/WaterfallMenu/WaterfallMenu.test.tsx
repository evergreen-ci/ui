import { MemoryRouter } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { WaterfallMenu } from ".";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter initialEntries={["/project/spruce/waterfall"]}>
    {children}
  </MemoryRouter>
);

const renderWaterfallMenu = (props: {
  omitInactiveBuilds?: boolean;
  projectIdentifier?: string;
  restartWalkthrough?: () => void;
  setOmitInactiveBuilds?: (value: boolean) => void;
}) => {
  const {
    omitInactiveBuilds = false,
    projectIdentifier = "spruce",
    restartWalkthrough = vi.fn(),
    setOmitInactiveBuilds = vi.fn(),
  } = props;

  const { Component } = RenderFakeToastContext(
    <MockedProvider>
      <WaterfallMenu
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
      expect(screen.getByText("Omit inactive builds")).toBeVisible();
    });
  });

  it("calls setOmitInactiveBuilds when checkbox is toggled", async () => {
    const setOmitInactiveBuilds = vi.fn();
    const user = userEvent.setup();

    renderWaterfallMenu({ setOmitInactiveBuilds });

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Omit inactive builds")).toBeVisible();
    });

    await user.click(screen.getByText("Omit inactive builds"));

    expect(setOmitInactiveBuilds).toHaveBeenCalledWith(true);
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
});
