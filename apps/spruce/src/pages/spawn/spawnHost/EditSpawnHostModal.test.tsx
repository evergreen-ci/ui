import {
  ApolloMock,
  MockedProvider,
  MockedResponse,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { defaultSleepSchedule } from "components/Spawn/utils";
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
import { MyHost } from "types/spawn";
import { EditSpawnHostModal } from "./EditSpawnHostModal";

describe("editSpawnHostModal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("renders modal", () => {
    const { Component } = RenderFakeToastContext(
      <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
  });

  it("disables save button when no changes have been made", () => {
    const { Component } = RenderFakeToastContext(
      <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  describe("when default sleep schedule is enabled", () => {
    it("has default sleep schedule checkbox checked", () => {
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      expect(
        screen.queryByLabelText("Use default host uptime schedule", {
          exact: false,
        }),
      ).toBeChecked();
    });

    it("has all daypicker elements disabled", () => {
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      within(screen.getByDataCy("daypicker"))
        .getAllByRole("checkbox")
        .forEach((day) => {
          expect(day).toBeDisabled();
        });
    });

    it("has default days selected", () => {
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      expect(screen.queryByLabelText("M")).toHaveAttribute(
        "aria-checked",
        "true",
      );
      expect(screen.queryByLabelText("W")).toHaveAttribute(
        "aria-checked",
        "true",
      );
      expect(screen.queryByLabelText("F")).toHaveAttribute(
        "aria-checked",
        "true",
      );
      screen.queryAllByLabelText("T").forEach((day) => {
        expect(day).toHaveAttribute("aria-checked", "true");
      });
      screen.queryAllByLabelText("S").forEach((day) => {
        expect(day).toHaveAttribute("aria-checked", "false");
      });
    });

    it("has timepicker elements disabled", () => {
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();

      const hourInputs = screen.getAllByDataCy("hour-input");
      expect(hourInputs).toHaveLength(2);
      expect(hourInputs[0]).toBeDisabled();
      expect(hourInputs[1]).toBeDisabled();

      const minuteInputs = screen.getAllByDataCy("minute-input");
      expect(minuteInputs).toHaveLength(2);
      expect(minuteInputs[0]).toBeDisabled();
      expect(minuteInputs[1]).toBeDisabled();

      expect(
        screen.queryByLabelText("Run continuously for enabled days"),
      ).not.toBeChecked();
      expect(
        screen.queryByLabelText("Run continuously for enabled days"),
      ).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("when disabling the default sleep schedule", () => {
    it("shows the updated hour count when changing the schedule", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
      );
      Element.prototype.scrollIntoView = () => {};
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      expect(screen.getByText("Central Time")).toBeVisible();
      await user.click(
        screen.getByText("Use default host uptime schedule", {
          exact: false,
        }),
      );
      within(screen.getByDataCy("daypicker"))
        .getAllByRole("checkbox")
        .forEach((day) => {
          expect(day).not.toBeDisabled();
        });

      await user.click(screen.getAllByDataCy("hour-input")[0]);
      await waitFor(() => {
        expect(screen.getByDataCy("hour-options")).toBeVisible();
      });
      await user.click(
        within(screen.getByDataCy("hour-options")).getByText("07"),
      );
      await user.click(screen.getByDataCy("edit-spawn-host-modal"));
      expect(screen.getAllByDataCy("hour-input")[0]).toHaveValue("07");
      expect(screen.queryByDataCy("host-uptime-details")).toHaveTextContent(
        "65",
      );
    }, 30000);

    it("shows a warning when user has configured a schedule over the recommended limit", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      await user.click(
        screen.getByText("Use default host uptime schedule", {
          exact: false,
        }),
      );
      await user.click(screen.getByTitle("Sunday"));
      await user.click(screen.getByText("Run continuously for enabled days"));
      expect(screen.queryByDataCy("host-uptime-details")).toHaveTextContent(
        "144",
      );
      expect(
        screen.queryByText("Consider pausing your host for 2 days per week."),
      ).toBeVisible();
    });

    it("shows an error and disables save when user has configured a schedule over the hard limit", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} onCancel={() => {}} visible />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      await user.click(
        screen.getByText("Use default host uptime schedule", {
          exact: false,
        }),
      );
      await user.click(screen.getByTitle("Sunday"));
      await user.click(screen.getByTitle("Saturday"));
      await user.click(screen.getByText("Run continuously for enabled days"));
      expect(screen.queryByDataCy("host-uptime-details")).toHaveTextContent(
        "168",
      );
      expect(
        screen.queryByText(
          "Please pause your host for at least 1 day per week.",
        ),
      ).toBeVisible();
      expect(screen.queryByRole("button", { name: "Save" })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }, 15000);
  });

  describe("temporarily exempting spawn host", () => {
    beforeEach(() => {
      vi.useFakeTimers().setSystemTime(new Date("2020-01-01"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("displays the exemption date on load", () => {
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal
          host={tempExemptSpawnHost}
          onCancel={() => {}}
          visible
        />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();

      expect(screen.getByDisplayValue("2020")).toBeVisible();
      expect(screen.getByDisplayValue("01")).toBeVisible();
      expect(screen.getByDisplayValue("15")).toBeVisible();
    });
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
    temporarilyExemptUntil: null,
    timeZone: "America/Chicago",
  },
  __typename: "Host",
};

const tempExemptSpawnHost: MyHost = {
  ...baseSpawnHost,
  id: "i-1234",
  homeVolumeID: "vol-5678",
  sleepSchedule: {
    ...defaultSleepSchedule,
    temporarilyExemptUntil: new Date("2020-01-15"),
    timeZone: "America/New_York",
  },
};

const myHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
  request: { query: MY_HOSTS, variables: {} },
  result: {
    data: {
      myHosts: [baseSpawnHost, tempExemptSpawnHost],
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

const baseMocks: MockedResponse[] = [
  getUserMock,
  getUserSettingsMock,
  getSpruceConfigMock,
  instanceTypesMock,
  myHostsMock,
  myVolumesQueryMock,
  myPublicKeysMock,
];
