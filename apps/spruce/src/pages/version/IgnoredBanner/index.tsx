import styled from "@emotion/styled";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { ignoredFilesDocumentationUrl } from "constants/externalResources";

export const IgnoredBanner: React.FC = () => (
  <BannerContainer data-cy="ignored-banner">
    <Banner variant={Variant.Info}>
      This revision will not be automatically scheduled, because only{" "}
      <StyledLink href={ignoredFilesDocumentationUrl} target="_blank">
        ignored files
      </StyledLink>{" "}
      are changed. It may still be scheduled manually, or on failure stepback.
    </Banner>
  </BannerContainer>
);

const BannerContainer = styled.div`
  margin-bottom: ${size.s};
`;
