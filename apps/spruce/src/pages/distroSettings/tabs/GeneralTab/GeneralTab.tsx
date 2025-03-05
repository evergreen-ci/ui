import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { useSpruceConfig } from "hooks";
import { DeleteDistro } from "pages/distroSettings/DeleteDistro";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const GeneralTab: React.FC<TabProps> = ({
  distroData,
  minimumHosts,
}) => {
  const { distroId } = useParams();
  const spruceConfig = useSpruceConfig();
  const containerPoolDistros =
    spruceConfig?.containerPools?.pools?.map(({ distro }) => distro) ?? [];

  const isContainerDistro = containerPoolDistros.includes(distroId as string);
  const { singleTaskDistro } = distroData.distroOptions;

  const formSchema = useMemo(
    () => getFormSchema(isContainerDistro, minimumHosts, singleTaskDistro),
    [isContainerDistro, minimumHosts, singleTaskDistro],
  );

  return (
    <>
      <BaseTab formSchema={formSchema} initialFormState={distroData} />
      <SettingsCardTitle>Remove Configuration</SettingsCardTitle>
      <SettingsCard>
        <DeleteDistro />
      </SettingsCard>
    </>
  );
};
