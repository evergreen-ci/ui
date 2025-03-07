import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { useSpruceConfig } from "hooks";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
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
  const state = useDistroSettingsContext();
  const originalSingleTaskDistroValue =
    distroData.distroOptions.singleTaskDistro;
  const currentSingleTaskDistroValue =
    state.tabs.general.formData?.distroOptions.singleTaskDistro;

  let warningCopy = "";
  if (!originalSingleTaskDistroValue && currentSingleTaskDistroValue) {
    warningCopy =
      "This Distro will be converted to a Single Task Distro once saved. Please review before confirming.";
  } else if (originalSingleTaskDistroValue && !currentSingleTaskDistroValue) {
    warningCopy =
      "This Distro will no longer be a Single Task Distro once saved. Please review before confirming.";
  }
  const formSchema = useMemo(
    () => getFormSchema(isContainerDistro, minimumHosts, warningCopy),
    [isContainerDistro, minimumHosts, warningCopy],
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
