import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ImagePackagesQuery,
  ImagePackagesQueryVariables,
} from "gql/generated/types";
import { IMAGE_PACKAGES } from "gql/queries";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { PackagesTable } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[imagePackagesPageOneMock]}>{children}</MockedProvider>
);

describe("packages table", () => {
  it("shows name field data", async () => {
    const { Component } = RenderFakeToastContext(<PackagesTable />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getByDataCy("packages-table-card")).toBeInTheDocument();
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
