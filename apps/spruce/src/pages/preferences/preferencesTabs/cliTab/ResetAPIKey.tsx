import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import Icon from "@evg-ui/lib/components/Icon";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import {
  ResetUserApiKeyMutation,
  ResetUserApiKeyMutationVariables,
} from "gql/generated/types";
import { RESET_USER_API_KEY } from "gql/mutations";

export const ResetAPIKey: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const [resetUserAPIKey] = useMutation<
    ResetUserApiKeyMutation,
    ResetUserApiKeyMutationVariables
  >(RESET_USER_API_KEY, {
    onError: (err) => {
      dispatchToast.error(err.message);
    },
  });

  const handleClick = () => {
    sendEvent({ name: "Clicked reset API key" });
    resetUserAPIKey();
  };

  return (
    <Button leftGlyph={<Icon glyph="Refresh" />} onClick={handleClick}>
      Reset key
    </Button>
  );
};
