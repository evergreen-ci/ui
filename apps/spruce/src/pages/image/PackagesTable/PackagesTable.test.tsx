import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  waitFor,
  within,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  ImagePackagesQuery,
  ImagePackagesQueryVariables,
} from "gql/generated/types";
import { IMAGE_PACKAGES } from "gql/queries";
import { PackagesTable } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider
    mocks={[
      imagePackagesPageOneMock,
      imagePackagesNameFilterMock,
      imagePackagesPageTwoMock,
    ]}
  >
    {children}
  </MockedProvider>
);

describe("packages table", () => {
  it("shows name field data", async () => {
    const { Component } = RenderFakeToastContext(
      <PackagesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(10);
    });
    const expectedNames = (
      imagePackagesPageOneMock.result?.data?.image?.packages.data || []
    ).map(({ name }) => name);

    const rows = screen.getAllByDataCy("packages-table-row");
    expectedNames.forEach((expectedName, i) => {
      expect(within(rows[i]).getAllByRole("cell")[0]).toHaveTextContent(
        expectedName,
      );
    });
  });

  it("shows manager field data", async () => {
    const { Component } = RenderFakeToastContext(
      <PackagesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(10);
    });
    const rows = screen.getAllByDataCy("packages-table-row");
    for (let i = 0; i < 10; i++) {
      expect(within(rows[i]).getAllByRole("cell")[1]).toHaveTextContent(
        "pip 22.0.2 from (python 3.10)",
      );
    }
  });

  it("shows version field data", async () => {
    const { Component } = RenderFakeToastContext(
      <PackagesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(10);
    });
    const expectedVersions = (
      imagePackagesPageOneMock.result?.data?.image?.packages.data || []
    ).map(({ version }) => version);

    const rows = screen.getAllByDataCy("packages-table-row");
    expectedVersions.forEach((expectedVersion, i) => {
      expect(within(rows[i]).getAllByRole("cell")[2]).toHaveTextContent(
        expectedVersion,
      );
    });
  });

  it("supports name filter", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <PackagesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(10);
    });
    await user.click(screen.getByDataCy("package-name-filter"));
    await user.type(screen.getByPlaceholderText("Name regex"), "bcrypt{enter}");
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(1);
    });
    expect(screen.getByText("1 - 1 of 1 item")).toBeInTheDocument();
  });

  it("supports pagination", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <PackagesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(10);
    });
    await user.click(screen.getByTestId("lg-pagination-next-button"));
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(5);
    });
    expect(screen.getByText("11 - 15 of 15 items")).toBeInTheDocument();
  });
});

const imagePackagesPageOneMock: ApolloMock<
  ImagePackagesQuery,
  ImagePackagesQueryVariables
> = {
  request: {
    query: IMAGE_PACKAGES,
    variables: {
      imageId: "ubuntu2204",
      opts: {
        page: 0,
        limit: 10,
      },
    },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        packages: {
          __typename: "ImagePackagesPayload",
          data: [
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "alabaster",
              version: "0.7.12",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "attrs",
              version: "21.2.0",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "Automat",
              version: "20.2.0",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "Babel",
              version: "2.8.0",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "bcrypt",
              version: "3.2.0",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "beautifulsoup4",
              version: "4.10.0",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "blinker",
              version: "1.4",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "breezy",
              version: "3.2.1",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "certifi",
              version: "2020.6.20",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "chardet",
              version: "4.0.0",
            },
          ],
          filteredCount: 15,
          totalCount: 15,
        },
      },
    },
  },
};

const imagePackagesNameFilterMock: ApolloMock<
  ImagePackagesQuery,
  ImagePackagesQueryVariables
> = {
  request: {
    query: IMAGE_PACKAGES,
    variables: {
      imageId: "ubuntu2204",
      opts: {
        page: 0,
        limit: 10,
        name: "bcrypt",
      },
    },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        packages: {
          __typename: "ImagePackagesPayload",
          data: [
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "bcrypt",
              version: "3.2.0",
            },
          ],
          filteredCount: 1,
          totalCount: 15,
        },
      },
    },
  },
};

const imagePackagesPageTwoMock: ApolloMock<
  ImagePackagesQuery,
  ImagePackagesQueryVariables
> = {
  request: {
    query: IMAGE_PACKAGES,
    variables: {
      imageId: "ubuntu2204",
      opts: {
        page: 1,
        limit: 10,
      },
    },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        packages: {
          __typename: "ImagePackagesPayload",
          data: [
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "click",
              version: "8.0.3",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "cloud-init",
              version: "22.3.4",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "colorama",
              version: "0.4.4",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "command-not-found",
              version: "0.3",
            },
            {
              __typename: "Package",
              manager: "pip 22.0.2 from (python 3.10)",
              name: "configobj",
              version: "5.0.6",
            },
          ],
          filteredCount: 15,
          totalCount: 15,
        },
      },
    },
  },
};
