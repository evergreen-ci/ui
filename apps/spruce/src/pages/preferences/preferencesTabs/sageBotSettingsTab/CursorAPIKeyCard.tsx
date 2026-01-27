import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { CardSkeleton } from "@leafygreen-ui/skeleton-loader";
import TextInput from "@leafygreen-ui/text-input";
import { Body, InlineKeyCode, Link, Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import { cursorAPIKeySettingsUrl } from "constants/externalResources";
import {
  CursorApiKeyStatusQuery,
  CursorApiKeyStatusQueryVariables,
  DeleteCursorApiKeyMutation,
  DeleteCursorApiKeyMutationVariables,
  SetCursorApiKeyMutation,
  SetCursorApiKeyMutationVariables,
} from "gql/generated/types";
import { SET_CURSOR_API_KEY, DELETE_CURSOR_API_KEY } from "gql/mutations";
import { CURSOR_API_KEY_STATUS } from "gql/queries";

export const CursorAPIKeyCard = () => {
  const dispatchToast = useToastContext();
  const { sendEvent } = usePreferencesAnalytics();
  const [apiKey, setApiKey] = useState("");

  const { data, loading } = useQuery<
    CursorApiKeyStatusQuery,
    CursorApiKeyStatusQueryVariables
  >(CURSOR_API_KEY_STATUS);

  const [setCursorAPIKey, { loading: settingKey }] = useMutation<
    SetCursorApiKeyMutation,
    SetCursorApiKeyMutationVariables
  >(SET_CURSOR_API_KEY, {
    refetchQueries: ["CursorAPIKeyStatus"],
    onCompleted: (result) => {
      if (result.setCursorAPIKey.success) {
        dispatchToast.success("Cursor API key saved successfully.");
        setApiKey("");
      }
    },
    onError: (err) => {
      dispatchToast.error(`Error saving Cursor API key: ${err.message}`);
    },
  });

  const [deleteCursorAPIKey, { loading: deletingKey }] = useMutation<
    DeleteCursorApiKeyMutation,
    DeleteCursorApiKeyMutationVariables
  >(DELETE_CURSOR_API_KEY, {
    refetchQueries: ["CursorAPIKeyStatus"],
    onCompleted: (result) => {
      if (result.deleteCursorAPIKey.success) {
        dispatchToast.success("Cursor API key deleted successfully.");
      }
    },
    onError: (err) => {
      dispatchToast.error(`Error deleting Cursor API key: ${err.message}`);
    },
  });

  if (loading) {
    return <CardSkeleton />;
  }

  const keyConfigured = data?.cursorAPIKeyStatus?.keyConfigured ?? false;
  const keyLastFour = data?.cursorAPIKeyStatus?.keyLastFour ?? "";

  const handleSave = () => {
    sendEvent({ name: "Saved Cursor API key" });
    setCursorAPIKey({ variables: { apiKey } });
  };

  const handleDelete = () => {
    sendEvent({ name: "Deleted Cursor API key" });
    deleteCursorAPIKey();
  };

  return (
    <SettingsCard data-cy="cursor-api-key-card">
      <Subtitle>Cursor API Key</Subtitle>
      <Description>
        Your Cursor API key enables sage-bot to create PRs on your behalf. This
        provides proper attribution, cost tracking, and allows you to view and
        interact with agent sessions via the Cursor IDE or web UI.
      </Description>
      <Description>
        <Link hideExternalIcon href={cursorAPIKeySettingsUrl} target="_blank">
          Generate your API key in Cursor settings
        </Link>
      </Description>

      {keyConfigured ? (
        <KeyStatusContainer data-cy="cursor-key-status">
          <Body>
            Key configured: <InlineKeyCode>••••••••{keyLastFour}</InlineKeyCode>
          </Body>
          <ButtonGroup>
            <Button
              data-cy="delete-cursor-api-key-button"
              disabled={deletingKey}
              onClick={handleDelete}
              variant={Variant.Danger}
            >
              Delete key
            </Button>
          </ButtonGroup>
        </KeyStatusContainer>
      ) : null}

      <InputContainer>
        <TextInput
          aria-label="Cursor API Key"
          data-cy="cursor-api-key-input"
          label={keyConfigured ? "Update API key" : "Enter API key"}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Cursor API key"
          type="password"
          value={apiKey}
        />
      </InputContainer>
      <ButtonGroup>
        <Button
          data-cy="save-cursor-api-key-button"
          disabled={!apiKey || settingKey}
          onClick={handleSave}
          variant={Variant.Primary}
        >
          {keyConfigured ? "Update key" : "Save key"}
        </Button>
      </ButtonGroup>
    </SettingsCard>
  );
};

const Description = styled(Body)`
  margin: ${size.s} 0;
`;

const KeyStatusContainer = styled.div`
  margin: ${size.m} 0;
  display: flex;
  flex-direction: column;
  gap: ${size.s};
`;

const InputContainer = styled.div`
  margin: ${size.m} 0;
  max-width: 400px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${size.xs};
`;
