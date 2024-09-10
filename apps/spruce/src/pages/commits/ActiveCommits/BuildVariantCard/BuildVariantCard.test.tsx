import { MockedProvider } from "@apollo/client/testing";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import {
  injectGlobalDimStyle,
  removeGlobalDimStyle,
} from "pages/commits/ActiveCommits/utils";
import { BuildVariantCard } from ".";

vi.mock("../utils");

describe("buildVariantCard", () => {
  it("should call the appropriate functions on hover and unhover", async () => {
    const mockIntersectionObserver = vi.fn((callback) => {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: mockIntersectionObserver,
    });
    vi.mocked(injectGlobalDimStyle).mockImplementationOnce(() => {
      Promise.resolve();
    });

    vi.mocked(removeGlobalDimStyle).mockImplementationOnce(() => {});

    const user = userEvent.setup();
    render(
      <MockedProvider>
        <BuildVariantCard
          buildVariantDisplayName="Ubuntu 22.04"
          height={100}
          order={1}
          projectIdentifier="testing"
          tasks={tasks}
          variant="ubuntu-2204"
          versionId="abc"
        />
      </MockedProvider>,
    );

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.hover(screen.queryByDataCy("build-variant-icon-container"));
    expect(injectGlobalDimStyle).toHaveBeenCalledTimes(1);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.unhover(screen.queryByDataCy("build-variant-icon-container"));
    expect(removeGlobalDimStyle).toHaveBeenCalledTimes(1);
  });
});

const tasks = [
  {
    id: "1",
    status: "failed",
    displayName: "One",
    hasCedarResults: true,
  },
  {
    id: "2",
    status: "success",
    displayName: "Two",
    hasCedarResults: true,
  },
  {
    id: "3",
    status: "success",
    displayName: "Three",
    hasCedarResults: true,
  },
];
