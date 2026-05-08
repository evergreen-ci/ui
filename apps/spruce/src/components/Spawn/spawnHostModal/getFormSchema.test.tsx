import type { ReactElement } from "react";
import { render, screen } from "@evg-ui/lib/test_utils";
import { SpawnTaskQuery } from "gql/generated/types";
import { TokenExchangeState } from "./constants";
import { getFormSchema } from "./getFormSchema";

const myPublicKeys = [{ name: "key1", key: "ssh-rsa aaa" }];

const minimalDistros = [
  {
    name: "distro-a",
    adminOnly: false,
    isVirtualWorkStation: false,
    availableRegions: ["us-east-1"],
  },
];

const taskForLoadDataBanner: NonNullable<SpawnTaskQuery["task"]> = {
  __typename: "Task",
  id: "t1",
  displayName: "my-task",
  buildVariant: "ubuntu",
  buildVariantDisplayName: "Ubuntu",
  execution: 0,
  revision: "abc1234",
  displayStatus: "success",
  executionSteps: null,
  details: null,
  project: {
    __typename: "Project",
    id: "proj",
    spawnHostScriptPath: "",
    debugSpawnHostsDisabled: false,
  },
};

const baseSchemaInput = {
  availableRegions: ["us-east-1"] as string[],
  disableExpirationCheckbox: false,
  distros: minimalDistros,
  hostUptimeWarnings: { enabledHoursCount: 0, warnings: [] },
  isMigration: false,
  isVirtualWorkstation: false,
  jiraHost: "jira.example.com",
  jwtTokenForCLIDisabled: false,
  myPublicKeys,
  noExpirationCheckboxTooltip: "",
  spawnTaskData: taskForLoadDataBanner,
  timeZone: "America/New_York",
  useProjectSetupScript: false,
  useSetupScript: false,
  userAwsRegion: "us-east-1",
  volumes: [],
};

const tokenAuthDescription = (
  uiSchema: NonNullable<ReturnType<typeof getFormSchema>["uiSchema"]>,
): ReactElement =>
  uiSchema.loadData!.spawnHostTokenAuthBanner![
    "ui:descriptionNode"
  ] as ReactElement;

describe("getFormSchema spawn host token exchange callout", () => {
  it("renders required-stricter copy when jwtTokenForCLIDisabled is false", () => {
    const { uiSchema } = getFormSchema({
      ...baseSchemaInput,
      tokenExchangeState: TokenExchangeState.NeedsAuthentication,
      jwtTokenForCLIDisabled: false,
    });
    const node = tokenAuthDescription(uiSchema!);
    render(node);
    expect(
      screen.getByText(/Spawn hosts require an additional authentication step/),
    ).toBeInTheDocument();
    expect(screen.getByText("DEVPROD-4160")).toBeInTheDocument();
  });

  it("renders optional-phase copy when jwtTokenForCLIDisabled is true", () => {
    const { uiSchema } = getFormSchema({
      ...baseSchemaInput,
      tokenExchangeState: TokenExchangeState.NeedsAuthentication,
      jwtTokenForCLIDisabled: true,
    });
    const node = tokenAuthDescription(uiSchema!);
    render(node);
    expect(
      screen.getByText(
        /An additional authentication step will soon be required/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("DEVPROD-4160")).toBeInTheDocument();
  });

  it("disables the authenticate button when token is valid", () => {
    const { uiSchema } = getFormSchema({
      ...baseSchemaInput,
      tokenExchangeState: TokenExchangeState.TokenValid,
      jwtTokenForCLIDisabled: false,
    });
    const node = tokenAuthDescription(uiSchema!);
    render(node);
    const button = screen.getByDataCy("spawn-host-authenticate-button");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("shows waiting text and keeps button clickable when exchange is pending", () => {
    const { uiSchema } = getFormSchema({
      ...baseSchemaInput,
      tokenExchangeState: TokenExchangeState.ExchangePending,
      jwtTokenForCLIDisabled: false,
    });
    const node = tokenAuthDescription(uiSchema!);
    render(node);
    const button = screen.getByDataCy("spawn-host-authenticate-button");
    expect(button).toBeVisible();
    expect(button).not.toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByText("Waiting for authentication to complete..."),
    ).toBeVisible();
  });
});
