import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant as BadgeVariant } from "@leafygreen-ui/badge";
import Button, { Variant as ButtonVariant } from "@leafygreen-ui/button";
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
  adminBetaFeatures: BetaFeatures;
  userBetaFeatures: BetaFeatures;
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
      dispatchToast.success("Your changes have successfully been saved.");
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving beta features: '${err.message}'`);
    },
    refetchQueries: ["UserPreferences"],
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

  const { spruceWaterfallEnabled } = adminBetaFeatures ?? {};

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
                title: "Opt in to Beta Features",
                type: "object" as "object",
                properties: {
                  spruceWaterfallEnabled: {
                    type: "boolean" as "boolean",
                    // @ts-expect-error
                    title: (
                      <Title
                        enabled={spruceWaterfallEnabled}
                        title="Use new Spruce waterfall"
                      />
                    ),
                    oneOf: radioOptions,
                  },
                },
              },
            },
          }}
          uiSchema={{
            betaFeatures: {
              "ui:description":
                "Enable beta features to get an early look at upcoming UI changes.",
              "ui:data-cy": "beta-features-card",
              spruceWaterfallEnabled: {
                ...radioUiSchema,
                "ui:data-cy": "spruce-waterfall-enabled",
                "ui:disabled": !spruceWaterfallEnabled,
              },
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
    </SettingsCard>
  );
};

type TitleProps = {
  title: string;
  enabled?: boolean;
};

const Title: React.FC<TitleProps> = ({ enabled = false, title }) => (
  <RadioLabel>
    <span>{title}</span>
    <Badge variant={enabled ? BadgeVariant.Green : BadgeVariant.LightGray}>
      {enabled ? "active" : "inactive"}
    </Badge>
  </RadioLabel>
);

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
    gap: ${size.m};
    margin-bottom: ${size.xs};
  `,
};

const RadioLabel = styled.div`
  display: flex;
  gap: ${size.xs};
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 70%;
`;
