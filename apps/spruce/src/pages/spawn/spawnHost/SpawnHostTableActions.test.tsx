import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  act,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { defaultSleepSchedule } from "components/Spawn/utils";
import { SECOND } from "constants/index";
import {
  InstanceTypesQuery,
  InstanceTypesQueryVariables,
  MyHostsQuery,
  MyHostsQueryVariables,
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
} from "gql/generated/types";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { myVolumesQueryMock } from "gql/mocks/myVolumesQuery";
import { INSTANCE_TYPES, MY_HOSTS, MY_PUBLIC_KEYS } from "gql/queries";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { SpawnHostTable } from "./SpawnHostTable";
import { CopySSHCommandButton } from "./SpawnHostTableActions";

const testUser = "bynn.lee";
const hostUrl = "ec2-54-242-162-135.compute-1.amazonaws.com";

describe("copySSHCommandButton", () => {
  afterEach(() => {
    vi.clearAllTimers();
  });

  it("tooltip text should change after clicking on the copy button", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
      writeToClipboard: true,
    });
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          hostStatus={HostStatus.Running}
          hostUrl={hostUrl}
          user={testUser}
        />
      </MockedProvider>,
    );

    const copySSHButton = screen.getByDataCy("copy-ssh-button");

    // Hover over button to trigger tooltip.
    await user.hover(copySSHButton);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Must be on VPN to connect to host"),
    ).toBeInTheDocument();

    // Click on button to copy the SSH command and change tooltip message.
    await user.click(copySSHButton);
    await waitFor(async () => {
      const clipboardText = await navigator.clipboard.readText();
      expect(clipboardText).toBe(`ssh ${testUser}@${hostUrl}`);
    });
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // Advance timer so that the original tooltip text will show.
    act(() => {
      vi.advanceTimersByTime(10 * SECOND);
    });
    expect(
      screen.getByText("Must be on VPN to connect to host"),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("should disable the Copy SSH Button if there is no host URL", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          hostStatus={HostStatus.Starting}
          hostUrl=""
          user={testUser}
        />
      </MockedProvider>,
    );
    const copySSHButton = screen.getByDataCy("copy-ssh-button");
    expect(copySSHButton).toBeInTheDocument();
    expect(copySSHButton).toHaveAttribute("aria-disabled", "true");

    await user.hover(copySSHButton);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Host must be running in order to SSH"),
    ).toBeInTheDocument();
  });

  it("should disable the Copy SSH Button if host is terminated", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          hostStatus={HostStatus.Terminated}
          hostUrl={hostUrl}
          user={testUser}
        />
      </MockedProvider>,
    );
    const copySSHButton = screen.getByDataCy("copy-ssh-button");
    expect(copySSHButton).toBeInTheDocument();
    expect(copySSHButton).toHaveAttribute("aria-disabled", "true");

    await user.hover(copySSHButton);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Host must be running in order to SSH"),
    ).toBeInTheDocument();
  });
});

