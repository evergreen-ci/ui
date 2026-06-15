import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  DistroQuery,
  DistroQueryVariables,
  DistrosQuery,
  DistrosQueryVariables,
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { DISTRO, DISTROS, USER_DISTRO_SETTINGS_PERMISSIONS } from "gql/queries";
import { distroData } from "./tabs/testData";
import DistroSettings from ".";

const distroMock = (
  distroId: string,
  note: string,
): ApolloMock<DistroQuery, DistroQueryVariables> => ({
  request: { query: DISTRO, variables: { distroId } },
  result: { data: { distro: { ...distroData, name: distroId, note } } },
});

const permissionsMock = (
  distroId: string,
): ApolloMock<
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables
> => ({
  request: { query: USER_DISTRO_SETTINGS_PERMISSIONS, variables: { distroId } },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "me",
        permissions: {
          __typename: "Permissions",
          canCreateDistro: true,
          distroPermissions: {
            __typename: "DistroPermissions",
            id: distroId,
            admin: true,
            edit: true,
          },
        },
      },
    },
  },
});

const distrosMock: ApolloMock<DistrosQuery, DistrosQueryVariables> = {
  request: { query: DISTROS, variables: { onlySpawnable: false } },
  result: {
    data: {
      distros: ["localhost", "rhel71-power8-large"].map((name) => ({
        __typename: "Distro",
        adminOnly: false,
        aliases: [],
        availableRegions: [],
        isVirtualWorkStation: false,
        name,
      })),
    },
  },
};

const renderDistroSettings = () => {
  // Mirror the app's route shape (parent ".../settings" + child ":tab"); a data
  // router is required for the page's useBlocker-based navigation guard.
  const router = createMemoryRouter(
    [
      {
        path: "/distro/:distroId/settings",
        element: <DistroSettings />,
        children: [{ path: ":tab", element: null }],
      },
      { path: "*", element: <div>Not found</div> },
    ],
    { initialEntries: ["/distro/localhost/settings/general"] },
  );
  const { Component } = RenderFakeToastContext(
    <MockedProvider
      mocks={[
        distroMock("localhost", "localhost note"),
        distroMock("rhel71-power8-large", "rhel note"),
        permissionsMock("localhost"),
        permissionsMock("rhel71-power8-large"),
        distrosMock,
      ]}
    >
      <RouterProvider router={router} />
    </MockedProvider>,
  );
  render(<Component />);
};

describe("DistroSettings", () => {
  // Regression test for DEVPROD-29223: an unsaved edit to one distro's tab must not
  // linger in form state and get written onto a different distro after switching.
  it("does not carry an unsaved field from one distro into another after switching distros", async () => {
    const user = userEvent.setup();
    renderDistroSettings();

    const notes = await screen.findByLabelText("Notes");
    await waitFor(() => expect(notes).toHaveValue("localhost note"));

    // Make an unsaved edit on the first distro.
    await user.clear(notes);
    await user.type(notes, "an unsaved note");
    await waitFor(() =>
      expect(screen.getByDataCy("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "false",
      ),
    );

    // Switch distros via the dropdown and leave past the unsaved-changes guard.
    await user.click(screen.getByLabelText("Distro"));
    await user.click(screen.getByText("rhel71-power8-large"));
    await waitFor(() =>
      expect(screen.getByDataCy("navigation-warning-modal")).toBeVisible(),
    );
    await user.click(screen.getByRole("button", { name: "Leave" }));

    // The new distro's tab must show its own data, not the stale edit.
    await waitFor(() =>
      expect(screen.getByLabelText("Notes")).toHaveValue("rhel note"),
    );
  });
});
