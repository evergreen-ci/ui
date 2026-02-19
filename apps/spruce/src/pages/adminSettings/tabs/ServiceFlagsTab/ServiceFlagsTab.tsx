import { useState, useMemo } from "react";
import { useMutation, useSuspenseQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Variant as ButtonVariant } from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { SpruceForm } from "components/SpruceForm";
import {
  ServiceFlagInput,
  ServiceFlagsListQuery,
  SetServiceFlagsMutation,
  SetServiceFlagsMutationVariables,
} from "gql/generated/types";
import { SET_SERVICE_FLAGS } from "gql/mutations";
import { SERVICE_FLAGS_LIST } from "gql/queries";
import { getFormSchema } from "./getFormSchema";

export const ServiceFlagsTab: React.FC = () => {
  const dispatchToast = useToastContext();

  const { data } = useSuspenseQuery<ServiceFlagsListQuery>(SERVICE_FLAGS_LIST);
  const serviceFlagsList = data.adminSettings?.serviceFlagsList ?? [];

  const { fields, schema, uiSchema } = useMemo(
    () => getFormSchema(serviceFlagsList.map(({ name }) => name)),
    // Schema only needs to change if the set of flag names changes, which
    // happens when new flags are added to the backend.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceFlagsList.map(({ name }) => name).join(",")],
  );

  const [formData, setFormData] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      serviceFlagsList.map(({ enabled, name }) => [name, enabled]),
    ),
  );

  const changedFlags: ServiceFlagInput[] = serviceFlagsList
    .filter(({ enabled, name }) => formData[name] !== enabled)
    .map(({ name }) => ({ enabled: formData[name], name }));

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

  return (
    <div>
      <SaveRow>
        <span />
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
      <SpruceForm
        fields={fields}
        formData={formData}
        onChange={({ formData: newData }) => {
          setFormData(newData);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
    </div>
  );
};

const SaveRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${size.s};
`;
