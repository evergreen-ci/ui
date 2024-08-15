import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ImagePackagesQuery,
  ImagePackagesQueryVariables,
} from "gql/generated/types";
import { IMAGE_PACKAGES } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  waitFor,
  within,
  userEvent,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { PackagesTable } from ".";

describe("packages table", () => {
  it("shows name field data", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[imagePackagesPageOneMock]}>
        <PackagesTable />
      </MockedProvider>,
    );
    render(<Component />);
    await waitFor(() => {
      expect(screen.getByDataCy("packages-table-card")).toBeInTheDocument();
    });
    const card = screen.getByDataCy("packages-table-card");
    const expectedNames = [
      "alabaster",
      "attrs",
      "Automat",
      "Babel",
      "bcrypt",
      "beautifulsoup4",
      "blinker",
      "breezy",
      "certifi",
      "chardet",
    ];
    const rows = within(card).getAllByDataCy("packages-table-row");
    for (let i = 0; i < expectedNames.length; i++) {
      expect(within(rows[i]).getAllByRole("cell")[0]).toHaveTextContent(
        expectedNames[i],
      );
    }
  });

  it("shows manager field data", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[imagePackagesPageOneMock]}>
        <PackagesTable />
      </MockedProvider>,
    );
    render(<Component />);
    await waitFor(() => {
      expect(screen.getByDataCy("packages-table-card")).toBeInTheDocument();
    });
    const card = screen.getByDataCy("packages-table-card");
    const rows = within(card).getAllByDataCy("packages-table-row");
    for (let i = 0; i < 10; i++) {
      expect(within(rows[i]).getAllByRole("cell")[1]).toHaveTextContent(
        "pip 22.0.2 from (python 3.10)",
      );
    }
  });

  it("shows version field data", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[imagePackagesPageOneMock]}>
        <PackagesTable />
      </MockedProvider>,
    );
    render(<Component />);
    await waitFor(() => {
      expect(screen.getByDataCy("packages-table-card")).toBeInTheDocument();
    });
    const card = screen.getByDataCy("packages-table-card");
    const expectedNames = [
      "0.7.12",
      "21.2.0",
      "20.2.0",
      "2.8.0",
      "3.2.0",
      "4.10.0",
      "1.4",
      "3.2.1",
      "2020.6.20",
      "4.0.0",
    ];
    const rows = within(card).getAllByDataCy("packages-table-row");
    for (let i = 0; i < expectedNames.length; i++) {
      expect(within(rows[i]).getAllByRole("cell")[2]).toHaveTextContent(
        expectedNames[i],
      );
    }
  });

  it("supports name filter", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[imagePackagesPageOneMock, imagePackagesNameFilterMock]}
      >
        <PackagesTable />
      </MockedProvider>,
    );
    render(<Component />);
    await waitFor(() => {
      expect(screen.getByDataCy("packages-table-card")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(10);
    });
    await user.click(screen.getByDataCy("package-name-filter"));
    await user.type(
      screen.getByPlaceholderText("Search name"),
      "bcrypt{enter}",
    );
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(1);
    });
  });

  it("supports pagination", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[imagePackagesPageOneMock, imagePackagesPageTwoMock]}
      >
        <PackagesTable />
      </MockedProvider>,
    );
    render(<Component />);
    await waitFor(() => {
      expect(screen.getByDataCy("packages-table-card")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(10);
    });
    await user.click(screen.getByTestId("lg-pagination-next-button"));
    await waitFor(() => {
      expect(screen.queryAllByDataCy("packages-table-row")).toHaveLength(5);
    });
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
        id: "ubuntu2204",
        packages: {
          data: [
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "alabaster",
              version: "0.7.12",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "attrs",
              version: "21.2.0",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "Automat",
              version: "20.2.0",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "Babel",
              version: "2.8.0",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "bcrypt",
              version: "3.2.0",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "beautifulsoup4",
              version: "4.10.0",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "blinker",
              version: "1.4",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "breezy",
              version: "3.2.1",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "certifi",
              version: "2020.6.20",
            },
            {
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
        id: "ubuntu2204",
        packages: {
          data: [
            {
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
        id: "ubuntu2204",
        packages: {
          data: [
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "click",
              version: "8.0.3",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "cloud-init",
              version: "22.3.4",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "colorama",
              version: "0.4.4",
            },
            {
              manager: "pip 22.0.2 from (python 3.10)",
              name: "command-not-found",
              version: "0.3",
            },
            {
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
