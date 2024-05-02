import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { defaultSleepSchedule } from "components/Spawn/utils";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { myVolumesQueryMock } from "gql/mocks/myVolumesQuery";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  within,
} from "test_utils";
import { MyHost } from "types/spawn";
import { EditSpawnHostModal } from "./EditSpawnHostModal";

describe("editSpawnHostModal", () => {
  it("renders modal", () => {
    const { Component } = RenderFakeToastContext(
      <EditSpawnHostModal host={baseSpawnHost} visible onCancel={() => {}} />,
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
      <EditSpawnHostModal host={baseSpawnHost} visible onCancel={() => {}} />,
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
        <EditSpawnHostModal host={baseSpawnHost} visible onCancel={() => {}} />,
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
        <EditSpawnHostModal host={baseSpawnHost} visible onCancel={() => {}} />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      within(screen.queryByDataCy("daypicker"))
        .getAllByRole("checkbox")
        .forEach((day) => {
          expect(day).toBeDisabled();
        });
    });

    it("has default days selected", () => {
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} visible onCancel={() => {}} />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      within(screen.queryByDataCy("daypicker"))
        .getAllByRole("checkbox")
        .forEach((day, i) => {
          // TODO: Remove conditional
          if (i !== 0 && i !== 6) {
            expect(day).toHaveAttribute("aria-checked", "true");
          } else {
            expect(day).toHaveAttribute("aria-checked", "false");
          }
        });
    });

    it("has timepicker elements disabled", () => {
      const { Component } = RenderFakeToastContext(
        <EditSpawnHostModal host={baseSpawnHost} visible onCancel={() => {}} />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      expect(screen.queryByLabelText("Start Time")).toBeDisabled();
      expect(screen.queryByLabelText("Stop Time")).toBeDisabled();
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
        <EditSpawnHostModal host={baseSpawnHost} visible onCancel={() => {}} />,
      );
      render(
        <MockedProvider mocks={baseMocks}>
          <Component />
        </MockedProvider>,
      );
      expect(screen.queryByDataCy("edit-spawn-host-modal")).toBeVisible();
      await user.click(
        screen.getByText("Use default host uptime schedule", { exact: false }),
      );
      within(screen.queryByDataCy("daypicker"))
        .getAllByRole("checkbox")
        .forEach((day) => {
          expect(day).not.toBeDisabled();
        });
      // await user.click(screen.queryByTitle("Sunday"));
      await user.click(screen.queryByLabelText("Start Time"));
      await user.click(screen.queryByText("08", { selector: "li" }));
      expect(screen.queryByDataCy("host-uptime-details")).toHaveTextContent(
        "72",
      );
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
    timeZone: "America/New_York",
  },
  __typename: "Host",
};

const baseMocks: MockedResponse[] = [
  getUserMock,
  getUserSettingsMock,
  getSpruceConfigMock,
  myVolumesQueryMock,
];
