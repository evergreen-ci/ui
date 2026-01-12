import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Code } from "@leafygreen-ui/code";
import { Body, BodyProps, InlineCode } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { SettingsCard } from "components/SettingsCard";
import {
  ClientConfigQuery,
  ClientConfigQueryVariables,
} from "gql/generated/types";
import { CLIENT_CONFIG } from "gql/queries";

export const VerifyCard = () => {
  const { data } = useQuery<ClientConfigQuery, ClientConfigQueryVariables>(
    CLIENT_CONFIG,
  );

  const latestRevision = data?.clientConfig?.latestRevision;
  const verificationCode = `
[message='Binary is already up to date - not updating.' revision='${latestRevision}']`;

  return (
    <SettingsCard>
      <StyledBody>
        On the command line, type <InlineCode>evergreen get-update</InlineCode>.
        It should display:
      </StyledBody>
      <Code copyButtonAppearance="none" language="shell">
        {verificationCode}
      </Code>
    </SettingsCard>
  );
};

const StyledBody = styled(Body)<BodyProps>`
  margin-bottom: ${size.s};
`;
