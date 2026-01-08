import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  waitFor,
  within,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/types/gql";
import {
  ImageOperatingSystemQuery,
  ImageOperatingSystemQueryVariables,
} from "gql/generated/types";
import { IMAGE_OPERATING_SYSTEM } from "gql/queries";
import { OperatingSystemTable } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider
    mocks={[
      imageOperatingSystemMock,
      imageOperatingSystemNextPageMock,
      imageOperatingSystemNameFilterMock,
    ]}
  >
    {children}
  </MockedProvider>
);

describe("operating system table", () => {
  it("shows name field data", async () => {
    const { Component } = RenderFakeToastContext(
      <OperatingSystemTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("os-table-row")).toHaveLength(10);
    });
    const expectedNames = (
      imageOperatingSystemMock.result?.data?.image?.operatingSystem.data || []
    ).map(({ name }) => name);

    const rows = screen.getAllByDataCy("os-table-row");
    expectedNames.forEach((expectedName, i) => {
      expect(within(rows[i]).getAllByRole("cell")[0]).toHaveTextContent(
        expectedName,
      );
    });
  });

  it("shows version field data", async () => {
    const { Component } = RenderFakeToastContext(
      <OperatingSystemTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("os-table-row")).toHaveLength(10);
    });
    const expectedVersions = (
      imageOperatingSystemMock.result?.data?.image?.operatingSystem.data || []
    ).map(({ version }) => version);

    const rows = screen.getAllByDataCy("os-table-row");
    expectedVersions.forEach((expectedVersion, i) => {
      expect(within(rows[i]).getAllByRole("cell")[1]).toHaveTextContent(
        expectedVersion,
      );
    });
  });

  it("supports name filter", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <OperatingSystemTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("os-table-row")).toHaveLength(10);
    });
    await user.click(screen.getByDataCy("os-name-filter"));
    await user.type(
      screen.getByPlaceholderText("Name regex"),
      "^Kernel{enter}",
    );
    await waitFor(() => {
      expect(screen.queryAllByDataCy("os-table-row")).toHaveLength(1);
    });
    expect(screen.getByText("1 - 1 of 1 item")).toBeInTheDocument();
  });

  it("supports pagination", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <OperatingSystemTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("os-table-row")).toHaveLength(10);
    });
    await user.click(screen.getByTestId("lg-pagination-next-button"));
    await waitFor(() => {
      expect(screen.queryAllByDataCy("os-table-row")).toHaveLength(1);
    });
    expect(screen.getByText("11 - 11 of 11 items")).toBeInTheDocument();
  });
});

const imageOperatingSystemMock: ApolloMock<
  ImageOperatingSystemQuery,
  ImageOperatingSystemQueryVariables
> = {
  request: {
    query: IMAGE_OPERATING_SYSTEM,
    variables: { imageId: "ubuntu2204", opts: { page: 0, limit: 10 } },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        operatingSystem: {
          __typename: "ImageOperatingSystemPayload",
          data: [
            {
              __typename: "OSInfo",
              name: "NAME",
              version: "Ubuntu",
            },
            {
              __typename: "OSInfo",

              name: "PRETTY_NAME",
              version: "Ubuntu 22.04",
            },
            {
              __typename: "OSInfo",
              name: "VERSION",
              version: "22.04",
            },
            {
              __typename: "OSInfo",
              name: "VERSION_ID",
              version: "22.04",
            },
            {
              __typename: "OSInfo",
              name: "ID",
              version: "ubuntu",
            },
            {
              __typename: "OSInfo",
              name: "ID_LIKE",
              version: "ubuntu",
            },
            {
              __typename: "OSInfo",
              name: "Kernel",
              version: "123457.89.0",
            },
            {
              __typename: "OSInfo",
              name: "LOGO",
              version: "ubuntu-icon",
            },
            {
              __typename: "OSInfo",
              name: "HOME_URL",
              version: "home-url",
            },
            {
              __typename: "OSInfo",
              name: "DOCUMENTATION_URL",
              version: "documentation-url",
            },
          ],
          filteredCount: 11,
          totalCount: 11,
        },
      },
    },
  },
};

const imageOperatingSystemNextPageMock: ApolloMock<
  ImageOperatingSystemQuery,
  ImageOperatingSystemQueryVariables
> = {
  request: {
    query: IMAGE_OPERATING_SYSTEM,
    variables: { imageId: "ubuntu2204", opts: { page: 1, limit: 10 } },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        operatingSystem: {
          __typename: "ImageOperatingSystemPayload",
          data: [
            {
              __typename: "OSInfo",
              name: "BUG_REPORT_URL",
              version: "bug-report-url",
            },
          ],
          filteredCount: 11,
          totalCount: 11,
        },
      },
    },
  },
};

const imageOperatingSystemNameFilterMock: ApolloMock<
  ImageOperatingSystemQuery,
  ImageOperatingSystemQueryVariables
> = {
  request: {
    query: IMAGE_OPERATING_SYSTEM,
    variables: {
      imageId: "ubuntu2204",
      opts: { page: 0, limit: 10, name: "^Kernel" },
    },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        operatingSystem: {
          __typename: "ImageOperatingSystemPayload",
          data: [
            {
              __typename: "OSInfo",
              name: "Kernel",
              version: "123457.89.0",
            },
          ],
          filteredCount: 1,
          totalCount: 11,
        },
      },
    },
  },
};
