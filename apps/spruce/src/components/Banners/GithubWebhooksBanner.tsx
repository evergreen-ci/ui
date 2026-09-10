import { Banner, BannerVariant } from "@via-ds/components/banner";

export const GithubWebhooksDisabledBanner: React.FC = () => (
  <Banner data-testid="disabled-webhook-banner" variant={BannerVariant.Warning}>
    GitHub features are disabled because the Evergreen GitHub App is not
    installed on the saved owner/repo. Contact IT to install the App and enable
    GitHub features.
  </Banner>
);
