import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import {
  ImageToolchainsQuery,
  ImageToolchainsQueryVariables,
} from "gql/generated/types";
import { IMAGE_TOOLCHAINS } from "gql/queries";
import { ToolchainsTable } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider
    mocks={[
      imageToolchainsMock,
      imageToolchainsNextPageMock,
      imageToolchainsFilterMock,
    ]}
  >
    {children}
  </MockedProvider>
);

describe("toolchains table", () => {
  it("shows name field data", async () => {
    const { Component } = RenderFakeToastContext(
      <ToolchainsTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("toolchains-table-row")).toHaveLength(10);
    });
    const expectedNames = (
      imageToolchainsMock.result?.data?.image?.toolchains.data || []
    ).map(({ name }) => name);

    const rows = screen.getAllByDataCy("toolchains-table-row");
    expectedNames.forEach((expectedName, i) => {
      expect(within(rows[i]).getAllByRole("cell")[0]).toHaveTextContent(
        expectedName,
      );
    });
  });

  it("shows path field data", async () => {
    const { Component } = RenderFakeToastContext(
      <ToolchainsTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("toolchains-table-row")).toHaveLength(10);
    });
    const expectedPaths = (
      imageToolchainsMock.result?.data?.image?.toolchains.data || []
    ).map(({ path }) => path);

    const rows = screen.getAllByDataCy("toolchains-table-row");
    expectedPaths.forEach((expectedPath, i) => {
      expect(within(rows[i]).getAllByRole("cell")[1]).toHaveTextContent(
        expectedPath,
      );
    });
  });

  it("shows version field data", async () => {
    const { Component } = RenderFakeToastContext(
      <ToolchainsTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("toolchains-table-row")).toHaveLength(10);
    });
    const expectedVersions = (
      imageToolchainsMock.result?.data?.image?.toolchains.data || []
    ).map(({ version }) => version);

    const rows = screen.getAllByDataCy("toolchains-table-row");
    expectedVersions.forEach((expectedVersion, i) => {
      expect(within(rows[i]).getAllByRole("cell")[2]).toHaveTextContent(
        expectedVersion,
      );
    });
  });

  it("supports name filter", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <ToolchainsTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("toolchains-table-row")).toHaveLength(10);
    });
    await user.click(screen.getByDataCy("toolchain-name-filter"));
    await user.type(screen.getByPlaceholderText("Name regex"), "nodejs{enter}");
    await waitFor(() => {
      expect(screen.getAllByDataCy("toolchains-table-row")).toHaveLength(1);
    });
    expect(screen.getByText("1 - 1 of 1 item")).toBeInTheDocument();
  });

  it("supports pagination", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <ToolchainsTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("toolchains-table-row")).toHaveLength(10);
    });

    const nextPageButton = screen.getByTestId("lg-pagination-next-button");
    expect(nextPageButton).toHaveAttribute("aria-disabled", "false");
    await user.click(nextPageButton);
    await waitFor(() => {
      expect(screen.getAllByDataCy("toolchains-table-row")).toHaveLength(1);
    });
    expect(screen.getByText("11 - 11 of 11 items")).toBeInTheDocument();
  });
});

const imageToolchainsMock: ApolloMock<
  ImageToolchainsQuery,
  ImageToolchainsQueryVariables
> = {
  request: {
    query: IMAGE_TOOLCHAINS,
    variables: { imageId: "ubuntu2204", opts: { page: 0, limit: 10 } },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        toolchains: {
          __typename: "ImageToolchainsPayload",
          data: [
            {
              __typename: "Toolchain",
              name: "golang",
              path: "golang/go1.9",
              version: "go1.9",
            },
            {
              __typename: "Toolchain",
              name: "golang",
              path: "golang/go1.10",
              version: "go1.10",
            },
            {
              __typename: "Toolchain",
              name: "golang",
              path: "golang/go1.11",
              version: "go1.11",
            },
            {
              __typename: "Toolchain",
              name: "golang",
              path: "golang/go1.12",
              version: "go1.12",
            },
            {
              __typename: "Toolchain",
              name: "golang",
              path: "golang/go1.13",
              version: "go1.13",
            },
            {
              __typename: "Toolchain",
              name: "golang",
              path: "golang/go1.14",
              version: "go1.14",
            },
            {
              __typename: "Toolchain",
              name: "golang",
              path: "golang/go1.15",
              version: "go1.15",
            },
            {
              __typename: "Toolchain",
              name: "rubies",
              path: "rubies/ruby-3.1.4",
              version: "ruby-3.1.4",
            },
            {
              __typename: "Toolchain",
              name: "nodejs",
              path: "nodejs/toolchain_version_v16.17.0",
              version: "toolchain_version_v16.17.0",
            },
            {
              __typename: "Toolchain",
              name: "java",
              path: "java/jdk16.0.1",
              version: "jdk16.0.1",
            },
          ],
          filteredCount: 11,
          totalCount: 11,
        },
      },
    },
  },
};

const imageToolchainsNextPageMock: ApolloMock<
  ImageToolchainsQuery,
  ImageToolchainsQueryVariables
> = {
  request: {
    query: IMAGE_TOOLCHAINS,
    variables: { imageId: "ubuntu2204", opts: { page: 1, limit: 10 } },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        toolchains: {
          __typename: "ImageToolchainsPayload",
          data: [
            {
              __typename: "Toolchain",
              name: "java",
              path: "java/jdk17.0.2",
              version: "jdk17.0.2",
            },
          ],
          filteredCount: 11,
          totalCount: 11,
        },
      },
    },
  },
};

const imageToolchainsFilterMock: ApolloMock<
  ImageToolchainsQuery,
  ImageToolchainsQueryVariables
> = {
  request: {
    query: IMAGE_TOOLCHAINS,
    variables: {
      imageId: "ubuntu2204",
      opts: { page: 0, limit: 10, name: "nodejs" },
    },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        toolchains: {
          __typename: "ImageToolchainsPayload",
          data: [
            {
              __typename: "Toolchain",
              name: "nodejs",
              path: "nodejs/toolchain_version_v16.17.0",
              version: "toolchain_version_v16.17.0",
            },
          ],
          filteredCount: 1,
          totalCount: 11,
        },
      },
    },
  },
};
