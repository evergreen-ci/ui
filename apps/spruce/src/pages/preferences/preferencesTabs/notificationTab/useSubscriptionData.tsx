import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { convertFromFamilyTrigger } from "constants/triggers";
import {
  GeneralSubscription,
  UserSubscriptionsQuery,
  UserSubscriptionsQueryVariables,
} from "gql/generated/types";
import { USER_SUBSCRIPTIONS } from "gql/queries";

export const useSubscriptionData = () => {
  const { data } = useQuery<
    UserSubscriptionsQuery,
    UserSubscriptionsQueryVariables
  >(USER_SUBSCRIPTIONS);

  const globalSubscriptionIds = useMemo(() => {
    const {
      buildBreakId,
      patchFinishId,
      patchFirstFailureId,
      spawnHostExpirationId,
      spawnHostOutcomeId,
    } = data?.user?.settings?.notifications ?? {};
    return new Set([
      buildBreakId,
      patchFinishId,
      patchFirstFailureId,
      spawnHostExpirationId,
      spawnHostOutcomeId,
    ]);
  }, [data?.user?.settings?.notifications]);

  const subscriptions = useMemo(
    () =>
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      processSubscriptionData(data?.user?.subscriptions, globalSubscriptionIds),
    [data?.user?.subscriptions, globalSubscriptionIds],
  );

  return subscriptions;
};

const processSubscriptionData = (
  subscriptions: GeneralSubscription[],
  globalSubscriptionIds: Set<string>,
) => {
  if (!subscriptions || !subscriptions.length) {
    return;
  }

  return (
    subscriptions
      // Filter out a user's global subscriptions for tasks, spawn hosts, etc.
      .filter(({ id }) => !globalSubscriptionIds.has(id))
      // For this table's purposes, FAMILY_TRIGGER = TRIGGER. Convert all family triggers to their base type.
      .map(({ trigger, ...subscription }) => ({
        ...subscription,
        trigger: convertFromFamilyTrigger(trigger),
      }))
  );
};
