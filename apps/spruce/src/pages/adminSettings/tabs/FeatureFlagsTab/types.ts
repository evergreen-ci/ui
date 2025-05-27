export interface FeatureFlagsFormState {
  featureFlags: {
    services: boolean;
    notifications: boolean;
    features: boolean;
    batchJobs: boolean;
    disabledGqlQueries: boolean;
  };
}

export type TabProps = {
  featureFlagsData: FeatureFlagsFormState;
};
