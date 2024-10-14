import { SpruceFormContainer } from "components/SpruceForm";
import { DistrosTable } from "pages/image/DistrosTable";
import { GeneralTable } from "pages/image/GeneralTable";
import { OperatingSystemTable } from "pages/image/OperatingSystemTable";
import { PackagesTable } from "pages/image/PackagesTable";
import { ToolchainsTable } from "pages/image/ToolchainsTable";
import { tocItems } from "./constants";

type BuildInformationTabProps = {
  imageId: string;
};

export const BuildInformationTab: React.FC<BuildInformationTabProps> = ({
  imageId,
}) => (
  <>
    <SpruceFormContainer
      data-cy="general-card"
      id={tocItems.general.observedElementId}
      title={tocItems.general.title}
    >
      <GeneralTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer
      data-cy="distros-card"
      id={tocItems.distros.observedElementId}
      title={tocItems.distros.title}
    >
      <DistrosTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer
      data-cy="os-card"
      id={tocItems.os.observedElementId}
      title={tocItems.os.title}
    >
      <OperatingSystemTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer
      data-cy="packages-card"
      id={tocItems.packages.observedElementId}
      title={tocItems.packages.title}
    >
      <PackagesTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer
      data-cy="toolchains-card"
      id={tocItems.toolchains.observedElementId}
      title={tocItems.toolchains.title}
    >
      <ToolchainsTable imageId={imageId} />
    </SpruceFormContainer>
  </>
);
