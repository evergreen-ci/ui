import { useEffect, useState } from "react";
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

const SUCCESS_DURATION = 2000;

export const ResetAPIKey: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const [resetUserAPIKey] = useMutation<
    ResetUserApiKeyMutation,
    ResetUserApiKeyMutationVariables
  >(RESET_USER_API_KEY, {
    onCompleted: () => {
      setSuccess(true);
    },
    onError: (err) => {
      dispatchToast.error(err.message);
    },
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccess(false);
    }, SUCCESS_DURATION);

    return () => clearTimeout(timeoutId);
  }, [success]);

  const handleClick = () => {
    sendEvent({ name: "Clicked reset API key" });
    resetUserAPIKey();
  };

  return (
    <Button
      leftGlyph={<Icon glyph={success ? "Checkmark" : "Refresh"} />}
      onClick={handleClick}
    >
      {success ? "Updated" : "Reset key"}
    </Button>
  );
};
