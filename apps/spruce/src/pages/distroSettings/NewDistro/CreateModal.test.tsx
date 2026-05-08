import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  MockedResponse,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  CreateDistroMutation,
  CreateDistroMutationVariables,
} from "gql/generated/types";
import { CREATE_DISTRO } from "gql/mutations";
import { CreateModal } from "./CreateModal";

const newDistroId = "new-distro";

const Modal = ({
  createMock = createDistroMock,
  open = true,
}: {
  createMock?: MockedResponse;
  open?: boolean;
}) => (
  <MockedProvider mocks={[createMock]}>
    <CreateModal handleClose={() => {}} open={open} />
  </MockedProvider>
);

describe("create distro modal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("does not render the modal when open prop is false", () => {
    const { Component } = RenderFakeToastContext(<Modal open={false} />);
    render(<Component />);

    expect(screen.queryByDataCy("create-distro-modal")).not.toBeVisible();
  });

  it("disables the confirm button on initial render and uses the provided label", () => {
    const { Component } = RenderFakeToastContext(<Modal />);
    render(<Component />);

    expect(screen.getByDataCy("create-distro-modal")).toBeVisible();
    expect(screen.queryByText("Create New Distro")).toBeVisible();

    const confirmButton = screen.getByRole("button", {
      name: "Create",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
  });

  it("submits the modal when a distro name is provided", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(<Modal />);
    const { router } = render(<Component />);

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(screen.queryByDataCy("distro-id-input"), newDistroId);
    await user.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(router.state.location.pathname).toBe(
      `/distro/${newDistroId}/settings/general`,
    );
  });

  it("allows creating a single task distro", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal createMock={createSingleTaskDistroMock} />,
    );
    const { router } = render(<Component />);

    await user.type(
      screen.queryByDataCy("distro-id-input") as HTMLElement,
      newDistroId,
    );
    await user.click(screen.getByText("Single Task Distro"));
    await user.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(router.state.location.pathname).toBe(
      `/distro/${newDistroId}/settings/general`,
    );
  });

  it("disables the create button when project name contains a space", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<Modal />);
    render(<Component />);

    await user.type(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      screen.queryByDataCy("distro-id-input"),
      "string with spaces",
    );
    expect(
      screen.getByRole("button", {
        name: "Create",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("shows an error toast when an error is returned", async () => {
    const mockWithError: ApolloMock<
      CreateDistroMutation,
      CreateDistroMutationVariables
    > = {
      request: {
        query: CREATE_DISTRO,
        variables: {
          opts: {
            newDistroId,
          },
        },
      },
      result: {
        errors: [new GraphQLError("There was an error creating the distro")],
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal createMock={mockWithError} />,
    );
    const { router } = render(<Component />);

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(screen.queryByDataCy("distro-id-input"), newDistroId);

    const confirmButton = screen.getByRole("button", {
      name: "Create",
    });
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(1));
    expect(router.state.location.pathname).toBe("/");
  });
});

const createDistroMock: ApolloMock<
  CreateDistroMutation,
  CreateDistroMutationVariables
> = {
  request: {
    query: CREATE_DISTRO,
    variables: {
      opts: {
        newDistroId,
        singleTaskDistro: false,
      },
    },
  },
  result: {
    data: {
      createDistro: {
        __typename: "NewDistroPayload",
        newDistroId,
      },
    },
  },
};

const createSingleTaskDistroMock: ApolloMock<
  CreateDistroMutation,
  CreateDistroMutationVariables
> = {
  request: {
    query: CREATE_DISTRO,
    variables: {
      opts: {
        newDistroId,
        singleTaskDistro: true,
      },
    },
  },
  result: {
    data: {
      createDistro: {
        __typename: "NewDistroPayload",
        newDistroId,
      },
    },
  },
};
