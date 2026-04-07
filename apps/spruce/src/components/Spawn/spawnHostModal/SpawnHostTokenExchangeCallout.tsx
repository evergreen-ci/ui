import React from "react";
import { css } from "@emotion/react";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { Button } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { getSpawnHostTokenExchangeAuthorizeUrl } from "constants/externalResources";
import { UserQuery } from "gql/generated/types";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";
import {
  formatExpiresAtLocal,
  getReauthenticationOpensAt,
  isNeedlesslyFresh,
} from "./tokenExchange";

const containerCss = css`
  margin-top: ${size.s};
`;

interface Props {
  jwtTokenForCLIDisabled: boolean;
  startPolling: (pollInterval: number) => void;
  timeZone: string;
  user: UserQuery["user"] | undefined;
  userQueryLoading: boolean;
}

export const SpawnHostTokenExchangeCallout: React.FC<Props> = ({
  jwtTokenForCLIDisabled,
  startPolling,
  timeZone,
  user,
  userQueryLoading,
}) => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";
  const inFlight = user?.hasTokenExchangePending ?? false;
  const expiresAtRaw = user?.tokenAccessTokenExpiresAt;
  const expired =
    expiresAtRaw != null && new Date(expiresAtRaw).getTime() < Date.now();

  const authenticateDisabledByFreshToken = isNeedlesslyFresh(user);

  const bannerVariant = inFlight || expired ? Variant.Warning : Variant.Info;

  const openAuthorize = () => {
    startPolling(4000);
    window.open(
      getSpawnHostTokenExchangeAuthorizeUrl(),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div css={containerCss}>
      <Banner variant={bannerVariant}>
        {!jwtTokenForCLIDisabled ? (
          <Body>
            Evergreen uses temporary credentials for human users. Spawning a
            host that loads task data requires the browser authentication step
            while JWT tokens for the CLI are enabled (
            {jiraLinkify("DEVPROD-4160", jiraHost)}
            ). Use <strong>Authenticate spawn hosts</strong> below and finish in
            the other tab before you spawn.
          </Body>
        ) : (
          <Body>
            Evergreen is migrating to temporary credentials for human users. JWT
            tokens for the CLI are disabled on this deployment, so this step is
            optional for now ({jiraLinkify("DEVPROD-4160", jiraHost)}
            ). You can try the flow anytime with{" "}
            <strong>Authenticate spawn hosts</strong> below.
          </Body>
        )}
        <Button
          css={css`
            margin-top: ${size.xs};
          `}
          data-cy="spawn-host-token-exchange-authenticate"
          disabled={userQueryLoading || authenticateDisabledByFreshToken}
          onClick={openAuthorize}
          type="button"
          variant="primary"
        >
          Authenticate spawn hosts
        </Button>
        {!userQueryLoading &&
          authenticateDisabledByFreshToken &&
          expiresAtRaw != null && (
            <Body
              css={css`
                margin-top: ${size.xxs};
              `}
            >
              Your spawn hosts are authenticated until{" "}
              {formatExpiresAtLocal(
                getReauthenticationOpensAt(expiresAtRaw),
                timeZone,
              )}
              .
            </Body>
          )}
      </Banner>
    </div>
  );
};
