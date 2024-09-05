import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { slugs } from "constants/routes";

const Waterfall: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams<{
    [slugs.projectIdentifier]: string;
  }>();

  return (
    <PageWrapper data-cy="waterfall-page">
      Waterfall Page for {projectIdentifier}
    </PageWrapper>
  );
};

export default Waterfall;
