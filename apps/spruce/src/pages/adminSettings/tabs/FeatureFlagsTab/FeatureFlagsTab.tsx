import { useState } from "react";
import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Variant as ButtonVariant } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import {
  ServiceFlagInput,
  ServiceFlagsListQuery,
  SetServiceFlagsMutation,
  SetServiceFlagsMutationVariables,
} from "gql/generated/types";
import { SET_SERVICE_FLAGS } from "gql/mutations";
import { SERVICE_FLAGS_LIST } from "gql/queries";

const { gray } = palette;

export const FeatureFlagsTab: React.FC = () => {
  const dispatchToast = useToastContext();

  const { data } = useSuspenseQuery<ServiceFlagsListQuery>(SERVICE_FLAGS_LIST);
  const serviceFlagsList = data.adminSettings?.serviceFlagsList ?? [];

  const [flagValues, setFlagValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      serviceFlagsList.map(({ enabled, name }) => [name, enabled]),
    ),
  );

  const changedFlags: ServiceFlagInput[] = serviceFlagsList
    .filter(({ enabled, name }) => flagValues[name] !== enabled)
    .map(({ name }) => ({ enabled: flagValues[name], name }));

  const [setServiceFlags, { loading }] = useMutation<
    SetServiceFlagsMutation,
    SetServiceFlagsMutationVariables
  >(SET_SERVICE_FLAGS, {
    onCompleted: () => {
      dispatchToast.success("Service flags saved successfully");
    },
    onError: (err) => {
      dispatchToast.error(`Error saving service flags: ${err.message}`);
    },
  });

  const handleChange = (name: string, value: boolean) => {
    setFlagValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section>
      <SaveRow>
        <SettingsCardTitle>Service Flags</SettingsCardTitle>
        <Button
          data-cy="save-settings-button"
          disabled={changedFlags.length === 0 || loading}
          isLoading={loading}
          onClick={() =>
            setServiceFlags({ variables: { updatedFlags: changedFlags } })
          }
          variant={ButtonVariant.Primary}
        >
          Save changes on page
        </Button>
      </SaveRow>
      <SettingsCard>
        {serviceFlagsList.map(({ name }) => (
          <FlagRow key={name}>
            <span>{name}</span>
            <RadioGroup
              css={inlineRadioCSS}
              name={name}
              onChange={(e) => handleChange(name, e.target.value === "true")}
              value={`${flagValues[name] ?? false}`}
            >
              <Radio value="true">Enabled</Radio>
              <Radio value="false">Disabled</Radio>
            </RadioGroup>
          </FlagRow>
        ))}
      </SettingsCard>
    </section>
  );
};

const inlineRadioCSS = css`
  display: flex;
  flex-direction: row;
  gap: ${size.l};
`;

const SaveRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const FlagRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${size.xs};

  :nth-of-type(even) {
    background-color: ${gray.light3};
  }

  :not(:last-child) {
    border-bottom: 1px solid ${gray.light2};
  }
`;
