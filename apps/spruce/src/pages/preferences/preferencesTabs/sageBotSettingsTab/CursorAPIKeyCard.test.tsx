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
  CursorApiKeyStatusQuery,
  CursorApiKeyStatusQueryVariables,
} from "gql/generated/types";
import { DELETE_CURSOR_API_KEY } from "gql/mutations";
import { CURSOR_API_KEY_STATUS } from "gql/queries";
import { CursorAPIKeyCard } from "./CursorAPIKeyCard";

describe("CursorAPIKeyCard", () => {
  it("renders with no key configured", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[cursorAPIKeyStatusNoKeyMock]}>
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
      <MockedProvider mocks={[cursorAPIKeyStatusWithKeyMock]}>
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
      <MockedProvider mocks={[cursorAPIKeyStatusNoKeyMock]}>
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
          cursorAPIKeyStatusWithKeyMock,
          deleteKeyMock,
          cursorAPIKeyStatusNoKeyMock,
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

const cursorAPIKeyStatusNoKeyMock: ApolloMock<
  CursorApiKeyStatusQuery,
  CursorApiKeyStatusQueryVariables
> = {
  request: {
    query: CURSOR_API_KEY_STATUS,
    variables: {},
  },
  result: {
    data: {
      cursorAPIKeyStatus: {
        __typename: "CursorAPIKeyStatus",
        keyConfigured: false,
        keyLastFour: "",
      },
    },
  },
};

const cursorAPIKeyStatusWithKeyMock: ApolloMock<
  CursorApiKeyStatusQuery,
  CursorApiKeyStatusQueryVariables
> = {
  request: {
    query: CURSOR_API_KEY_STATUS,
    variables: {},
  },
  result: {
    data: {
      cursorAPIKeyStatus: {
        __typename: "CursorAPIKeyStatus",
        keyConfigured: true,
        keyLastFour: "1234",
      },
    },
  },
};
