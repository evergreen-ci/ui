import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";
import { DISTROS } from "gql/queries";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const BackgroundProcessingTab: React.FC<TabProps> = ({
  backgroundProcessingData,
}) => {
  const initialFormState = backgroundProcessingData;

  const { data: distrosData } = useQuery<DistrosQuery, DistrosQueryVariables>(
    DISTROS,
    { variables: { onlySpawnable: false } },
  );

  const formSchema = useMemo(
    () =>
      getFormSchema({
        distros: distrosData?.distros.map((d) => d.name) ?? [],
      }),
    [distrosData?.distros],
  );

  return (
    <>
      <H2>Background Processing</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.BackgroundProcessing}
      />
    </>
  );
};
