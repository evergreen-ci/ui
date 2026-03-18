import { useMutation } from "@apollo/client/react";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { Tooltip } from "@leafygreen-ui/tooltip";
import Icon from "@evg-ui/lib/components/Icon";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import {
  RefreshGithubStatusesMutation,
  RefreshGithubStatusesMutationVariables,
} from "gql/generated/types";
import { REFRESH_GITHUB_STATUSES } from "gql/mutations";

interface Props {
  versionId: string;
  disabled: boolean;
}

export const ResendGitHubStatuses: React.FC<Props> = ({
  disabled,
  versionId,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(versionId);

  const [refreshGitHubStatuses] = useMutation<
    RefreshGithubStatusesMutation,
    RefreshGithubStatusesMutationVariables
  >(REFRESH_GITHUB_STATUSES, {
    onCompleted: () => {
      dispatchToast.success(`Triggered job to refresh GitHub statuses.`);
    },
    onError: (err) => {
      dispatchToast.error(`Unable to refresh GitHub statuses: ${err.message}`);
    },
  });

  return (
    <Tooltip
      enabled={disabled}
      style={{ textAlign: "left" }}
      trigger={
        <Button
          disabled={disabled}
          leftGlyph={<Icon glyph="GitHub" />}
          onClick={() => {
            sendEvent({ name: "Clicked resend GitHub statuses button" });
            refreshGitHubStatuses({ variables: { versionId } });
          }}
          size={ButtonSize.Small}
        >
          Refresh statuses
        </Button>
      }
    >
      Only available for GitHub PRs and GitHub Merge Queue patches.
    </Tooltip>
  );
};
