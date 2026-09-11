import { useState } from "react";
import { Banner, BannerVariant } from "@via-ds/components/banner";
import { Text } from "@via-ds/components/typography";
import Cookies from "js-cookie";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";

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

  const variant = mapThemeToVariant[theme?.toLowerCase()] ?? BannerVariant.Info;
  return showBanner ? (
    <Banner
      data-testid={`sitewide-banner-${variant}`}
      onClose={hideBanner}
      variant={variant}
    >
      <Text>{jiraLinkify(text, jiraHost ?? "")}</Text>
    </Banner>
  ) : null;
};

const mapThemeToVariant: Record<string, BannerVariant> = {
  announcement: BannerVariant.Success,
  information: BannerVariant.Info,
  warning: BannerVariant.Warning,
  important: BannerVariant.Danger,
};
