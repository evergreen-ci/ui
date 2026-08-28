import { useState } from "react";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import Icon from "@evg-ui/lib/components/Icon";
import { cx } from "@evg-ui/lib/utils/css";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";
import styles from "./SiteBanner.module.css";

const { green } = palette;

export interface SiteBannerProps {
  text: string;
  theme: string;
}
export const SiteBanner: React.FC<SiteBannerProps> = ({ text, theme }) => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const [showBanner, setShowBanner] = useState(
    text && Cookies.get(text) === undefined,
  );

  const hideBanner = () => {
    // If a user sees a banner and closes it lets set a cookie with the banners text as the key.
    // The cookie will be auto deleted after a week. This ensures if a new banner with different text is returned we dont accidently hide it
    setShowBanner(false);
    Cookies.set(text, "viewed", { expires: 7 });
  };

  const variant = mapThemeToVariant[theme?.toLowerCase()] ?? Variant.Info;
  return showBanner ? (
    <Banner
      data-testid={`sitewide-banner-${variant}`}
      dismissible
      image={
        // We want the green banner to align more with legacy Evergreen's announcement banner
        variant === Variant.Success ? <AnnouncementIcon /> : undefined
      }
      onClose={hideBanner}
      variant={variant}
    >
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      {jiraLinkify(text, jiraHost)}
    </Banner>
  ) : null;
};

const AnnouncementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon
    className={cx(className, styles.styledIcon)}
    color={green.dark1}
    glyph="Megaphone"
  />
);

const mapThemeToVariant: Record<string, Variant> = {
  announcement: Variant.Success,
  information: Variant.Info,
  warning: Variant.Warning,
  important: Variant.Danger,
};
