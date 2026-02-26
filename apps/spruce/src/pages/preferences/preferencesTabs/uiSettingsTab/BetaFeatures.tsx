import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Variant as ButtonVariant } from "@leafygreen-ui/button";
import { diff } from "deep-object-diff";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  BetaFeatures,
  UpdateUserBetaFeaturesMutation,
  UpdateUserBetaFeaturesMutationVariables,
} from "@evg-ui/lib/gql/generated/types";
import { UPDATE_USER_BETA_FEATURES } from "@evg-ui/lib/gql/mutations";
import { SpruceForm } from "components/SpruceForm";

type FormState = {
  betaFeatures: BetaFeatures;
};

type BetaFeatureSettingsProps = {
  userBetaSettings: BetaFeatures;
  adminBetaSettings: BetaFeatures;
};

export const BetaFeatureSettings: React.FC<BetaFeatureSettingsProps> = ({
  adminBetaSettings,
  userBetaSettings,
}) => {
  const dispatchToast = useToastContext();

  const [updateBetaFeatures] = useMutation<
    UpdateUserBetaFeaturesMutation,
    UpdateUserBetaFeaturesMutationVariables
  >(UPDATE_USER_BETA_FEATURES, {
    onCompleted: () => {
      dispatchToast.success("Your changes have been saved.");
    },
    onError: (err) => {
      dispatchToast.error(
        `Error while saving beta feature settings: ${err.message}`,
      );
    },
    refetchQueries: ["UserBetaFeatures"],
  });

  const initialState = useMemo(
    () => ({ betaFeatures: userBetaSettings }),
    [userBetaSettings],
  );
  const [formState, setFormState] = useState<FormState>(initialState);

  const hasChanges = useMemo(() => {
    const changes = diff(initialState, formState);
    return Object.entries(changes).length > 0;
  }, [initialState, formState]);

  const handleSubmit = () => {
    updateBetaFeatures({
      variables: {
        opts: {
          betaFeatures: formState.betaFeatures,
        },
      },
    });
  };

  // Check if there are any active beta features that we actually show in the UI
  // Exclude parsleyAIEnabled since it's no longer in beta
  // TODO: Once the backend stops returning this, we can remove.
  const hasActiveBetaFeatures = adminBetaSettings
    ? Object.entries(adminBetaSettings).some(
        ([key, value]) =>
          key !== "__typename" && key !== "parsleyAIEnabled" && value === true,
      )
    : false;

  return (
    <ContentWrapper>
      <SpruceForm
        formData={formState}
        onChange={({ formData }) => {
          setFormState(formData);
        }}
        schema={{
          properties: {
            betaFeatures: {
              title: "Beta Features",
              type: "object" as const,
              properties: {
                // Example for future beta features:
                // newFeature: radioSchema({
                //   title: "New Feature Name",
                // }),
              },
            },
          },
        }}
        uiSchema={{
          betaFeatures: {
            // Example for future beta features:
            // newFeature: radioUiSchema({
            //   dataCy: "new-feature",
            //   isAdminEnabled: adminBetaSettings?.newFeature ?? false,
            // }),
            "ui:description": (
              <DescriptionWrapper>
                <span>
                  Enable beta features to get an early look at upcoming UI
                  changes.
                </span>
                {hasActiveBetaFeatures ? (
                  ""
                ) : (
                  <span>No beta experiments are active right now.</span>
                )}
              </DescriptionWrapper>
            ),
          },
        }}
      />
      {hasActiveBetaFeatures && (
        <Button
          data-cy="save-beta-features-button"
          disabled={!hasChanges}
          onClick={handleSubmit}
          variant={ButtonVariant.Primary}
        >
          Save changes
        </Button>
      )}
    </ContentWrapper>
  );
};

// const radioSchema = ({ title }: { title: string }) => ({
//   type: "boolean" as const,
//   title,
//   default: false,
//   oneOf: [
//     {
//       type: "boolean" as const,
//       title: "Enabled",
//       enum: [true],
//     },
//     {
//       type: "boolean" as const,
//       title: "Disabled",
//       enum: [false],
//     },
//   ],
// });

// const radioUiSchema = ({
//   dataCy,
//   isAdminEnabled,
// }: {
//   dataCy: string;
//   isAdminEnabled: boolean;
// }) => ({
//   "ui:data-cy": dataCy,
//   "ui:widget": isAdminEnabled ? "radio" : "hidden",
//   "ui:options": {
//     inline: true,
//   },
//   "ui:elementWrapperCSS": css`
//     display: flex;
//     justify-content: space-between;
//     gap: ${size.m};
//     margin-bottom: ${size.s};
//   `,
// });

const ContentWrapper = styled.div`
  width: 70%;
`;

const DescriptionWrapper = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
  margin-bottom: ${size.s};
`;
