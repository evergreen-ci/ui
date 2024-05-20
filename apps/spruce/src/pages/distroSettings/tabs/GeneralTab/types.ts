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
    isCluster: boolean;
    disableShallowClone: boolean;
    disabled: boolean;
    note: string;
    warningNote: string;
  };
}

export type TabProps = {
  distroData: GeneralFormState;
  minimumHosts: number;
};
