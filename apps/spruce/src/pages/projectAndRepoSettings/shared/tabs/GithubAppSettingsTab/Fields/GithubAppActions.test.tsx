import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  DeleteGithubAppCredentialsMutation,
  DeleteGithubAppCredentialsMutationVariables,
} from "gql/generated/types";
import { DELETE_GITHUB_APP_CREDENTIALS } from "gql/mutations";
import { GithubAppActions } from ".";

const Field = ({ isAppDefined }: { isAppDefined: boolean }) => (
  <MockedProvider mocks={[deleteAppCredentialsMock]}>
    <GithubAppActions
      {...({} as unknown as FieldProps)}
      uiSchema={{
        options: {
          projectId: "evergreen",
          isAppDefined,
        },
      }}
    />
  </MockedProvider>
);

describe("githubAppActions", () => {
  describe("app is not defined", () => {
    it("renders the banner and not the button", () => {
      const { Component } = RenderFakeToastContext(
        <Field isAppDefined={false} />,
      );
      render(<Component />);
      expect(
        screen.getByDataCy("github-app-credentials-banner"),
      ).toBeInTheDocument();
      expect(
        screen.queryByDataCy("delete-app-credentials-button"),
      ).not.toBeInTheDocument();
    });
  });

  describe("app is defined", () => {
    it("renders the button and not the banner", () => {
      const { Component } = RenderFakeToastContext(<Field isAppDefined />);
      render(<Component />);
      expect(
        screen.getByDataCy("delete-app-credentials-button"),
      ).toBeInTheDocument();
      expect(
        screen.queryByDataCy("github-app-credentials-banner"),
      ).not.toBeInTheDocument();
    });

    it("can delete the credentials via the modal", async () => {
      const user = userEvent.setup();

      const { Component, dispatchToast } = RenderFakeToastContext(
        <Field isAppDefined />,
      );
      render(<Component />);
      await user.click(screen.getByDataCy("delete-app-credentials-button"));
      expect(
        screen.getByDataCy("delete-github-credentials-modal"),
      ).toBeInTheDocument();
      const deleteButton = screen.getByRole("button", {
        name: "Delete",
      });
      expect(deleteButton).toBeEnabled();
      await user.click(deleteButton);
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "GitHub app credentials were successfully deleted.",
      );
    });
  });
});

const deleteAppCredentialsMock: ApolloMock<
  DeleteGithubAppCredentialsMutation,
  DeleteGithubAppCredentialsMutationVariables
> = {
  request: {
    query: DELETE_GITHUB_APP_CREDENTIALS,
    variables: {
      projectId: "evergreen",
    },
  },
  result: {
    data: {
      deleteGithubAppCredentials: {
        oldAppId: 12344,
      },
    },
  },
};
