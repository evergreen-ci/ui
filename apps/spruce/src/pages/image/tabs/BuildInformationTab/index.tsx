import { SpruceFormContainer } from "components/SpruceForm";
import { DistrosTable } from "pages/image/DistrosTable";
import { GeneralTable } from "pages/image/GeneralTable";
import { PackagesTable } from "pages/image/PackagesTable";
import { ToolchainsTable } from "pages/image/ToolchainsTable";

type BuildInformationTabProps = {
  imageId: string;
};

export const BuildInformationTab: React.FC<BuildInformationTabProps> = ({
  imageId,
}) => (
  <>
    <SpruceFormContainer title="General">
      <GeneralTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer data-cy="distros-card" title="Distros">
      <DistrosTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer data-cy="packages-card" title="Packages">
      <PackagesTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer data-cy="toolchains-card" title="Toolchains">
      <ToolchainsTable imageId={imageId} />
    </SpruceFormContainer>
  </>
);
