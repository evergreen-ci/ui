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
  CursorSettingsQuery,
  CursorSettingsQueryVariables,
  SetCursorApiKeyMutation,
  SetCursorApiKeyMutationVariables,
} from "gql/generated/types";
import { DELETE_CURSOR_API_KEY, SET_CURSOR_API_KEY } from "gql/mutations";
import { CURSOR_SETTINGS } from "gql/queries";
import { CursorAPIKeyCard } from "./CursorAPIKeyCard";

describe("CursorAPIKeyCard", () => {
  it("renders with no key configured", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[cursorSettingsNoKeyMock]}>
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText("Cursor API Key")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Save key" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete key" }),
    ).not.toBeInTheDocument();
  });

  it("renders with key configured", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[cursorSettingsWithKeyMock]}>
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText(/••••••••1234/)).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Update key" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete key" }),
    ).toBeInTheDocument();
  });

  it("save button is disabled when input is empty", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[cursorSettingsNoKeyMock]}>
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText("Cursor API Key")).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: "Save key" });
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("calls delete mutation when delete button is clicked", async () => {
    const user = userEvent.setup();
    let mutationCalled = false;

    const deleteKeyMock = {
      request: {
        query: DELETE_CURSOR_API_KEY,
        variables: {},
      },
      result: () => {
        mutationCalled = true;
        return {
          data: {
            deleteCursorAPIKey: {
              __typename: "DeleteCursorAPIKeyPayload",
              success: true,
            },
          },
        };
      },
    };

    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          cursorSettingsWithKeyMock,
          deleteKeyMock,
          cursorSettingsNoKeyMock,
        ]}
      >
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText(/••••••••1234/)).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: "Delete key" });
    await user.click(button);

    await waitFor(() => {
      expect(mutationCalled).toBe(true);
    });
  });

  it("calls save mutation when save button is clicked", async () => {
    const user = userEvent.setup();
    let mutationCalled = false;

    const setKeyMock = {
      request: {
        query: SET_CURSOR_API_KEY,
        variables: { apiKey: "test-api-key" },
      },
      result: () => {
        mutationCalled = true;
        return {
          data: {
            setCursorAPIKey: {
              __typename: "SetCursorAPIKeyPayload" as const,
              keyLastFour: "key0",
              success: true,
            },
          },
        };
      },
    };

    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[cursorSettingsNoKeyMock, setKeyMock, cursorSettingsWithKeyMock]}
      >
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText("Cursor API Key")).toBeInTheDocument();
    });

    const input = screen.getByLabelText("Cursor API Key");
    await user.type(input, "test-api-key");

    const button = screen.getByRole("button", { name: "Save key" });
    await user.click(button);

    await waitFor(() => {
      expect(mutationCalled).toBe(true);
    });
  });

  it("shows success toast when save mutation succeeds", async () => {
    const user = userEvent.setup();

    const setKeyMock: ApolloMock<
      SetCursorApiKeyMutation,
      SetCursorApiKeyMutationVariables
    > = {
      request: {
        query: SET_CURSOR_API_KEY,
        variables: { apiKey: "test-api-key" },
      },
      result: {
        data: {
          setCursorAPIKey: {
            __typename: "SetCursorAPIKeyPayload",
            keyLastFour: "key0",
            success: true,
          },
        },
      },
    };

    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[cursorSettingsNoKeyMock, setKeyMock, cursorSettingsWithKeyMock]}
      >
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText("Cursor API Key")).toBeInTheDocument();
    });

    const input = screen.getByLabelText("Cursor API Key");
    await user.type(input, "test-api-key");
    await user.click(screen.getByRole("button", { name: "Save key" }));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Cursor API key saved successfully.",
      );
    });
  });

  it("shows error toast when save mutation fails", async () => {
    const user = userEvent.setup();

    const setKeyErrorMock: ApolloMock<
      SetCursorApiKeyMutation,
      SetCursorApiKeyMutationVariables
    > = {
      request: {
        query: SET_CURSOR_API_KEY,
        variables: { apiKey: "test-api-key" },
      },
      error: new Error("Something went wrong"),
    };

    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[cursorSettingsNoKeyMock, setKeyErrorMock]}>
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText("Cursor API Key")).toBeInTheDocument();
    });

    const input = screen.getByLabelText("Cursor API Key");
    await user.type(input, "test-api-key");
    await user.click(screen.getByRole("button", { name: "Save key" }));

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    });
  });

  it("shows success toast when delete mutation succeeds", async () => {
    const user = userEvent.setup();

    const deleteKeyMock = {
      request: {
        query: DELETE_CURSOR_API_KEY,
        variables: {},
      },
      result: {
        data: {
          deleteCursorAPIKey: {
            __typename: "DeleteCursorAPIKeyPayload" as const,
            success: true,
          },
        },
      },
    };

    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          cursorSettingsWithKeyMock,
          deleteKeyMock,
          cursorSettingsNoKeyMock,
        ]}
      >
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText(/••••••••1234/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Delete key" }));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Cursor API key deleted successfully.",
      );
    });
  });

  it("shows error toast when delete mutation fails", async () => {
    const user = userEvent.setup();

    const deleteKeyErrorMock: ApolloMock<any, any> = {
      request: {
        query: DELETE_CURSOR_API_KEY,
        variables: {},
      },
      error: new Error("Delete failed"),
    };

    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[cursorSettingsWithKeyMock, deleteKeyErrorMock]}
      >
        <CursorAPIKeyCard />
      </MockedProvider>,
    );
    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText(/••••••••1234/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Delete key" }));

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    });
  });
});

const cursorSettingsNoKeyMock: ApolloMock<
  CursorSettingsQuery,
  CursorSettingsQueryVariables
> = {
  request: {
    query: CURSOR_SETTINGS,
    variables: {},
  },
  result: {
    data: {
      cursorSettings: {
        __typename: "CursorSettings",
        keyConfigured: false,
        keyLastFour: "",
      },
    },
  },
};

const cursorSettingsWithKeyMock: ApolloMock<
  CursorSettingsQuery,
  CursorSettingsQueryVariables
> = {
  request: {
    query: CURSOR_SETTINGS,
    variables: {},
  },
  result: {
    data: {
      cursorSettings: {
        __typename: "CursorSettings",
        keyConfigured: true,
        keyLastFour: "1234",
      },
    },
  },
};
