import { forwardRef } from "react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useLogWindowAnalytics } from "analytics";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";

interface SharingMenuButtonProps {
  lineNumber: number;
}

const SharingMenuButton = forwardRef<HTMLButtonElement, SharingMenuButtonProps>(
  ({ lineNumber }, ref) => {
    const { handleSelectLine, menuPosition, openMenu, setOpenMenu } =
      useMultiLineSelectContext();
    const { sendEvent } = useLogWindowAnalytics();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (menuPosition === lineNumber) {
        setOpenMenu((o) => !o);
        sendEvent({ name: "Toggled share menu", open: !openMenu });
      } else {
        handleSelectLine(lineNumber, e.shiftKey);
        setOpenMenu(true);
        sendEvent({ name: "Toggled share menu", open: true });
      }
    };

    return (
      <MenuIcon
        ref={ref}
        aria-label="Open share menu"
        data-cy={`log-menu-${lineNumber}`}
        onClick={handleClick}
      >
        <Icon glyph="Ellipsis" size="small" />
      </MenuIcon>
    );
  },
);

SharingMenuButton.displayName = "SharingMenuButton";

const MenuIcon = styled(IconButton)`
  height: 16px;
  width: 16px;
  margin-left: ${size.xxs};
`;

export default SharingMenuButton;
