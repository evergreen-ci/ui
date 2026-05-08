import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  ImageGeneralQuery,
  ImageGeneralQueryVariables,
} from "gql/generated/types";
import { IMAGE_GENERAL } from "gql/queries";
import { GeneralTable } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[imageGeneralMock]}>{children}</MockedProvider>
);

describe("general table", () => {
  it("displays correct information", async () => {
    const { Component } = RenderFakeToastContext(
      <GeneralTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("general-table-row")).toHaveLength(4);
    });

    const lastDeployed = screen.getAllByDataCy("general-table-row")[0];
    expect(within(lastDeployed).getAllByRole("cell")[0]).toHaveTextContent(
      "Last deployed",
    );
    expect(within(lastDeployed).getAllByRole("cell")[1]).toHaveTextContent(
      "Aug 7, 2021, 9:57:00 PM UTC",
    );

    const ami = screen.getAllByDataCy("general-table-row")[1];
    expect(within(ami).getAllByRole("cell")[0]).toHaveTextContent(
      "Amazon Machine Image (AMI)",
    );
    expect(within(ami).getAllByRole("cell")[1]).toHaveTextContent(
      "ami-9809871715289206",
    );

    const latestTask = screen.getAllByDataCy("general-table-row")[2];
    expect(within(latestTask).getAllByRole("cell")[0]).toHaveTextContent(
      "Latest task",
    );
    expect(within(latestTask).getAllByRole("link")[0]).toHaveAttribute(
      "href",
      "/task/evergreen_ui_spruce_check_codegen_patch_b01dd570dbb2d060bf56d853e9eb1a71d60a6464_66be78cc4f92ba0007d94fcf_24_08_15_21_53_20",
    );

    const latestTaskTime = screen.getAllByDataCy("general-table-row")[3];
    expect(within(latestTaskTime).getAllByRole("cell")[0]).toHaveTextContent(
      "Latest task time",
    );
    expect(within(latestTaskTime).getAllByRole("cell")[1]).toHaveTextContent(
      "Aug 8, 2021, 9:57:00 PM UTC",
    );
  });
});

const imageGeneralMock: ApolloMock<
  ImageGeneralQuery,
  ImageGeneralQueryVariables
> = {
  request: {
    query: IMAGE_GENERAL,
    variables: { imageId: "ubuntu2204" },
  },
  result: {
    data: {
      image: {
        id: "ubuntu2204",
        ami: "ami-9809871715289206",
        lastDeployed: new Date("2021-08-07T17:57:00-04:00"),
        latestTask: {
          finishTime: new Date("2021-08-08T17:57:00-04:00"),
          id: "evergreen_ui_spruce_check_codegen_patch_b01dd570dbb2d060bf56d853e9eb1a71d60a6464_66be78cc4f92ba0007d94fcf_24_08_15_21_53_20",
          execution: 0,
        },
      },
    },
  },
};
