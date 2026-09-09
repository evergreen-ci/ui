import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { HostQuery } from "gql/generated/types";
import { Metadata } from "./Metadata";

type Host = NonNullable<HostQuery["host"]>;

const baseHost: Host = {
  __typename: "Host",
  agentRevision: null,
  ami: "ami-1234",
  distro: {
    __typename: "DistroInfo",
    id: "ubuntu2204",
    bootstrapMethod: "ssh",
  },
  distroId: "ubuntu2204",
  hostUrl: "host-url.mongodb.com",
  id: "host-1",
  lastCommunicationTime: null,
  persistentDnsName: "",
  provider: "static",
  runningTask: null,
  startedBy: "mci",
  status: "running",
  tag: "tag-1",
  uptime: new Date("2024-01-01"),
  user: "ec2-user",
};

describe("host metadata", () => {
  it("shows the agent revision when present", () => {
    render(
      <Metadata
        error={undefined}
        host={{ ...baseHost, agentRevision: "abc123def" }}
        loading={false}
      />,
      { route: "/host/host-1", path: "/host/:id" },
    );
    expect(screen.getByDataCy("host-agent-revision")).toHaveTextContent(
      "abc123def",
    );
  });

  it("hides the agent revision when not present", () => {
    render(<Metadata error={undefined} host={baseHost} loading={false} />, {
      route: "/host/host-1",
      path: "/host/:id",
    });
    expect(screen.queryByDataCy("host-agent-revision")).not.toBeInTheDocument();
  });
});
