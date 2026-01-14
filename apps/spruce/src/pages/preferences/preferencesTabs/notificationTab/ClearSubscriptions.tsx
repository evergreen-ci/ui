import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import Button, { Variant } from "@leafygreen-ui/button";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import pluralize from "pluralize";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import {
  ClearMySubscriptionsMutation,
  ClearMySubscriptionsMutationVariables,
} from "gql/generated/types";
import { CLEAR_MY_SUBSCRIPTIONS } from "gql/mutations";

export const ClearSubscriptions: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const [clearMySubscriptions, { loading }] = useMutation<
    ClearMySubscriptionsMutation,
    ClearMySubscriptionsMutationVariables
  >(CLEAR_MY_SUBSCRIPTIONS, {
    refetchQueries: ["UserSubscriptions"],
    onCompleted: (result) => {
      setShowModal(false);
      dispatchToast.success(
        `Successfully cleared ${result.clearMySubscriptions} ${pluralize(
          "subscription",
          result.clearMySubscriptions,
        )}.`,
      );
    },
    onError: (err) => {
      setShowModal(false);
      dispatchToast.error(
        `Error while clearing subscriptions: '${err.message}'`,
      );
    },
  });

  return (
    <>
      <Button
        data-cy="clear-subscriptions-button"
        onClick={() => setShowModal(true)}
        variant={Variant.Danger}
      >
        Clear all previous subscriptions
      </Button>
      <ConfirmationModal
        cancelButtonProps={{
          onClick: () => setShowModal(false),
        }}
        confirmButtonProps={{
          children: "Clear all",
          disabled: loading,
          onClick: () => {
            clearMySubscriptions();
            sendEvent({
              name: "Deleted subscriptions",
            });
          },
        }}
        open={showModal}
        title="Clear All Subscriptions"
        variant="danger"
      >
        Are you sure you want to clear all subscriptions you have made on
        individual version, task, and project pages?
      </ConfirmationModal>
    </>
  );
};
