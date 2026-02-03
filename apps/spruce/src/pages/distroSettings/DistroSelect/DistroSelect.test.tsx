import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  ApolloMock,
} from "@evg-ui/lib/test_utils";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";
import { DISTROS } from "gql/queries";
import { DistroSelect } from ".";

const wrapper = ({ children }: React.PropsWithChildren) => (
  <MockedProvider mocks={[distrosMock]}>{children}</MockedProvider>
);

describe("distro select", () => {
  it("shows distro name as dropdown content", async () => {
    render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue("localhost")).toBeVisible();
    });
  });

  it("selecting a different distro will navigate to the correct URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
      route: "/distro/localhost/settings/general",
      path: "/distro/:distroId/settings/:tab",
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Distro"));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeVisible();
    });
    await user.click(screen.getByText("abc"));
    expect(screen.queryByRole("listbox")).not.toBeVisible();
    expect(router.state.location.pathname).toBe("/distro/abc/settings/general");
  });

  it("typing in the text input will narrow down search results", async () => {
    const user = userEvent.setup();
    render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Distro"));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeVisible();
    });

    expect(screen.getAllByRole("option")).toHaveLength(3);
    await user.clear(screen.getByPlaceholderText("Select distro"));
    await user.type(screen.getByPlaceholderText("Select distro"), "abc");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("searching for an alias returns related distros", async () => {
    const user = userEvent.setup();
    render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Distro"));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeVisible();
    });

    expect(screen.getAllByRole("option")).toHaveLength(3);
    await user.clear(screen.getByPlaceholderText("Select distro"));
    await user.type(
      screen.getByPlaceholderText("Select distro"),
      "alphabetical",
    );
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });
});

const distrosMock: ApolloMock<DistrosQuery, DistrosQueryVariables> = {
  request: {
    query: DISTROS,
    variables: { onlySpawnable: false },
  },
  result: {
    data: {
      distros: [
        {
          __typename: "Distro",
          adminOnly: false,
          aliases: [],
          availableRegions: [],
          isVirtualWorkStation: true,
          name: "localhost",
        },
        {
          __typename: "Distro",
          adminOnly: true,
          aliases: [],
          availableRegions: [],
          isVirtualWorkStation: false,
          name: "localhost2",
        },
        {
          __typename: "Distro",
          aliases: ["alphabetical"],
          adminOnly: true,
          availableRegions: [],
          isVirtualWorkStation: true,
          name: "abc",
        },
      ],
    },
  },
};
