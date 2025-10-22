import { PreferredAuthType } from "gql/generated/types";

export interface AuthenticationFormState {
  authentication: {
    globalConfig: {
      allowServiceUsers: boolean;
      backgroundReauthMinutes: number;
      preferredType: PreferredAuthType | null;
    };
    okta: {
      clientId: string;
      clientSecret: string;
      issuer: string;
      userGroup: string;
      expireAfterMinutes: number;
      scopes: string[];
    };
    naive: {
      users: Array<{
        displayName: string;
        email: string;
        password: string;
        username: string;
      }>;
    };
    github: {
      appId?: number;
      clientId: string;
      clientSecret: string;
      defaultOwner?: string;
      defaultRepo?: string;
      organization: string;
      users: string[];
    };
    multi: {
      readWrite: string[];
      readOnly: string[];
    };
    kanopy: {
      headerName: string;
      issuer: string;
      keysetURL: string;
    };
    oauth: {
      clientId: string;
      connectorId: string;
      issuer: string;
    };
  };
}

export type TabProps = {
  authenticationData: AuthenticationFormState;
};
