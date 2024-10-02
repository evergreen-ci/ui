import { SpruceFormContainer } from "components/SpruceForm";
import { DistrosTable } from "pages/image/DistrosTable";
import { GeneralTable } from "pages/image/GeneralTable";
import { OperatingSystemTable } from "pages/image/OperatingSystemTable";
import { PackagesTable } from "pages/image/PackagesTable";
import { ToolchainsTable } from "pages/image/ToolchainsTable";
import { useBuildInformationContext } from "./BuildInformationContext";

type BuildInformationTabProps = {
  imageId: string;
};

export const BuildInformationTab: React.FC<BuildInformationTabProps> = ({
  imageId,
}) => {
  const { distrosRef, generalRef, osRef, packagesRef, toolchainsRef } =
    useBuildInformationContext();
  return (
    <>
      <SpruceFormContainer
        ref={generalRef}
        data-cy="general-card"
        title="General"
      >
        <GeneralTable imageId={imageId} />
      </SpruceFormContainer>
      <SpruceFormContainer
        ref={distrosRef}
        data-cy="distros-card"
        title="Distros"
      >
        <DistrosTable imageId={imageId} />
      </SpruceFormContainer>
      <SpruceFormContainer
        ref={osRef}
        data-cy="os-card"
        title="Operating System"
      >
        <OperatingSystemTable imageId={imageId} />
      </SpruceFormContainer>
      <SpruceFormContainer
        ref={packagesRef}
        data-cy="packages-card"
        title="Packages"
      >
        <PackagesTable imageId={imageId} />
      </SpruceFormContainer>
      <SpruceFormContainer
        ref={toolchainsRef}
        data-cy="toolchains-card"
        title="Toolchains"
      >
        <ToolchainsTable imageId={imageId} />
      </SpruceFormContainer>
    </>
  );
};
