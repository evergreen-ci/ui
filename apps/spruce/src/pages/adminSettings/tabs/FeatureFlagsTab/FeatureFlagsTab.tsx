import { useState } from "react";
import { useMutation } from "@apollo/client/react";
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
  SetServiceFlagsMutation,
  SetServiceFlagsMutationVariables,
} from "gql/generated/types";
import { SET_SERVICE_FLAGS } from "gql/mutations";
import { ADMIN_SETTINGS } from "gql/queries";

interface ServiceFlag {
  name: string;
  enabled: boolean;
}

interface Props {
  serviceFlagsList: ServiceFlag[];
}

export const FeatureFlagsTab: React.FC<Props> = ({ serviceFlagsList }) => {
  const dispatchToast = useToastContext();

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
    refetchQueries: [ADMIN_SETTINGS],
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
    <FlagsSection>
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
      <ZebraCard>
        {serviceFlagsList.map(({ name }) => (
          <FlagRow key={name}>
            <FlagName>{name}</FlagName>
            <RadioGroup
              css={inlineRadioCSS}
              name={name}
              onChange={(e) => handleChange(name, e.target.value === "true")}
              value={String(flagValues[name] ?? false)}
            >
              <Radio value="true">Enabled</Radio>
              <Radio value="false">Disabled</Radio>
            </RadioGroup>
          </FlagRow>
        ))}
      </ZebraCard>
    </FlagsSection>
  );
};

const { gray } = palette;

const inlineRadioCSS = css`
  display: flex;
  flex-direction: row;
  gap: ${size.l};
`;

const FlagsSection = styled.div`
  margin-top: ${size.m};
`;

const SaveRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${size.s};
`;

const ZebraCard = styled(SettingsCard)`
  padding: 0;

  > div:nth-of-type(even) {
    background-color: ${gray.light3};
  }

  > div:not(:last-child) {
    border-bottom: 1px solid ${gray.light2};
  }
`;

const FlagRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${size.xs};
`;

const FlagName = styled.span`
  font-weight: normal;
`;
