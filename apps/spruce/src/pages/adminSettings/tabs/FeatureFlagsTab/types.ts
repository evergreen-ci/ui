export interface FeatureFlagsFormState {
  services: {
    [key: string]: boolean;
  };
  notifications: {
    [key: string]: boolean;
  };
  features: {
    [key: string]: boolean;
  };
  batchJobs: {
    [key: string]: boolean;
  };
  disabledGqlQueries: string[];
}

export type TabProps = {
  featureFlagsData: FeatureFlagsFormState;
};
