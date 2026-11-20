import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { UNSCHEDULE_VERSION_TASKS } from "gql/mutations";
import { DropdownMenu } from "./DropdownMenu";

const unscheduleMock = {
  delay: 500,
  request: {
    query: UNSCHEDULE_VERSION_TASKS,
    variables: { versionId: "patch_id", abort: true },
  },
  result: { data: { unscheduleVersionTasks: "patch_id" } },
};

const renderMenu = () => {
  const { Component } = RenderFakeToastContext(
    <MockedProvider mocks={[unscheduleMock]}>
      <DropdownMenu
        hasVersion
        isMergeQueuePatch={false}
        isPatchHidden={false}
        patchId="patch_id"
      />
    </MockedProvider>,
  );
  return renderWithRouterMatch(<Component />);
};

const openUnschedulePopconfirm = async (
  user: ReturnType<typeof userEvent.setup>,
) => {
  await user.click(screen.getByTestId("patch-card-dropdown"));
  await user.click(await screen.findByTestId("unschedule-patch"));
  await waitFor(() => {
    expect(screen.getByTestId("unschedule-patch-popconfirm")).toBeVisible();
  });
};

describe("patch card dropdown menu", () => {
  it("keeps the menu open when a popconfirm item is selected", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openUnschedulePopconfirm(user);
    expect(screen.getByRole("menu")).toBeVisible();
  });

  it("highlights the item whose popconfirm is open", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openUnschedulePopconfirm(user);
    expect(screen.getByTestId("unschedule-patch").className).toMatch(
      /openItem/,
    );
  });

  it("closes the popconfirm first on Escape, then the menu", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openUnschedulePopconfirm(user);

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        screen.queryByTestId("unschedule-patch-popconfirm"),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole("menu")).toBeVisible();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("disables the unschedule item while the mutation is in flight", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openUnschedulePopconfirm(user);

    await user.click(screen.getByTestId("popconfirm-confirm-button"));

    await waitFor(() => {
      expect(screen.getByTestId("unschedule-patch")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });

  it("closes the menu once the popconfirm is confirmed", async () => {
    const user = userEvent.setup();
    renderMenu();
    await openUnschedulePopconfirm(user);

    await user.click(screen.getByTestId("popconfirm-confirm-button"));

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