describe("spawn host table", () => {
  it("prompts user to permanently pause host when a sleep schedule is configured", async () => {
    vi.useFakeTimers().setSystemTime("2024-06-05");

    const user = userEvent.setup({ delay: null });
    const { Component } = RenderFakeToastContext(
      <SpawnHostTable hosts={[baseSpawnHost]} />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    await user.click(screen.getByDataCy("pause-unexpirable-host-button"));
    await waitFor(() => {
      expect(screen.queryByDataCy("pause-sleep-schedule-modal")).toBeVisible();
    });
    expect(screen.getByDataCy("next-start")).toHaveTextContent(/at 8:00/);
    expect(
      screen.getByRole("button", { name: /Pause host until/ }),
    ).toBeVisible();
    await user.click(screen.getByLabelText("Pause host indefinitely"));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Pause host indefinitely" }),
      ).toBeVisible();
    });

    vi.useRealTimers();
  });

  it("does not prompt user when pausing expirable host", () => {
    const { Component } = RenderFakeToastContext(
      <SpawnHostTable
        hosts={[{ ...baseSpawnHost, noExpiration: false, sleepSchedule: null }]}
      />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    expect(
      screen.queryByDataCy("pause-unexpirable-host-button"),
    ).not.toBeInTheDocument();
  });

  it("does not prompt user when permanent exemption is granted", () => {
    const { Component } = RenderFakeToastContext(
      <SpawnHostTable
        hosts={[
          {
            ...baseSpawnHost,
            sleepSchedule: {
              ...defaultSleepSchedule,
              nextStartTime: null,
              timeZone: "America/New_York",
              permanentlyExempt: true,
            },
          },
        ]}
      />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    expect(
      screen.queryByDataCy("pause-unexpirable-host-button"),
    ).not.toBeInTheDocument();
  });

  it("prompts beta user without permanent exemption", async () => {
    const user = userEvent.setup({ delay: null });
    const { Component } = RenderFakeToastContext(
      <SpawnHostTable
        hosts={[
          {
            ...baseSpawnHost,
            sleepSchedule: {
              ...defaultSleepSchedule,
              nextStartTime: null,
              timeZone: "America/New_York",
              permanentlyExempt: false,
            },
          },
        ]}
      />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    await user.click(screen.getByDataCy("pause-unexpirable-host-button"));
    await waitFor(() => {
      expect(screen.queryByDataCy("pause-sleep-schedule-modal")).toBeVisible();
    });
  });

  it("does not prompt user when beta testing disabled", () => {
    const { Component } = RenderFakeToastContext(
      <SpawnHostTable
        hosts={[
          {
            ...baseSpawnHost,
            sleepSchedule: {
              ...defaultSleepSchedule,
              nextStartTime: null,
              timeZone: "America/New_York",
              permanentlyExempt: true,
            },
          },
        ]}
      />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    expect(
      screen.queryByDataCy("pause-unexpirable-host-button"),
    ).not.toBeInTheDocument();
  });
});

const baseSpawnHost: MyHost = {
  id: "i-0e2424677dfab890e",
  distro: {
    isVirtualWorkStation: true,
    id: "ubuntu1804-workstation",
    user: "ubuntu",
    workDir: "/home/ubuntu",
    isWindows: false,
    __typename: "DistroInfo",
  },
  expiration: new Date("2024-05-06T20:27:43.024Z"),
  hostUrl: "ec2-34-201-138-106.compute-1.amazonaws.com",
  homeVolumeID: "vol-07fa9f6b5c2067e34",
  homeVolume: {
    id: "home-volume-id",
    displayName: "",
  },
  instanceType: "m5.xlarge",
  instanceTags: [],
  volumes: [
    {
      displayName: "",
      id: "vol-0cf616375140c067e",
      migrating: false,
      __typename: "Volume",
    },
  ],
  noExpiration: true,
  persistentDnsName: "",
  provider: "ec2-ondemand",
  startedBy: "stssss.arst",
  status: "running",
  tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
  user: "ubuntu",
  uptime: new Date("2020-10-14T22:37:40Z"),
  displayName: "",
  availabilityZone: "us-east-1c",
  sleepSchedule: {
    ...defaultSleepSchedule,
    nextStartTime: new Date("2024-06-06T08:00:00Z"),
    temporarilyExemptUntil: null,
    timeZone: "America/New_York",
  },
  __typename: "Host",
};

const myHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
  request: { query: MY_HOSTS, variables: {} },
  result: {
    data: {
      myHosts: [baseSpawnHost],
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
      myPublicKeys: [{ key: "abc", name: "MBP", __typename: "PublicKey" }],
    },
  },
};
const instanceTypesMock: ApolloMock<
  InstanceTypesQuery,
  InstanceTypesQueryVariables
> = {
  request: { query: INSTANCE_TYPES, variables: {} },
  result: {
    data: {
      instanceTypes: [
        "c5.xlarge",
        "c5.2xlarge",
        "c5.4xlarge",
        "m5.4xlarge",
        "m6i.xlarge",
        "m6i.2xlarge",
        "m6i.4xlarge",
        "m6g.2xlarge",
        "m6g.4xlarge",
        "m7g.2xlarge",
        "m7g.4xlarge",
      ],
    },
  },
};

const baseMocks = [
  getSpruceConfigMock,
  getUserSettingsMock,
  instanceTypesMock,
  myHostsMock,
  myPublicKeysMock,
  myVolumesQueryMock,
];
