import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant as ButtonVariant } from "@leafygreen-ui/button";
import { Body, Link } from "@leafygreen-ui/typography";
import TextInput from "@leafygreen-ui/text-input";
import { palette } from "@leafygreen-ui/palette";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { post } from "@evg-ui/lib/utils/request/post";
import { del } from "@evg-ui/lib/utils/request/delete";
import { getApiUrl } from "@evg-ui/lib/utils/environmentVariables";
import { SettingsCardTitle, formComponentSpacingCSS } from "components/SettingsCard";
import { size } from "@evg-ui/lib/constants/tokens";

const { gray } = palette;

const CURSOR_SETTINGS_URL = "https://www.cursor.com/settings";
const API_ENDPOINT = "/pr-bot/user/cursor-key";

type CursorKeyResponse = {
  success: boolean;
  keyLastFour?: string;
};

export const CursorApiKeySettings: React.FC = () => {
  const dispatchToast = useToastContext();
  const [apiKey, setApiKey] = useState("");
  const [keyLastFour, setKeyLastFour] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      dispatchToast.warning("Please enter a Cursor API key");
      return;
    }

    setIsLoading(true);
    const url = `${getApiUrl()}${API_ENDPOINT}`;
    const response = await post(
      url,
      { key: apiKey.trim() },
      (error) => {
        const errorMessage = error instanceof Error ? error.message : "Failed to save Cursor API key";
        dispatchToast.error(errorMessage);
        setIsLoading(false);
      }
    );
    
    if (response) {
      try {
        const data = (await response.json()) as CursorKeyResponse;
        if (data.success) {
          const wasUpdating = !!keyLastFour;
          setKeyLastFour(data.keyLastFour || null);
          setApiKey("");
          setIsUpdating(false);
          dispatchToast.success(wasUpdating ? "Cursor API key updated successfully" : "Cursor API key saved successfully");
        } else {
          dispatchToast.error("Failed to save Cursor API key");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to save Cursor API key";
        dispatchToast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const url = `${getApiUrl()}${API_ENDPOINT}`;
    const response = await del(
      url,
      (error) => {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete Cursor API key";
        dispatchToast.error(errorMessage);
        setIsDeleting(false);
      }
    );
    
    if (response) {
      setKeyLastFour(null);
      dispatchToast.success("Cursor API key deleted successfully");
      setIsDeleting(false);
    }
  };

  return (
    <Container>
      <SettingsCardTitle>Cursor API Key</SettingsCardTitle>
      <Body>
        Register your Cursor API key to enable the sage-bot to act on your behalf when processing Jira tickets and creating PRs. 
        Your key is encrypted and stored securely.
      </Body>
      
      <InstructionsContainer>
        <Body weight="medium">How to get your API key:</Body>
        <Body>
          1. Visit{" "}
          <Link href={CURSOR_SETTINGS_URL} target="_blank" rel="noopener noreferrer">
            Cursor Settings
          </Link>
        </Body>
        <Body>2. Generate a new API key</Body>
        <Body>3. Copy and paste it below</Body>
      </InstructionsContainer>

      {keyLastFour && !isUpdating ? (
        <ExistingKeyContainer>
          <Body>
            <strong>Current key:</strong> <MaskedKey>___*{keyLastFour}</MaskedKey>
          </Body>
          <ButtonContainer>
            <Button
              data-cy="update-cursor-key-button"
              onClick={() => setIsUpdating(true)}
              variant={ButtonVariant.Default}
            >
              Update key
            </Button>
            <Button
              data-cy="delete-cursor-key-button"
              onClick={handleDelete}
              disabled={isDeleting}
              variant={ButtonVariant.Danger}
            >
              {isDeleting ? "Deleting..." : "Delete key"}
            </Button>
          </ButtonContainer>
        </ExistingKeyContainer>
      ) : (
        <InputContainer>
          <TextInput
            data-cy="cursor-api-key-input"
            label="Cursor API Key"
            description={keyLastFour ? "Enter a new Cursor API key to update" : "Enter your Cursor API key"}
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Cursor API key"
          />
          <ButtonContainer>
            {isUpdating && (
              <Button
                data-cy="cancel-update-cursor-key-button"
                onClick={() => {
                  setIsUpdating(false);
                  setApiKey("");
                }}
                variant={ButtonVariant.Default}
              >
                Cancel
              </Button>
            )}
            <Button
              data-cy="save-cursor-key-button"
              onClick={handleSave}
              disabled={isLoading || !apiKey.trim()}
              variant={ButtonVariant.Primary}
            >
              {isLoading ? "Saving..." : keyLastFour ? "Update key" : "Save key"}
            </Button>
          </ButtonContainer>
        </InputContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${formComponentSpacingCSS}
`;

const InstructionsContainer = styled.div`
  margin: ${size.m} 0;
  
  > * {
    margin-bottom: ${size.xs};
  }
`;

const InputContainer = styled.div`
  margin-top: ${size.m};
  display: flex;
  flex-direction: column;
  gap: ${size.m};
  max-width: 500px;
`;

const ExistingKeyContainer = styled.div`
  margin-top: ${size.m};
  display: flex;
  flex-direction: column;
  gap: ${size.m};
  align-items: flex-start;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.s};
  align-items: center;
`;

const MaskedKey = styled.span`
  font-family: monospace;
  background-color: ${gray.light2};
  padding: 2px 8px;
  border-radius: 4px;
`;
