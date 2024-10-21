import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { useImageAnalytics } from "analytics";
import { SideNavItem } from "components/styles";
import { ImageTabRoutes, getImageRoute } from "constants/routes";
import { useTopmostVisibleElement } from "hooks";
import { tocItems } from "./constants";

type BuildInformationNavItemProps = {
  currentTab: ImageTabRoutes;
  imageId: string;
  scrollContainerId: string;
};

const BuildInformationNavItem: React.FC<BuildInformationNavItemProps> = ({
  currentTab,
  imageId,
  scrollContainerId,
}) => {
  const { sendEvent } = useImageAnalytics();
  const tabIsActive = ImageTabRoutes.BuildInformation === currentTab;

  const elements = Array.from(
    document.querySelectorAll("h3[id^='toc-item']"),
  ) as HTMLElement[];

  const activeItemId = useTopmostVisibleElement({
    elements,
    scrollContainerId,
  });

  return (
    <>
      <SideNavItem
        key={ImageTabRoutes.BuildInformation}
        active={tabIsActive}
        as={Link}
        data-cy={`navitem-${ImageTabRoutes.BuildInformation}`}
        indentLevel={0}
        onClick={() =>
          sendEvent({
            name: "Changed tab",
            tab: ImageTabRoutes.BuildInformation,
          })
        }
        to={getImageRoute(imageId, ImageTabRoutes.BuildInformation)}
      >
        Build Information
      </SideNavItem>
      {Object.keys(tocItems).map((key) => {
        const item = tocItems[key];
        const isActive = tabIsActive && item.observedElementId === activeItemId;
        return (
          <SideNavItem
            key={item.id}
            active={isActive}
            as={Link}
            css={css`
              border-left: none;
              ::before {
                background-color: transparent;
              }
            `}
            data-active={isActive}
            data-cy={`navitem-${item.id}`}
            indentLevel={3}
            onClick={() =>
              sendEvent({
                name: "Clicked section",
                tab: ImageTabRoutes.BuildInformation,
                "tab.section": item.id,
              })
            }
            to={getImageRoute(
              imageId,
              ImageTabRoutes.BuildInformation,
              item.id,
            )}
          >
            {item.title}
          </SideNavItem>
        );
      })}
    </>
  );
};

export default BuildInformationNavItem;
