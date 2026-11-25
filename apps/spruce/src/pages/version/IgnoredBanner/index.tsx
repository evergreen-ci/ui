import { Banner, BannerVariant, Text } from "@via-ds/components";
import { StyledLink } from "@evg-ui/lib/components/styles";
import bannerStyles from "components/Banners/styles.module.css";
import { ignoredFilesDocumentationUrl } from "constants/externalResources";
import styles from "./index.module.css";

export const IgnoredBanner: React.FC = () => (
  <div className={styles.bannerContainer} data-testid="ignored-banner">
    <Banner className={bannerStyles.legacyLinks} variant={BannerVariant.Info}>
      <Text>
        This revision will not be automatically scheduled, because only{" "}
        <StyledLink href={ignoredFilesDocumentationUrl} target="_blank">
          ignored files
        </StyledLink>{" "}
        are changed. It may still be scheduled manually, or on failure stepback.
      </Text>
    </Banner>
  </div>
);
