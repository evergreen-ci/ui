import Button from "@leafygreen-ui/button";
import { Link } from "@via-ds/components/typography";
import {
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import ContextProviders from "context/Providers";

// GQLWrapper fetches secret fields over the network before it renders children,
// which never resolves in jsdom.
vi.mock("gql/GQLWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("ContextProviders", () => {
  it("renders Via and LeafyGreen components side by side", () => {
    renderWithRouterMatch(
      <ContextProviders>
        <Link href="/hosts">Via link</Link>
        <Button>LeafyGreen button</Button>
      </ContextProviders>,
    );

    expect(screen.getByText("Via link")).toBeInTheDocument();
    expect(screen.getByText("LeafyGreen button")).toBeInTheDocument();
  });

  it("applies the light color scheme to the Via provider root", () => {
    renderWithRouterMatch(
      <ContextProviders>
        <Link href="/hosts">Via link</Link>
      </ContextProviders>,
    );

    expect(document.querySelector("[data-via-provider]")).toHaveAttribute(
      "data-color-scheme",
      "light",
    );
  });

  it("routes Via links through react-router rather than reloading the page", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(
      <ContextProviders>
        <Link href="/hosts">Via link</Link>
      </ContextProviders>,
    );

    await user.click(screen.getByText("Via link"));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/hosts");
    });
  });
});
