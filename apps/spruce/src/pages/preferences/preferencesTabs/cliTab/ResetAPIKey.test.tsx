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
  ResetUserApiKeyMutation,
  ResetUserApiKeyMutationVariables,
} from "gql/generated/types";
import { RESET_USER_API_KEY } from "gql/mutations";
import { ResetAPIKey } from "./ResetAPIKey";

describe("ResetAPIKey", () => {
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
    const user = userEvent.setup();
    let mutationCalled = false;

    const mockWithNewData = {
      request: {
        query: RESET_USER_API_KEY,
        variables: {},
      },
      result: () => {
        mutationCalled = true;
        return {
          data: {
            resetAPIKey: {
              __typename: "UserConfig",
              api_key: "new-api-key-12345",
              user: "test-user",
            },
          },
        };
      },
    };

    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[mockWithNewData]}>
        <ResetAPIKey />
      </MockedProvider>,
    );
    render(<Component />);

    const button = screen.getByRole("button", { name: "Reset key" });
    await user.click(button);

    await waitFor(() => {
      expect(mutationCalled).toBe(true);
    });
  });

  it("shows error toast on mutation failure", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[resetUserAPIKeyErrorMock]}>
        <ResetAPIKey />
      </MockedProvider>,
    );
    render(<Component />);

    await user.click(screen.getByRole("button", { name: "Reset key" }));

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    });

    expect(dispatchToast.error).toHaveBeenCalledWith("Error resetting API key");
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
        __typename: "UserConfig",
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
