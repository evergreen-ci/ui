import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { diff } from "deep-object-diff";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import { SpruceForm } from "components/SpruceForm";
import { size } from "constants/tokens";
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
  betaFeatures: BetaFeatures;
};

export const BetaFeatureSettings: React.FC<BetaFeatureSettingsProps> = ({
  betaFeatures,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const [updateBetaFeatures] = useMutation<
    UpdateBetaFeaturesMutation,
    UpdateBetaFeaturesMutationVariables
  >(UPDATE_BETA_FEATURES, {
    onCompleted: () => {
      dispatchToast.success("Your changes have successfully been saved.");
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving beta features: '${err.message}'`);
    },
    refetchQueries: ["UserPreferences"],
  });

  const initialState = useMemo(() => ({ betaFeatures }), [betaFeatures]);
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

  return (
    <SettingsCard>
      <ContentWrapper>
        <SpruceForm
          formData={formState}
          onChange={({ formData }) => {
            setFormState(formData);
          }}
          schema={{
            properties: {
              betaFeatures: {
                title: "Opt into Beta Features",
                type: "object" as "object",
                properties: {
                  spruceWaterfallEnabled: {
                    type: "boolean" as "boolean",
                    title: "Use new Spruce waterfall",
                    oneOf: radioOptions,
                  },
                },
              },
            },
          }}
          uiSchema={{
            betaFeatures: {
              "ui:description":
                "Enable beta features to get an early look at new UI changes.",
              "ui:data-cy": "beta-features-card",
              spruceWaterfallEnabled: {
                ...radioUiSchema,
                "ui:data-cy": "spruce-waterfall-enabled",
              },
            },
          }}
        />
        <Button
          data-cy="save-beta-features-button"
          disabled={!hasChanges}
          onClick={handleSubmit}
          variant={Variant.Primary}
        >
          Save changes
        </Button>
      </ContentWrapper>
    </SettingsCard>
  );
};

const radioOptions = [
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
];

const radioUiSchema = {
  "ui:widget": "radio",
  "ui:options": {
    inline: true,
  },
  "ui:elementWrapperCSS": css`
    display: flex;
    justify-content: space-between;
    gap: ${size.l};
    margin-bottom: ${size.xs};
  `,
};

const ContentWrapper = styled.div`
  width: 60%;
`;
