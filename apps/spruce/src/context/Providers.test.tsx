import { Link } from "@via-ds/components/typography";
import {
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import ContextProviders from "context/Providers";

// GQLWrapper blocks rendering children on a network fetch that never resolves in jsdom.
vi.mock("gql/GQLWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("ContextProviders", () => {
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

  it("leaves absolute and non-http hrefs untouched", () => {
    renderWithRouterMatch(
      <ContextProviders>
        <Link href="https://docs.devprod.mongodb.com/evergreen">Docs</Link>
        <Link href="mailto:evergreen@mongodb.com">Email</Link>
      </ContextProviders>,
      { path: "/*", route: "/version/abc/tasks" },
    );

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "https://docs.devprod.mongodb.com/evergreen",
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:evergreen@mongodb.com",
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
