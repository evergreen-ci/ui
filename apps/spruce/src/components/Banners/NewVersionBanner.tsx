import styled from "@emotion/styled";
import { Banner } from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
import { fontSize } from "@evg-ui/lib/constants/tokens";
import { useVersionRefresh } from "@evg-ui/lib/hooks";

const { blue } = palette;

export const NewVersionBanner: React.FC = () => {
  const hasNewVersion = useVersionRefresh();

  return hasNewVersion ? (
    <Banner data-cy="new-version-banner" variant="info">
      Spruce has been updated.{" "}
      <RefreshLink onClick={() => window.location.reload()}>
        Refresh now.
      </RefreshLink>
    </Banner>
  ) : null;
};

const RefreshLink = styled.span`
  text-decoration: underline;
  text-decoration-color: ${blue.dark2};
  cursor: pointer;
  color: ${blue.dark2};
  font-size: ${fontSize.m};
`;
