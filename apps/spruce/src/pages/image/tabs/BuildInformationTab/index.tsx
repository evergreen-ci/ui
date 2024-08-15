import { SpruceFormContainer } from "components/SpruceForm";
import { DistrosTable } from "pages/image/DistrosTable";
import { PackagesTable } from "pages/image/PackagesTable";

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
    <PackagesTable />
  </>
);
