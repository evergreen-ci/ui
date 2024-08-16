import { SpruceFormContainer } from "components/SpruceForm";
import { DistrosTable } from "pages/image/DistrosTable";
import { GeneralTable } from "pages/image/GeneralTable";

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
    <SpruceFormContainer title="Distros">
      <DistrosTable imageId={imageId} />
    </SpruceFormContainer>
  </>
);
