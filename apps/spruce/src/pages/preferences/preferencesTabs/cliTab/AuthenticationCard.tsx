import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Variant } from "@leafygreen-ui/button";
import { Code } from "@leafygreen-ui/code";
import { CardSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import { UserConfigQuery, UserConfigQueryVariables } from "gql/generated/types";
import { USER_CONFIG } from "gql/queries";
import { ResetAPIKey } from "./ResetAPIKey";

export const AuthenticationCard = () => {
  const { data, loading } = useQuery<UserConfigQuery, UserConfigQueryVariables>(
    USER_CONFIG,
  );
  const { sendEvent } = usePreferencesAnalytics();

  if (loading || !data?.userConfig) {
    return <CardSkeleton />;
  }

  const authCode = `user: "${data.userConfig.user}"
api_key: "${data.userConfig.api_key}"
api_server_host: "${data.userConfig.api_server_host}"
ui_server_host: "${data.userConfig.ui_server_host}"
oauth:
    issuer: "${data.userConfig.oauth_issuer}"
    client_id: "${data.userConfig.oauth_client_id}"
    connector_id: "${data.userConfig.oauth_connector_id}"
    do_not_use_browser: false
`;

  const downloadFile = (e: React.MouseEvent) => {
    sendEvent({ name: "Clicked download auth file" });
    // This creates a text blob with the contents of `authCode`
    // It then creates a `a` element and generates an objectUrl pointing to the
    // text blob which is used to get the browser to download it as if it were a file
    e.preventDefault();
    const element = document.createElement("a");
    const file = new Blob([authCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `.evergreen.yml`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    URL.revokeObjectURL(element.href);
    document.body.removeChild(element);
  };

  return (
    <SettingsCard>
      <Subtitle>Authentication</Subtitle>
      <CodeContainer>
        <Code language="yaml">{authCode}</Code>
      </CodeContainer>
      <ButtonGroup>
        <Button onClick={downloadFile} variant={Variant.Primary}>
          Download file
        </Button>
        <ResetAPIKey />
      </ButtonGroup>
    </SettingsCard>
  );
};

const CodeContainer = styled.div`
  margin: ${size.m} 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${size.xs};
`;
