import { useParams } from "react-router-dom";
import { slugs } from "constants/routes";
import { ProjectSettings as PS } from "./projectSettings/index";

export const ProjectSettings: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams<{
    [slugs.projectIdentifier]: string | undefined;
  }>();

  return <PS key={projectIdentifier} />;
};
