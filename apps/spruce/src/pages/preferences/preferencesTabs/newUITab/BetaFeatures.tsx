import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Button, { Variant as ButtonVariant } from "@leafygreen-ui/button";
import { diff } from "deep-object-diff";
import { size } from "@evg-ui/lib/constants/tokens";
import { usePreferencesAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  BetaFeatures,
  UpdateBetaFeaturesMutation,
  UpdateBetaFeaturesMutationVariables,
} from "gql/generated/types";
import { UPDATE_BETA_FEATURES } from "gql/mutations";

type FormState = {
  betaFeatures: BetaFeatures;
};

type BetaFeatureSettingsProps = {
  userBetaFeatures: BetaFeatures;
  adminBetaFeatures: BetaFeatures;
};

export const BetaFeatureSettings: React.FC<BetaFeatureSettingsProps> = ({
  adminBetaFeatures,
  userBetaFeatures,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const [updateBetaFeatures] = useMutation<
    UpdateBetaFeaturesMutation,
    UpdateBetaFeaturesMutationVariables
  >(UPDATE_BETA_FEATURES, {
    onCompleted: () => {
      dispatchToast.success("Your changes have been saved.");
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving beta features: ${err.message}`);
    },
    refetchQueries: ["UserBetaFeatures"],
  });

  const initialState = useMemo(
    () => ({ betaFeatures: userBetaFeatures }),
    [userBetaFeatures],
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
    sendEvent({
      name: "Saved beta features",
    });
  };

  const hasActiveBetaFeatures = adminBetaFeatures
    ? Object.values(adminBetaFeatures).filter((v) => v === true).length > 0
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
              type: "object" as "object",
              properties: {
                spruceWaterfallEnabled: radioSchema({
                  title: "Use new Spruce waterfall",
                }),
              },
            },
          },
        }}
        uiSchema={{
          betaFeatures: {
            "ui:data-cy": "beta-features-card",
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
            spruceWaterfallEnabled: radioUiSchema({
              dataCy: "spruce-waterfall-enabled",
              isAdminEnabled:
                adminBetaFeatures?.spruceWaterfallEnabled ?? false,
            }),
          },
        }}
      />
      <Button
        data-cy="save-beta-features-button"
        disabled={!hasChanges}
        onClick={handleSubmit}
        variant={ButtonVariant.Primary}
      >
        Save changes
      </Button>
    </ContentWrapper>
  );
};

const radioSchema = ({ title }: { title: string }) => ({
  type: "boolean" as "boolean",
  title,
  default: false,
  oneOf: [
    {
      type: "boolean" as "boolean",
      title: "Enabled",
      enum: [true],
    },
    {
      type: "boolean" as "boolean",
      title: "Disabled",
      enum: [false],
    },
  ],
});

const radioUiSchema = ({
  dataCy,
  isAdminEnabled,
}: {
  dataCy: string;
  isAdminEnabled: boolean;
}) => ({
  "ui:data-cy": dataCy,
  "ui:widget": isAdminEnabled ? "radio" : "hidden",
  "ui:options": {
    inline: true,
  },
  "ui:elementWrapperCSS": css`
    display: flex;
    justify-content: space-between;
    gap: ${size.m};
    margin-bottom: ${size.s};
  `,
});

const DescriptionWrapper = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
  margin-bottom: ${size.s};
`;

const ContentWrapper = styled.div`
  width: 70%;
`;
