import { createPortal } from "react-dom";

interface PortalBannerProps {
  // createPortal does not accept a ReactNode
  banner: JSX.Element;
}

export const PortalBanner: React.FC<PortalBannerProps> = ({ banner }) => {
  const bannerContainerEl = document.getElementById("banner-container");
  return bannerContainerEl ? (
    <>{createPortal(banner, bannerContainerEl)}</>
  ) : null;
};
