import { Banner, Variant } from "@leafygreen-ui/banner";

export const GithubWebhooksDisabledBanner: React.FC = () => (
  <Banner data-cy="disabled-webhook-banner" variant={Variant.Warning}>
    GitHub features are disabled because the Evergreen GitHub App is not
    installed on the saved owner/repo. Contact IT to install the App and enable
    GitHub features.
  </Banner>
);
