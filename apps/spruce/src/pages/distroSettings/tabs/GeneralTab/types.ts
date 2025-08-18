export interface GeneralFormState {
  distroName: {
    name: string;
  };
  distroImage: {
    image: string;
  };
  distroAliases: {
    aliases: string[];
  };
  distroOptions: {
    adminOnly: boolean;
    disabled: boolean;
    disableShallowClone: boolean;
    isCluster: boolean;
    note: string;
    singleTaskDistro: boolean;
    warningNote: string;
  };
  costData: {
    onDemandRate: number;
    savingsPlanRate: number;
  };
}

export type TabProps = {
  distroData: GeneralFormState;
  minimumHosts: number;
};
