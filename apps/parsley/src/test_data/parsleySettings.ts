import { ApolloMock } from "@evg-ui/lib/test_utils";
import {
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables,
} from "gql/generated/types";
import { PARSLEY_SETTINGS } from "gql/queries";

export const parsleySettingsMock: ApolloMock<
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables
> = {
  request: {
    query: PARSLEY_SETTINGS,
  },
  result: {
    data: {
      user: {
        __typename: "User",
        parsleySettings: {
          __typename: "ParsleySettings",
          jumpToFailingLineEnabled: true,
          sectionsEnabled: true,
        },
        userId: "me",
      },
    },
  },
};

export const parsleySettingsMockSectionsDisabled: ApolloMock<
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables
> = {
  request: {
    query: PARSLEY_SETTINGS,
  },
  result: {
    data: {
      user: {
        __typename: "User",
        parsleySettings: {
          __typename: "ParsleySettings",
          jumpToFailingLineEnabled: true,
          sectionsEnabled: false,
        },
        userId: "me",
      },
    },
  },
};
