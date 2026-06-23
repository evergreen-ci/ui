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
  DistrosQuery,
  DistrosQueryVariables,
  MyHostsQuery,
  MyHostsQueryVariables,
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  UserTokenExchangeQuery,
  UserTokenExchangeQueryVariables,
} from "gql/generated/types";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { myVolumesQueryMock } from "gql/mocks/myVolumesQuery";
import {
  DISTROS,
  MY_HOSTS,
  MY_PUBLIC_KEYS,
  USER_TOKEN_EXCHANGE,
} from "gql/queries";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { SpawnHost } from "./SpawnHost";

const setPageVisibility = (visibilityState: "visible" | "hidden") => {
  act(() => {
    Object.defineProperty(document, "visibilityState", {
      value: visibilityState,
      configurable: true,
    });
    document.dispatchEvent(new window.Event("visibilitychange"));
  });
};

describe("SpawnHost", () => {
  beforeEach(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
  });

  it("shows the skeleton on initial load and replaces it once hosts have loaded", async () => {
    const { Component } = RenderFakeToastContext(<SpawnHost />);
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );

    expect(screen.getByDataCy("spawn-page-skeleton")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-page-skeleton")).toBeNull();
    });
    expect(screen.getByDataCy("spawn-host-button")).toBeInTheDocument();
  });

  it("keeps the open spawn host modal mounted when a background refetch occurs after returning to the tab", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<SpawnHost />);
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );

    await user.click(await screen.findByDataCy("spawn-host-button"));
    expect(await screen.findByDataCy("spawn-host-modal")).toBeInTheDocument();

    // Leaving and returning to the tab triggers usePolling to refetch, which
    // toggles the query's loading state in Apollo Client v4.
    setPageVisibility("hidden");
    setPageVisibility("visible");

    // The skeleton must not re-render during the background refetch, otherwise
    // the modal would be unmounted and lose its open state.
    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-page-skeleton")).toBeNull();
    });
    expect(screen.getByDataCy("spawn-host-modal")).toBeInTheDocument();
  });
});

const baseSpawnHost: Omit<MyHost, "id" | "status"> = {
  expiration: new Date("2021-10-28T22:37:40Z"),
  distro: {
    isVirtualWorkStation: true,
    id: "ubuntu1804-workstation",
    user: "ubuntu",
    workDir: "/home/ubuntu",
    isWindows: false,
    __typename: "DistroInfo",
  },
  hostUrl: "ec2-34-201-138-106.compute-1.amazonaws.com",
  homeVolumeID: "vol-07fa9f6b5c2067e34",
  homeVolume: {
    id: "home-volume-id",
    displayName: "",
  },
  instanceType: "m5.xlarge",
  instanceTags: [],
  volumes: [],
  noExpiration: false,
  persistentDnsName: "",
  provider: "ec2-fleet",
  startedBy: "stssss.arst",
  tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
  user: "ubuntu",
  uptime: new Date("2020-10-14T22:37:40Z"),
  displayName: "",
  availabilityZone: "us-east-1c",
  __typename: "Host",
};

const spawnHost: MyHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91079",
  status: HostStatus.Running,
};

const myHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
  request: { query: MY_HOSTS, variables: {} },
  result: { data: { myHosts: [spawnHost] } },
};

const distrosMock: ApolloMock<DistrosQuery, DistrosQueryVariables> = {
  request: { query: DISTROS, variables: { onlySpawnable: true } },
  result: {
    data: {
      distros: [
        {
          __typename: "Distro",
          name: "test-distro",
          adminOnly: false,
          aliases: [],
          availableRegions: ["us-east-1"],
          isVirtualWorkStation: false,
        },
      ],
    },
  },
};

const myPublicKeysMock: ApolloMock<
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables
> = {
  request: { query: MY_PUBLIC_KEYS, variables: {} },
  result: {
    data: {
      myPublicKeys: [{ __typename: "PublicKey", key: "abc", name: "MBP" }],
    },
  },
};

const userTokenExchangeMock: ApolloMock<
  UserTokenExchangeQuery,
  UserTokenExchangeQueryVariables
> = {
  request: { query: USER_TOKEN_EXCHANGE, variables: {} },
  result: {
    data: {
      user: {
        __typename: "UserLite",
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: null,
      },
    },
  },
};

const baseMocks = [
  { ...myHostsMock, maxUsageCount: Number.POSITIVE_INFINITY },
  distrosMock,
  myPublicKeysMock,
  { ...userTokenExchangeMock, maxUsageCount: Number.POSITIVE_INFINITY },
  myVolumesQueryMock,
  getSpruceConfigMock,
  getUserSettingsMock,
];
