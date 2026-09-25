import { useMutation } from "@apollo/client/react";
import {
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";

interface UseSaveSubscriptionOptions {
  onCompleted: () => void;
  onError: (message: string) => void;
}

/**
 * useSaveSubscription saves a subscription for the current user and reports failures with a consistent message.
 * @param options - callbacks for the mutation result
 * @param options.onCompleted - called when the subscription is saved
 * @param options.onError - called with a user-facing error message when the subscription fails to save
 * @returns the mutation tuple for saving a subscription
 */
export const useSaveSubscription = ({
  onCompleted,
  onError,
}: UseSaveSubscriptionOptions) =>
  useMutation<
    SaveSubscriptionForUserMutation,
    SaveSubscriptionForUserMutationVariables
  >(SAVE_SUBSCRIPTION, {
    onCompleted,
    onError: (err) => {
      onError(`Error adding your subscription: '${err.message}'`);
    },
  });
