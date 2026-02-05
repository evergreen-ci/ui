import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { Card } from "@leafygreen-ui/card";
import { CardSkeleton } from "@leafygreen-ui/skeleton-loader";
import {
  InlineCode,
  Subtitle,
  Body,
  Disclaimer,
} from "@leafygreen-ui/typography";
import Accordion from "@evg-ui/lib/components/Accordion";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size, fontSize } from "@evg-ui/lib/constants/tokens";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import { cliDocumentationUrl } from "constants/externalResources";
import {
  ClientConfigQuery,
  ClientConfigQueryVariables,
  ClientBinary,
} from "gql/generated/types";
import { CLIENT_CONFIG } from "gql/queries";

export const DownloadCard = () => {
  const { data, loading } = useQuery<
    ClientConfigQuery,
    ClientConfigQueryVariables
  >(CLIENT_CONFIG);

  if (loading) {
    return <CardSkeleton />;
  }
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { clientConfig } = data;
  const { clientBinaries } = clientConfig || {};
  const topBinaries = clientBinaries.filter(filterBinaries);
  const otherBinaries = clientBinaries.filter(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    (binary) => !filterBinaries(binary),
  );

  return (
    <SettingsCard>
      <Subtitle>Command-Line Client</Subtitle>
      <CardDescription>
        <Body>
          View the{" "}
          <StyledLink href={cliDocumentationUrl}>documentation</StyledLink> or
          run <InlineCode>evergreen --help</InlineCode> or{" "}
          <InlineCode>evergreen [command] --help</InlineCode> for additional
          assistance.
        </Body>
      </CardDescription>
      <CardGroup>
        {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
        {topBinaries.map((binary) => (
          <CliDownloadBox
            key={`downloadBox_${binary.url}`}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            description={descriptions[binary.displayName]}
            link={binary.url}
            title={
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              prettyDisplayNameTop[binary.displayName] || binary.displayName
            }
          />
        ))}
      </CardGroup>
      <Accordion title="Show More" toggledTitle="Show Less">
        <ExpandableLinkContents clientBinaries={otherBinaries} />
      </Accordion>
    </SettingsCard>
  );
};

interface CliDownloadBoxProps {
  title: string;
  link: string | null;
  description?: string;
}
const CliDownloadBox: React.FC<CliDownloadBoxProps> = ({
  description,
  link,
  title,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  return (
    <CliDownloadCard>
      <CliDownloadTitle>{title}</CliDownloadTitle>
      {description && <Disclaimer>{description}</Disclaimer>}
      <CliDownloadButton
        as="a"
        disabled={!link}
        href={link ?? undefined}
        onClick={() => {
          sendEvent({
            name: "Clicked CLI download link",
            "download.name": title,
          });
        }}
        size="small"
      >
        Download
      </CliDownloadButton>
    </CliDownloadCard>
  );
};

interface ExpandableLinkContentsProps {
  clientBinaries: ClientBinary[];
}
const ExpandableLinkContents: React.FC<ExpandableLinkContentsProps> = ({
  clientBinaries,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  return (
    <LinkContainer>
      {clientBinaries.map((binary) => (
        <StyledLink
          key={`link_${binary.url}`}
          href={binary.url ?? ""}
          onClick={() => {
            sendEvent({
              name: "Clicked CLI download link",
              "download.name": binary.displayName || "",
            });
          }}
        >
          {binary.displayName}
        </StyledLink>
      ))}
    </LinkContainer>
  );
};

const descriptions = {
  "OSX 64-bit": "Intel CPU",
  "OSX ARM 64-bit": "M1 CPU",
};
const prettyDisplayNameTop = {
  "OSX ARM 64-bit": "macOS ARM",
  "Windows 64-bit": "Windows",
  "Linux 64-bit": "Linux (64-bit)",
};

const filterBinaries = (binary: ClientBinary) =>
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  /darwin_arm64\/|linux_amd64\/|windows_amd64\//.test(binary.url);

const CardGroup = styled.div`
  display: flex;
  gap: ${size.xs};
  margin-bottom: ${size.s};
`;

const CliDownloadCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${size.s};
`;

const CliDownloadButton = styled(Button)`
  align-self: flex-start;
  margin-top: ${size.xs};
`;

const CliDownloadTitle = styled(Subtitle)`
  font-weight: bold;
`;

const CardDescription = styled.div`
  font-size: ${fontSize.m};
  margin-bottom: ${size.m};
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${size.s};
`;
