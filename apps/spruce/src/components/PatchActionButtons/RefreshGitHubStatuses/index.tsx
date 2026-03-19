import { useMutation } from "@apollo/client/react";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
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
}

export const RefreshGitHubStatuses: React.FC<Props> = ({ versionId }) => {
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
    <Button
      leftGlyph={<Icon glyph="GitHub" />}
      onClick={() => {
        sendEvent({ name: "Clicked resend GitHub statuses button" });
        refreshGitHubStatuses({ variables: { versionId } });
      }}
      size={ButtonSize.Small}
    >
      Refresh statuses
    </Button>
  );
};
