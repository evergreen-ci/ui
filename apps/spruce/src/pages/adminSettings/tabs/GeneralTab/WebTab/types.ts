export interface WebFormState {
  web: {
    api: {
      httpListenAddr: string;
      url: string;
      corpUrl: string;
    };
    ui: {
      url: string;
      uiv2Url: string;
      parsleyUrl: string;
      httpListenAddr: string;
      secret: string;
      defaultProject: string;
      corsOrigins: string[];
      fileStreamingContentTypes: string[];
      loginDomain: string;
      userVoice: string;
      csrfKey: string;
      cacheTemplates: boolean;
      stagingEnvironment: string;
    };
    betaFeatures: Record<string, never>;
    disabledGQLQueries: {
      queryNames: string[];
    };
    rateLimitConfig: {
      restLimits: {
        restUserPerHour: number;
        restUserBurst: number;
        restServicePerHour: number;
        restServiceBurst: number;
      };
      graphqlLimits: {
        graphqlUserPerHour: number;
        graphqlUserBurst: number;
        graphqlServicePerHour: number;
        graphqlServiceBurst: number;
      };
      graphqlComplexity: {
        graphqlComplexityLimit: number;
      };
      elevatedUsers: {
        elevatedUserIds: string[];
      };
    };
  };
}

export type TabProps = {
  webData: WebFormState;
};
