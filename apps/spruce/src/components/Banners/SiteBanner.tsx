import { useState } from "react";
import styled from "@emotion/styled";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import Icon from "@evg-ui/lib/components/Icon";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";

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
      data-cy={`sitewide-banner-${variant}`}
      dismissible
      image={
        // We want the green banner to align more with legacy Evergreen's announcement banner
        variant === Variant.Success ? (
          <StyledIcon color={green.dark1} glyph="Megaphone" />
        ) : undefined
      }
      onClose={hideBanner}
      variant={variant}
    >
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      {jiraLinkify(text, jiraHost)}
    </Banner>
  ) : null;
};

const mapThemeToVariant: Record<string, Variant> = {
  announcement: Variant.Success,
  information: Variant.Info,
  warning: Variant.Warning,
  important: Variant.Danger,
};

// It's unclear why using the size prop on the component doesn't work, but we can do this instead.
const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`;
