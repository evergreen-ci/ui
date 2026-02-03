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
import { ImageFilesQuery, ImageFilesQueryVariables } from "gql/generated/types";
import { IMAGE_FILES } from "gql/queries";
import { FilesTable } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider
    mocks={[imageFilesMock, imageFilesNextPageMock, imageFilesFilterMock]}
  >
    {children}
  </MockedProvider>
);

describe("files table", () => {
  it("shows name field data", async () => {
    const { Component } = RenderFakeToastContext(
      <FilesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("files-table-row")).toHaveLength(10);
    });
    const expectedNames = (
      imageFilesMock.result?.data?.image?.files.data || []
    ).map(({ name }) => name);

    const rows = screen.getAllByDataCy("files-table-row");
    expectedNames.forEach((expectedName, i) => {
      expect(within(rows[i]).getAllByRole("cell")[0]).toHaveTextContent(
        expectedName,
      );
    });
  });

  it("shows path field data", async () => {
    const { Component } = RenderFakeToastContext(
      <FilesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("files-table-row")).toHaveLength(10);
    });
    const expectedPaths = (
      imageFilesMock.result?.data?.image?.files.data || []
    ).map(({ path }) => path);

    const rows = screen.getAllByDataCy("files-table-row");
    expectedPaths.forEach((expectedPath, i) => {
      expect(within(rows[i]).getAllByRole("cell")[1]).toHaveTextContent(
        expectedPath,
      );
    });
  });

  it("shows version field data", async () => {
    const { Component } = RenderFakeToastContext(
      <FilesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("files-table-row")).toHaveLength(10);
    });
    const expectedVersions = (
      imageFilesMock.result?.data?.image?.files.data || []
    ).map(({ version }) => version);

    const rows = screen.getAllByDataCy("files-table-row");
    expectedVersions.forEach((expectedVersion, i) => {
      expect(within(rows[i]).getAllByRole("cell")[2]).toHaveTextContent(
        expectedVersion,
      );
    });
  });

  it("supports name filter", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <FilesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("files-table-row")).toHaveLength(10);
    });
    await user.click(screen.getByDataCy("file-name-filter"));
    await user.type(
      screen.getByPlaceholderText("Name regex"),
      "my-special-cert.pem{enter}",
    );
    await waitFor(() => {
      expect(screen.getAllByDataCy("files-table-row")).toHaveLength(1);
    });
    expect(screen.getByText("1 - 1 of 1 item")).toBeInTheDocument();
  });

  it("supports pagination", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <FilesTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("files-table-row")).toHaveLength(10);
    });

    const nextPageButton = screen.getByTestId("lg-pagination-next-button");
    expect(nextPageButton).toHaveAttribute("aria-disabled", "false");
    await user.click(nextPageButton);
    await waitFor(() => {
      expect(screen.getAllByDataCy("files-table-row")).toHaveLength(1);
    });
    expect(screen.getByText("11 - 11 of 11 items")).toBeInTheDocument();
  });
});

const imageFilesMock: ApolloMock<ImageFilesQuery, ImageFilesQueryVariables> = {
  request: {
    query: IMAGE_FILES,
    variables: { imageId: "ubuntu2204", opts: { page: 0, limit: 10 } },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        files: {
          __typename: "ImageFilesPayload",
          data: [
            {
              __typename: "ImageFile",
              name: "certificate-1.pem",
              path: "/etc/certs",
              version: "sha:111111111111",
            },
            {
              __typename: "ImageFile",
              name: "certificate-2.pem",
              path: "/etc/certs",
              version: "sha:222222222222",
            },
            {
              __typename: "ImageFile",
              name: "certificate-3.pem",
              path: "/etc/certs",
              version: "sha:333333333333",
            },
            {
              __typename: "ImageFile",
              name: "certificate-4.pem",
              path: "/etc/certs",
              version: "sha:444444444444",
            },
            {
              __typename: "ImageFile",
              name: "certificate-5.pem",
              path: "/etc/certs",
              version: "sha:555555555555",
            },
            {
              __typename: "ImageFile",
              name: "certificate-6.pem",
              path: "/etc/certs",
              version: "sha:666666666666",
            },
            {
              __typename: "ImageFile",
              name: "certificate-7.pem",
              path: "/etc/certs",
              version: "sha:777777777777",
            },
            {
              __typename: "ImageFile",
              name: "certificate-8.pem",
              path: "/etc/certs",
              version: "sha:888888888888",
            },
            {
              __typename: "ImageFile",
              name: "certificate-9.pem",
              path: "/etc/certs",
              version: "sha:999999999999",
            },
            {
              __typename: "ImageFile",
              name: "certificate-10.pem",
              path: "/etc/certs",
              version: "sha:101010101010",
            },
          ],
          filteredCount: 11,
          totalCount: 11,
        },
      },
    },
  },
};

const imageFilesNextPageMock: ApolloMock<
  ImageFilesQuery,
  ImageFilesQueryVariables
> = {
  request: {
    query: IMAGE_FILES,
    variables: { imageId: "ubuntu2204", opts: { page: 1, limit: 10 } },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        files: {
          __typename: "ImageFilesPayload",
          data: [
            {
              __typename: "ImageFile",
              name: "certificate-11.pem",
              path: "/etc/certs",
              version: "sha:next-page-sha",
            },
          ],
          filteredCount: 11,
          totalCount: 11,
        },
      },
    },
  },
};

const imageFilesFilterMock: ApolloMock<
  ImageFilesQuery,
  ImageFilesQueryVariables
> = {
  request: {
    query: IMAGE_FILES,
    variables: {
      imageId: "ubuntu2204",
      opts: { page: 0, limit: 10, name: "my-special-cert.pem" },
    },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        files: {
          __typename: "ImageFilesPayload",
          data: [
            {
              __typename: "ImageFile",
              name: "my-special-cert.pem",
              path: "/etc/certs",
              version: "sha:filtered-sha",
            },
          ],
          filteredCount: 1,
          totalCount: 11,
        },
      },
    },
  },
};
