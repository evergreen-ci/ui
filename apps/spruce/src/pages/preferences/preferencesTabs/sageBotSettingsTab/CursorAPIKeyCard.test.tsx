import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import {
  CursorSettingsQuery,
  CursorSettingsQueryVariables,
} from "gql/generated/types";
import { DELETE_CURSOR_API_KEY } from "gql/mutations";
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
