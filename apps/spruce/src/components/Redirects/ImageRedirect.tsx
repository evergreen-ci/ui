import { Navigate } from "react-router-dom";
import { getImageRoute, ImageTabRoutes } from "constants/routes";
import { useFirstImage } from "hooks";

export const ImageRedirect: React.FC = () => {
  const { image, loading } = useFirstImage();

  if (loading) {
    return null;
  }
  return (
    <Navigate to={getImageRoute(image, ImageTabRoutes.BuildInformation)} />
  );
};
