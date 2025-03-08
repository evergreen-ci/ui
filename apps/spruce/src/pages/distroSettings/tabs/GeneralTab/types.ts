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
}

export type TabProps = {
  distroData: GeneralFormState;
  minimumHosts: number;
};
