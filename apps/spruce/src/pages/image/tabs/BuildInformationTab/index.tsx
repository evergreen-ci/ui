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
    <SpruceFormContainer title="Distros" data-cy="distros-card">
      <DistrosTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer title="Packages" data-cy="packages-card">
      <PackagesTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer title="Toolchains" data-cy="toolchains-card">
      <ToolchainsTable imageId={imageId} />
    </SpruceFormContainer>
  </>
);
