import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  DeleteGithubAppCredentialsMutation,
  DeleteGithubAppCredentialsMutationVariables,
} from "gql/generated/types";
import { DELETE_GITHUB_APP_CREDENTIALS } from "gql/mutations";
import { GithubAppActions } from ".";

const Field = ({
  hasRepoApp = false,
  isAppDefined,
}: {
  hasRepoApp?: boolean;
  isAppDefined: boolean;
}) => (
  <MockedProvider mocks={[deleteAppCredentialsMock]}>
    <GithubAppActions
      {...({} as unknown as FieldProps)}
      uiSchema={{
        options: {
          projectId: "evergreen",
          isAppDefined,
          hasRepoApp,
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

  describe("app is defined and no repo app", () => {
    it("renders the delete button and rate limit warnings", () => {
      const { Component } = RenderFakeToastContext(<Field isAppDefined />);
      render(<Component />);
      expect(
        screen.getByDataCy("delete-app-credentials-button"),
      ).toBeInTheDocument();
      expect(
        screen.getByDataCy("github-app-rate-limit-banner"),
      ).toBeInTheDocument();
      expect(
        screen.queryByDataCy("github-app-credentials-banner"),
      ).not.toBeInTheDocument();
    });

    it("shows warning in the delete modal", async () => {
      const user = userEvent.setup();

      const { Component } = RenderFakeToastContext(<Field isAppDefined />);
      render(<Component />);
      await user.click(screen.getByDataCy("delete-app-credentials-button"));
      expect(
        screen.getByDataCy("delete-credentials-warning-banner"),
      ).toBeInTheDocument();
    });

    it("can delete the credentials via the modal", async () => {
      const user = userEvent.setup();

      const { Component, dispatchToast } = RenderFakeToastContext(
        <Field isAppDefined />,
      );
      render(<Component />);
      await user.click(screen.getByDataCy("delete-app-credentials-button"));
      const deleteButton = screen.getByRole("button", {
        name: "Delete",
      });
      expect(deleteButton).toBeEnabled();
      await user.click(deleteButton);
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "GitHub app credentials were successfully deleted.",
        );
      });
    });
  });

  describe("app is defined and repo app exists", () => {
    it("renders the delete button without rate limit warnings", () => {
      const { Component } = RenderFakeToastContext(
        <Field hasRepoApp isAppDefined />,
      );
      render(<Component />);
      expect(
        screen.getByDataCy("delete-app-credentials-button"),
      ).toBeInTheDocument();
      expect(
        screen.queryByDataCy("github-app-rate-limit-banner"),
      ).not.toBeInTheDocument();
    });

    it("does not show warning in the delete modal", async () => {
      const user = userEvent.setup();

      const { Component } = RenderFakeToastContext(
        <Field hasRepoApp isAppDefined />,
      );
      render(<Component />);
      await user.click(screen.getByDataCy("delete-app-credentials-button"));
      expect(
        screen.queryByDataCy("delete-credentials-warning-banner"),
      ).not.toBeInTheDocument();
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
