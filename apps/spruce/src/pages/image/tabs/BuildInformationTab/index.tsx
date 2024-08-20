import { SpruceFormContainer } from "components/SpruceForm";
import { DistrosTable } from "pages/image/DistrosTable";
import { PackagesTable } from "pages/image/PackagesTable";
import { ToolchainsTable } from "pages/image/ToolchainsTable";

type BuildInformationTabProps = {
  imageId: string;
};

export const BuildInformationTab: React.FC<BuildInformationTabProps> = ({
  imageId,
}) => (
  <>
    <SpruceFormContainer title="Distros">
      <DistrosTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer title="Packages">
      <PackagesTable imageId={imageId} />
    </SpruceFormContainer>
    <SpruceFormContainer title="Toolchains">
      <ToolchainsTable imageId={imageId} />
    </SpruceFormContainer>
  </>
);
