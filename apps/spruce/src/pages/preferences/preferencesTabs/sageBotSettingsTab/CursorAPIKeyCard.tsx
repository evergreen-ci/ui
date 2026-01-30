import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Variant } from "@leafygreen-ui/button";
import { CardSkeleton } from "@leafygreen-ui/skeleton-loader";
import { TextInput } from "@leafygreen-ui/text-input";
import { Body, InlineKeyCode, Link, Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import {
  cursorAPIKeySettingsUrl,
  sageBotDocumentationUrl,
} from "constants/externalResources";
import {
  CursorSettingsQuery,
  CursorSettingsQueryVariables,
  DeleteCursorApiKeyMutation,
  DeleteCursorApiKeyMutationVariables,
  SetCursorApiKeyMutation,
  SetCursorApiKeyMutationVariables,
} from "gql/generated/types";
import { SET_CURSOR_API_KEY, DELETE_CURSOR_API_KEY } from "gql/mutations";
import { CURSOR_SETTINGS } from "gql/queries";

export const CursorAPIKeyCard = () => {
  const dispatchToast = useToastContext();
  const { sendEvent } = usePreferencesAnalytics();
  const [apiKey, setApiKey] = useState("");

  const { data, loading } = useQuery<
    CursorSettingsQuery,
    CursorSettingsQueryVariables
  >(CURSOR_SETTINGS);

  const [setCursorAPIKey, { loading: settingKey }] = useMutation<
    SetCursorApiKeyMutation,
    SetCursorApiKeyMutationVariables
  >(SET_CURSOR_API_KEY, {
    refetchQueries: ["CursorSettings"],
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
    refetchQueries: ["CursorSettings"],
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

  const keyConfigured = data?.cursorSettings?.keyConfigured ?? false;
  const keyLastFour = data?.cursorSettings?.keyLastFour ?? "";

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
        Your Cursor API key connects your account to{" "}
        <Link hideExternalIcon href={sageBotDocumentationUrl} target="_blank">
          Sage Bot
        </Link>
        , which automatically generates pull requests from Jira tickets. When
        you add the sage-bot label to a ticket assigned to you, Sage Bot uses
        your API key to:
      </Description>
      <BenefitsList>
        <li>
          <strong>Create PRs under your identity</strong> — commits and PRs are
          attributed to you, not a service account
        </li>
        <li>
          <strong>Track usage costs</strong> — API usage is tied to your Cursor
          account
        </li>
        <li>
          <strong>Enable session access</strong> — view and interact with the AI
          agent&apos;s work in Cursor IDE or web UI
        </li>
      </BenefitsList>
      <Description>
        Don&apos;t have a key?{" "}
        <Link hideExternalIcon href={cursorAPIKeySettingsUrl} target="_blank">
          Generate one in Cursor settings
        </Link>
        .
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

const BenefitsList = styled.ul`
  margin: ${size.s} 0;
  padding-left: ${size.l};

  li {
    margin-bottom: ${size.xs};
  }
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
