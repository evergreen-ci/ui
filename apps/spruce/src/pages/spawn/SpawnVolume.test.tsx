import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  act,
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  MyHostsQuery,
  MyHostsQueryVariables,
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
} from "gql/generated/types";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { myVolumesQueryMock } from "gql/mocks/myVolumesQuery";
import { MY_HOSTS, SUBNET_AVAILABILITY_ZONES } from "gql/queries";
import { SpawnVolume } from "./SpawnVolume";

const setPageVisibility = (visibilityState: "visible" | "hidden") => {
  act(() => {
    Object.defineProperty(document, "visibilityState", {
      value: visibilityState,
      configurable: true,
    });
    document.dispatchEvent(new window.Event("visibilitychange"));
  });
};

describe("SpawnVolume", () => {
  beforeEach(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
  });

  it("shows the skeleton on initial load and replaces it once volumes have loaded", async () => {
    const { Component } = RenderFakeToastContext(<SpawnVolume />);
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );

    expect(screen.getByDataCy("spawn-page-skeleton")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-page-skeleton")).toBeNull();
    });
    expect(screen.getByDataCy("spawn-volume-btn")).toBeInTheDocument();
  });

  it("keeps the open spawn volume modal mounted when a background refetch occurs after returning to the tab", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<SpawnVolume />);
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );

    await user.click(await screen.findByDataCy("spawn-volume-btn"));
    expect(await screen.findByDataCy("spawn-volume-modal")).toBeInTheDocument();

    // Leaving and returning to the tab triggers usePolling to refetch, which
    // toggles the query's loading state in Apollo Client v4.
    setPageVisibility("hidden");
    setPageVisibility("visible");

    // The skeleton must not re-render during the background refetch, otherwise
    // the modal would be unmounted and lose its open state.
    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-page-skeleton")).toBeNull();
    });
    expect(screen.getByDataCy("spawn-volume-modal")).toBeInTheDocument();
  });
});

const myHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
  request: { query: MY_HOSTS, variables: {} },
  result: { data: { myHosts: [] } },
};

const subnetAvailabilityZonesMock: ApolloMock<
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables
> = {
  request: { query: SUBNET_AVAILABILITY_ZONES, variables: {} },
  result: { data: { subnetAvailabilityZones: ["us-east-1a"] } },
};

const baseMocks = [
  { ...myVolumesQueryMock, maxUsageCount: Number.POSITIVE_INFINITY },
  { ...myHostsMock, maxUsageCount: Number.POSITIVE_INFINITY },
  subnetAvailabilityZonesMock,
  getSpruceConfigMock,
  getUserSettingsMock,
];
