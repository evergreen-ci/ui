import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Button, { Variant as ButtonVariant } from "@leafygreen-ui/button";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { Field, ObjectFieldTemplateProps } from "@rjsf/core";
import { diff } from "deep-object-diff";
import { size } from "@evg-ui/lib/constants/tokens";
import { StringMap } from "@evg-ui/lib/types/utils";
import { usePreferencesAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { getFields } from "components/SpruceForm/utils";
import { useToastContext } from "context/toast";
import {
  BetaFeatures,
  UpdateBetaFeaturesMutation,
  UpdateBetaFeaturesMutationVariables,
} from "gql/generated/types";
import { UPDATE_BETA_FEATURES } from "gql/mutations";
import { useAdminBetaFeatures, useUserBetaFeatures } from "hooks";

type FormState = {
  betaFeatures: {
    feature: string;
    enabled: boolean;
  }[];
};

export const BetaFeatureSettings: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const { betaFeatures: adminBetaFeatures, loading: adminLoading } =
    useAdminBetaFeatures();
  const { betaFeatures: userBetaFeatures, loading: userLoading } =
    useUserBetaFeatures();

  const [updateBetaFeatures] = useMutation<
    UpdateBetaFeaturesMutation,
    UpdateBetaFeaturesMutationVariables
  >(UPDATE_BETA_FEATURES, {
    onCompleted: () => {
      dispatchToast.success("Your changes have successfully been saved.");
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving beta features: ${err.message}`);
    },
    refetchQueries: ["UserBetaFeatures"],
  });

  const initialState = useMemo(
    () => gqlToForm(userBetaFeatures, adminBetaFeatures),
    [userBetaFeatures, adminBetaFeatures],
  );
  const [formState, setFormState] = useState<FormState>(initialState);

  // The initialState might update after completing the query, so we need
  // to update the form state as well.
  useEffect(() => {
    setFormState(initialState);
  }, [initialState]);

  const hasChanges = useMemo(() => {
    const changes = diff(initialState, formState);
    return Object.entries(changes).length > 0;
  }, [initialState, formState]);

  const handleSubmit = () => {
    updateBetaFeatures({
      variables: {
        opts: {
          betaFeatures: formToGql(formState),
        },
      },
    });
    sendEvent({
      name: "Saved beta features",
    });
  };

  return adminLoading || userLoading ? (
    <ParagraphSkeleton />
  ) : (
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
              type: "array" as "array",
              items: {
                type: "object" as "object",
                properties: {
                  feature: {
                    type: "string" as "string",
                  },
                  enabled: {
                    type: "boolean" as "boolean",
                    title: "",
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
                  },
                },
              },
            },
          },
        }}
        uiSchema={{
          betaFeatures: {
            "ui:data-cy": "beta-features-list",
            "ui:description":
              "Enable beta features to get an early look at upcoming UI changes.",
            "ui:placeholder": "No beta experiments are active right now.",
            "ui:orderable": false,
            "ui:addable": false,
            "ui:removable": false,
            items: {
              "ui:ObjectFieldTemplate": BetaFeatureRow,
              feature: {
                "ui:field": BetaFeatureDescriptionField,
              },
              enabled: {
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
              },
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
  );
};

const featureToDescription: StringMap = {
  spruceWaterfallEnabled: "Use new Spruce waterfall",
};

const BetaFeatureDescriptionField: Field = ({
  formData,
}: {
  formData: string;
}) => <Body>{featureToDescription[formData]}</Body>;

const BetaFeatureRow: React.FC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties">
> = ({ formData, properties }) => {
  const [feature, enabled] = getFields(properties, formData.isDisabled);
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        gap: ${size.l};
      `}
    >
      {feature}
      {enabled}
    </div>
  );
};

const gqlToForm = (
  userBetaFeatures?: BetaFeatures,
  adminBetaFeatures?: BetaFeatures,
): FormState => {
  const activeBetaFeatures =
    userBetaFeatures && adminBetaFeatures
      ? Object.entries(adminBetaFeatures)
          .filter(([, v]) => v !== true)
          .map(([k]) => ({
            feature: k,
            enabled: userBetaFeatures[k as keyof BetaFeatures] as boolean,
          }))
      : [];
  return { betaFeatures: activeBetaFeatures };
};

const formToGql = (formState: FormState): BetaFeatures => {
  const updatedBetaFeatures: { [key: string]: boolean } = {};
  formState.betaFeatures.forEach((b) => {
    updatedBetaFeatures[b.feature] = b.enabled ?? false;
  });
  return {
    spruceWaterfallEnabled: updatedBetaFeatures.spruceWaterfallEnabled,
  };
};

const ContentWrapper = styled.div`
  width: 70%;
`;
