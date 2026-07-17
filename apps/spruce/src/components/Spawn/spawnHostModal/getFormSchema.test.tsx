import type { ReactElement } from "react";
import { render, screen } from "@evg-ui/lib/test_utils";
import { SpawnTaskQuery } from "gql/generated/types";
import { TokenExchangeState } from "./constants";
import { getFormSchema } from "./getFormSchema";

const myPublicKeys = [{ key: "ssh-rsa aaa", name: "key1" }];

const minimalDistros = [
  {
    adminOnly: false,
    availableRegions: ["us-east-1"],
    isVirtualWorkStation: false,
    name: "distro-a",
  },
];

const taskForLoadDataBanner: NonNullable<SpawnTaskQuery["task"]> = {
  __typename: "Task",
  buildVariant: "ubuntu",
  buildVariantDisplayName: "Ubuntu",
  details: null,
  displayName: "my-task",
  displayStatus: "success",
  execution: 0,
  executionSteps: null,
  id: "t1",
  project: {
    __typename: "Project",
    debugSpawnHostsDisabled: false,
    id: "proj",
    spawnHostScriptPath: "",
  },
  revision: "abc1234",
};

const baseSchemaInput = {
  availableRegions: ["us-east-1"] as string[],
  disableExpirationCheckbox: false,
  distros: minimalDistros,
  hostUptimeWarnings: { enabledHoursCount: 0, warnings: [] },
  isMigration: false,
  isVirtualWorkstation: false,
  myPublicKeys,
  noExpirationCheckboxTooltip: "",
  spawnTaskData: taskForLoadDataBanner,
  timeZone: "America/New_York",
  useProjectSetupScript: false,
  userAwsRegion: "us-east-1",
  useSetupScript: false,
  volumes: [],
};

const tokenAuthDescription = (
  uiSchema: NonNullable<ReturnType<typeof getFormSchema>["uiSchema"]>,
): ReactElement =>
  uiSchema.loadData!.spawnHostTokenAuthBanner![
    "ui:descriptionNode"
  ] as ReactElement;

describe("getFormSchema spawn host token exchange callout", () => {
  it("renders required authentication copy", () => {
    const { uiSchema } = getFormSchema({
      ...baseSchemaInput,
      tokenExchangeState: TokenExchangeState.NeedsAuthentication,
    });
    const node = tokenAuthDescription(uiSchema!);
    render(node);
    expect(
      screen.getByText(/Spawn hosts require an additional authentication step/),
    ).toBeInTheDocument();
  });

  it("disables the authenticate button when token is valid", () => {
    const { uiSchema } = getFormSchema({
      ...baseSchemaInput,
      tokenExchangeState: TokenExchangeState.TokenValid,
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
