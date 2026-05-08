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
  ImageDistrosQuery,
  ImageDistrosQueryVariables,
  Provider,
} from "gql/generated/types";
import { IMAGE_DISTROS } from "gql/queries";
import { DistrosTable } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[imageDistrosMock]}>{children}</MockedProvider>
);

describe("distros table", () => {
  it("shows correct links to distro pages", async () => {
    const { Component } = RenderFakeToastContext(
      <DistrosTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("distro-table-row")).toHaveLength(3);
    });

    const ubuntuSmall = screen.getAllByDataCy("distro-table-row")[0];
    expect(within(ubuntuSmall).getAllByRole("link")[0]).toHaveAttribute(
      "href",
      "/distro/ubuntu2204-small/settings/general",
    );
    const ubuntuLarge = screen.getAllByDataCy("distro-table-row")[1];
    expect(within(ubuntuLarge).getAllByRole("link")[0]).toHaveAttribute(
      "href",
      "/distro/ubuntu2204-large/settings/general",
    );
    const ubuntuStatic = screen.getAllByDataCy("distro-table-row")[2];
    expect(within(ubuntuStatic).getAllByRole("link")[0]).toHaveAttribute(
      "href",
      "/distro/ubuntu2204-static/settings/general",
    );
  });

  it("shows correct instance types", async () => {
    const { Component } = RenderFakeToastContext(
      <DistrosTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("distro-table-row")).toHaveLength(3);
    });

    const ubuntuSmall = screen.getAllByDataCy("distro-table-row")[0];
    expect(within(ubuntuSmall).getAllByRole("cell")[1]).toHaveTextContent(
      "m4.xlarge",
    );
    const ubuntuLarge = screen.getAllByDataCy("distro-table-row")[1];
    expect(within(ubuntuLarge).getAllByRole("cell")[1]).toHaveTextContent(
      "m6i.2xlarge",
    );
    const ubuntuStatic = screen.getAllByDataCy("distro-table-row")[2];
    expect(within(ubuntuStatic).getAllByRole("cell")[1]).toHaveTextContent(
      "N/A",
    );
  });

  it("shows correct max host counts", async () => {
    const { Component } = RenderFakeToastContext(
      <DistrosTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("distro-table-row")).toHaveLength(3);
    });

    const ubuntuSmall = screen.getAllByDataCy("distro-table-row")[0];
    expect(within(ubuntuSmall).getAllByRole("cell")[2]).toHaveTextContent(
      "100",
    );
    const ubuntuLarge = screen.getAllByDataCy("distro-table-row")[1];
    expect(within(ubuntuLarge).getAllByRole("cell")[2]).toHaveTextContent("30");
    const ubuntuStatic = screen.getAllByDataCy("distro-table-row")[2];
    expect(within(ubuntuStatic).getAllByRole("cell")[2]).toHaveTextContent("2");
  });

  it("shows correct links to hosts pages", async () => {
    const { Component } = RenderFakeToastContext(
      <DistrosTable imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getAllByDataCy("distro-table-row")).toHaveLength(3);
    });

    const ubuntuSmall = screen.getAllByDataCy("distro-table-row")[0];
    expect(within(ubuntuSmall).getAllByRole("link")[1]).toHaveAttribute(
      "href",
      "/hosts?distroId=ubuntu2204-small&startedBy=mci",
    );
    const ubuntuLarge = screen.getAllByDataCy("distro-table-row")[1];
    expect(within(ubuntuLarge).getAllByRole("link")[1]).toHaveAttribute(
      "href",
      "/hosts?distroId=ubuntu2204-large&startedBy=mci",
    );
    const ubuntuStatic = screen.getAllByDataCy("distro-table-row")[2];
    expect(within(ubuntuStatic).getAllByRole("link")[1]).toHaveAttribute(
      "href",
      "/hosts?distroId=ubuntu2204-static&startedBy=mci",
    );
  });
});

const imageDistrosMock: ApolloMock<
  ImageDistrosQuery,
  ImageDistrosQueryVariables
> = {
  request: {
    query: IMAGE_DISTROS,
    variables: { imageId: "ubuntu2204" },
  },
  result: {
    data: {
      image: {
        __typename: "Image",
        id: "ubuntu2204",
        distros: [
          {
            __typename: "Distro",
            name: "ubuntu2204-small",
            provider: Provider.Ec2Fleet,
            providerSettingsList: [
              { region: "us-east-1", instance_type: "m4.xlarge" },
              { region: "us-west-1", instance_type: "m4.4xlarge" },
            ],
            hostAllocatorSettings: {
              __typename: "HostAllocatorSettings",
              maximumHosts: 100,
            },
          },
          {
            __typename: "Distro",
            name: "ubuntu2204-large",
            provider: Provider.Ec2OnDemand,
            providerSettingsList: [
              { region: "us-east-1", instance_type: "m6i.2xlarge" },
              { region: "us-east-1", instance_type: "m5.2xlarge" },
            ],
            hostAllocatorSettings: {
              __typename: "HostAllocatorSettings",
              maximumHosts: 30,
            },
          },
          {
            __typename: "Distro",
            name: "ubuntu2204-static",
            provider: Provider.Static,
            providerSettingsList: [{ hosts: ["host-1", "host-2"] }],
            hostAllocatorSettings: {
              __typename: "HostAllocatorSettings",
              maximumHosts: 0,
            },
          },
        ],
      },
    },
  },
};
