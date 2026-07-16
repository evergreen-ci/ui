import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import SpawnHostCard from "./SpawnHostCard";

export default {
  component: SpawnHostCard,
  title: "Pages/Spawn/Spawn Host Card",
} satisfies CustomMeta<typeof SpawnHostCard>;

export const Default: CustomStoryObj<typeof SpawnHostCard> = {
  render: () => <SpawnHostCard host={host} />,
};

const host = {
  distro: {
    id: "ubuntu1804-workstation",
    isVirtualWorkStation: true,
    user: "ubuntu",
    workDir: "/home/ubuntu",
  },
  expiration: new Date("2020-08-21T18:00:07Z"),
  homeVolumeID: "vol-0ea662ac92f611ed4",
  hostUrl: "ec2-54-242-162-135.compute-1.amazonaws.com",
  id: "i-04ade558e1e26b0ad",
  instanceTags: [
    {
      canBeModified: false,
      key: "name",
      value: "i-04ade558e1e26b0ad",
    },
    {
      canBeModified: false,
      key: "distro",
      value: "ubuntu1804-workstation",
    },
    {
      canBeModified: false,
      key: "owner",
      value: "mohamed.khelif",
    },
    {
      canBeModified: false,
      key: "mode",
      value: "production",
    },
    {
      canBeModified: false,
      key: "start-time",
      value: "20200615111044",
    },
  ],
  instanceType: "m5.xlarge",
  noExpiration: true,
  persistentDnsName: "mohamed-khelif-abc.workstations.build.10gen.cc",
  provider: "ec2-fleet",
  startedBy: "mohamed.khelif",
  status: "running",
  tag: "evg-ubuntu1804-workstation-20200615111044-7227428564029203",
  uptime: new Date("2020-06-15T11:10:44Z"),
  user: "ubuntu",
  volumes: [],
};
