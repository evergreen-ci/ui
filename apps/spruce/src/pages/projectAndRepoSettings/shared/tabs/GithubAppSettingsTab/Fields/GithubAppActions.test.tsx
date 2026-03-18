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
  ProjectSettingsSection,
  SaveProjectSettingsForSectionMutation,
  SaveProjectSettingsForSectionMutationVariables,
} from "gql/generated/types";
import { SAVE_PROJECT_SETTINGS_FOR_SECTION } from "gql/mutations";
import { GithubAppActions } from ".";

const Field = ({
  isAppDefined,
  isRepo = false,
}: {
  isAppDefined: boolean;
  isRepo?: boolean;
}) => (
  <MockedProvider mocks={[replaceAppCredentialsMock]}>
    <GithubAppActions
      {...({} as unknown as FieldProps)}
      uiSchema={{
        options: {
          projectId: "evergreen",
          isAppDefined,
          isRepo,
        },
      }}
    />
  </MockedProvider>
);

describe("githubAppActions", () => {
  describe("app is not defined", () => {
    it("renders the banner and not the replace button", () => {
      const { Component } = RenderFakeToastContext(
        <Field isAppDefined={false} />,
      );
      render(<Component />);
      expect(
        screen.getByDataCy("github-app-credentials-banner"),
      ).toBeInTheDocument();
      expect(
        screen.queryByDataCy("replace-app-credentials-button"),
      ).not.toBeInTheDocument();
    });
  });

  describe("app is defined", () => {
    it("renders the replace button and not the banner", () => {
      const { Component } = RenderFakeToastContext(<Field isAppDefined />);
      render(<Component />);
      expect(
        screen.getByDataCy("replace-app-credentials-button"),
      ).toBeInTheDocument();
      expect(
        screen.queryByDataCy("github-app-credentials-banner"),
      ).not.toBeInTheDocument();
    });

    it("can replace credentials via the modal", async () => {
      const user = userEvent.setup();

      const { Component, dispatchToast } = RenderFakeToastContext(
        <Field isAppDefined />,
      );
      render(<Component />);
      await user.click(screen.getByDataCy("replace-app-credentials-button"));
      expect(
        screen.getByDataCy("replace-github-credentials-modal"),
      ).toBeInTheDocument();

      // Replace button should be disabled without input
      const replaceButton = screen.getByRole("button", {
        name: "Replace",
      });
      expect(replaceButton).toHaveAttribute("aria-disabled", "true");

      // Fill in new credentials
      await user.type(screen.getByDataCy("replace-app-id-input"), "99999");
      await user.type(
        screen.getByDataCy("replace-private-key-input"),
        "new-private-key",
      );
      expect(replaceButton).not.toHaveAttribute("aria-disabled", "true");

      await user.click(replaceButton);
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "GitHub app credentials were successfully replaced.",
        );
      });
    });
  });
});

const replaceAppCredentialsMock: ApolloMock<
  SaveProjectSettingsForSectionMutation,
  SaveProjectSettingsForSectionMutationVariables
> = {
  request: {
    query: SAVE_PROJECT_SETTINGS_FOR_SECTION,
    variables: {
      projectSettings: {
        projectId: "evergreen",
        githubAppAuth: {
          appId: 99999,
          privateKey: "new-private-key",
        },
        projectRef: { id: "evergreen" },
      },
      section: ProjectSettingsSection.GithubAppSettings,
    },
  },
  result: {
    data: {
      saveProjectSettingsForSection: {
        projectRef: {
          id: "evergreen",
          identifier: "evergreen",
        },
      },
    },
  },
};
