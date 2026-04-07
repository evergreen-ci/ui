import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  fireEvent,
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  DistrosQuery,
  DistrosQueryVariables,
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  SpawnTaskQuery,
  SpawnTaskQueryVariables,
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
} from "gql/generated/types";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { myVolumesQueryMock } from "gql/mocks/myVolumesQuery";
import { DISTROS, MY_PUBLIC_KEYS, SPAWN_TASK } from "gql/queries";
import { SpawnHostModal } from "./SpawnHostModal";

const { mockHasValidToken, mockIsUndergoingAuthentication } = vi.hoisted(
  () => ({
    mockHasValidToken: vi.fn(),
    mockIsUndergoingAuthentication: vi.fn(),
  }),
);

vi.mock("./tokenAuthentication", () => ({
  useUserHasValidToken: (skip: boolean) => {
    if (skip) {
      return false;
    }
    return mockHasValidToken();
  },
  useUserIsUndergoingAuthentication: (skip: boolean) => {
    if (skip) {
      return false;
    }
    return mockIsUndergoingAuthentication();
  },
}));

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

const spawnTaskMock: ApolloMock<SpawnTaskQuery, SpawnTaskQueryVariables> = {
  request: { query: SPAWN_TASK, variables: { taskId: "t1" } },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: "t1",
        buildVariant: "ubuntu",
        buildVariantDisplayName: "Ubuntu",
        displayName: "my-task",
        displayStatus: "success",
        execution: 0,
        revision: "abc1234",
        details: null,
        executionSteps: null,
        project: {
          __typename: "Project",
          id: "proj",
          debugSpawnHostsDisabled: false,
          spawnHostScriptPath: "",
        },
      },
    },
  },
};

const strictJwtSpruceConfigMock = {
  ...getSpruceConfigMock,
  result: {
    data: {
      spruceConfig: {
        ...getSpruceConfigMock.result!.data!.spruceConfig!,
        serviceFlags: {
          ...getSpruceConfigMock.result!.data!.spruceConfig!.serviceFlags,
          jwtTokenForCLIDisabled: false,
        },
      },
    },
  },
} satisfies ApolloMock<SpruceConfigQuery, SpruceConfigQueryVariables>;

const baseMocks = [
  strictJwtSpruceConfigMock,
  getUserSettingsMock,
  distrosMock,
  myPublicKeysMock,
  myVolumesQueryMock,
  spawnTaskMock,
];

describe("SpawnHostModal token gate", () => {
  const originalResizeObserver = window.ResizeObserver;

  beforeAll(() => {
    stubGetClientRects();
  });

  beforeEach(() => {
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    mockHasValidToken.mockReturnValue(false);
    mockIsUndergoingAuthentication.mockReturnValue(false);
  });

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  it("disables Spawn when load-task-data is checked, strict JWT is on, and the user has no valid token", async () => {
    const { Component } = RenderFakeToastContext(
      <SpawnHostModal open setOpen={() => {}} />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
      { route: "/?taskId=t1&distroId=test-distro", path: "/" },
    );

    const spawnButton = await screen.findByRole("button", {
      name: /Spawn a host/i,
    });

    const loadDataCheckbox = await screen.findByDataCy("load-data-checkbox");

    // loadDataOntoHostAtStartup defaults to true when spawning from a task.
    await waitFor(() => {
      expect(spawnButton).toHaveAttribute("aria-disabled", "true");
    });
    expect(loadDataCheckbox).toBeChecked();

    fireEvent.click(loadDataCheckbox);
    await waitFor(() => {
      expect(spawnButton.getAttribute("aria-disabled")).not.toBe("true");
    });

    fireEvent.click(loadDataCheckbox);
    await waitFor(() => {
      expect(spawnButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("keeps Spawn enabled when load-task-data is checked if the user has a valid token", async () => {
    mockHasValidToken.mockReturnValue(true);
    const { Component } = RenderFakeToastContext(
      <SpawnHostModal open setOpen={() => {}} />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
      { route: "/?taskId=t1&distroId=test-distro", path: "/" },
    );

    const spawnButton = await screen.findByRole("button", {
      name: /Spawn a host/i,
    });

    await waitFor(() => {
      expect(spawnButton.getAttribute("aria-disabled")).not.toBe("true");
    });

    const loadDataCheckbox = await screen.findByDataCy("load-data-checkbox");
    expect(loadDataCheckbox).toBeChecked();

    fireEvent.click(loadDataCheckbox);
    await waitFor(() => {
      expect(spawnButton.getAttribute("aria-disabled")).not.toBe("true");
    });

    fireEvent.click(loadDataCheckbox);
    await waitFor(() => {
      expect(spawnButton.getAttribute("aria-disabled")).not.toBe("true");
    });
  });
});
