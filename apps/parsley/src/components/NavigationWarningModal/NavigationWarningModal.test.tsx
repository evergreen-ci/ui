import {
  Link,
  Outlet,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import {
  render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { NavigationWarningModal, NavigationWarningModalProps } from "./index";

const getRouter = ({ shouldBlock }: NavigationWarningModalProps) =>
  createMemoryRouter(
    [
      {
        Component() {
          return (
            <div>
              <Link to="/about">About</Link>
              <NavigationWarningModal shouldBlock={shouldBlock} />
              <Outlet />
            </div>
          );
        },
        children: [
          {
            element: <h1>Home Page</h1>,
            path: "/",
          },
          {
            element: <h1>About Page</h1>,
            path: "/about",
          },
        ],
      },
    ],
    {
      initialEntries: ["/"],
    },
  );

describe("navigation warning", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("does not warn when navigating and shouldBlock is false", async () => {
    const router = getRouter({ shouldBlock: false });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/about");
    expect(
      screen.queryByDataCy("navigation-warning-modal"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).toHaveTextContent("About Page");
  });

  it("warns and shows the modal when shouldBlock is true", async () => {
    const router = getRouter({ shouldBlock: true });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByDataCy("navigation-warning-modal")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have an uploaded log open. If you navigate away, you will need to upload it again to view it.",
      ),
    ).toBeInTheDocument();
  });

  it("warns and shows the modal when a function is provided to shouldBlock", async () => {
    const router = getRouter({ shouldBlock: () => true });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByDataCy("navigation-warning-modal")).toBeInTheDocument();
  });

  it("navigates to the next page when 'Leave' button is clicked", async () => {
    const router = getRouter({ shouldBlock: true });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByDataCy("navigation-warning-modal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Leave" }));
    expect(router.state.location.pathname).toBe("/about");
    expect(screen.queryByRole("heading")).toHaveTextContent("About Page");
  });

  it("remains on the initial page when 'Cancel' button is clicked", async () => {
    const router = getRouter({ shouldBlock: true });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByDataCy("navigation-warning-modal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.queryByRole("heading")).toHaveTextContent("Home Page");
  });
});
