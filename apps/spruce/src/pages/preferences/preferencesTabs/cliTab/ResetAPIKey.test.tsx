import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  ResetUserApiKeyMutation,
  ResetUserApiKeyMutationVariables,
} from "gql/generated/types";
import { RESET_USER_API_KEY } from "gql/mutations";
import { ResetAPIKey } from "./ResetAPIKey";

describe("ResetAPIKey", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders with default state", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[resetUserAPIKeyMock]}>
        <ResetAPIKey />
      </MockedProvider>,
    );
    render(<Component />);

    expect(
      screen.getByRole("button", { name: "Reset key" }),
    ).toBeInTheDocument();
  });

  it("calls mutation when button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[resetUserAPIKeyMock]}>
        <ResetAPIKey />
      </MockedProvider>,
    );
    render(<Component />);

    const button = screen.getByRole("button", { name: "Reset key" });
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Updated" }),
      ).toBeInTheDocument();
    });
  });

  it("shows success state after successful mutation", async () => {
    const user = userEvent.setup({ delay: null });
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[resetUserAPIKeyMock]}>
        <ResetAPIKey />
      </MockedProvider>,
    );
    render(<Component />);

    const button = screen.getByRole("button", { name: "Reset key" });
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Updated" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Reset key" }),
    ).not.toBeInTheDocument();
  });

  it("reverts to default state after success timeout", async () => {
    const user = userEvent.setup({ delay: null });
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[resetUserAPIKeyMock]}>
        <ResetAPIKey />
      </MockedProvider>,
    );
    render(<Component />);

    const button = screen.getByRole("button", { name: "Reset key" });
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Updated" }),
      ).toBeInTheDocument();
    });

    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Reset key" }),
      ).toBeInTheDocument();
    });
  });

  it("shows error toast on mutation failure", async () => {
    const user = userEvent.setup({ delay: null });
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[resetUserAPIKeyErrorMock]}>
        <ResetAPIKey />
      </MockedProvider>,
    );
    render(<Component />);

    const button = screen.getByRole("button", { name: "Reset key" });
    await user.click(button);

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    });

    expect(dispatchToast.error).toHaveBeenCalledWith("Error resetting API key");
  });

  it("does not show success state on mutation failure", async () => {
    const user = userEvent.setup({ delay: null });
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[resetUserAPIKeyErrorMock]}>
        <ResetAPIKey />
      </MockedProvider>,
    );
    render(<Component />);

    const button = screen.getByRole("button", { name: "Reset key" });
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Reset key" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Updated" }),
    ).not.toBeInTheDocument();
  });
});

const resetUserAPIKeyMock: ApolloMock<
  ResetUserApiKeyMutation,
  ResetUserApiKeyMutationVariables
> = {
  request: {
    query: RESET_USER_API_KEY,
    variables: {},
  },
  result: {
    data: {
      resetAPIKey: {
        __typename: "APIKey",
        api_key: "new-api-key-12345",
        user: "test-user",
      },
    },
  },
};

const resetUserAPIKeyErrorMock: ApolloMock<
  ResetUserApiKeyMutation,
  ResetUserApiKeyMutationVariables
> = {
  request: {
    query: RESET_USER_API_KEY,
    variables: {},
  },
  error: new Error("Error resetting API key"),
};
