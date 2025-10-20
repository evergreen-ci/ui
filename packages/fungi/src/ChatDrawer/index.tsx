import { useEffect } from "react";
import styled from "@emotion/styled";
import { Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { useChatContext } from "../Context";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
  "data-cy"?: string;
  drawerTitle?: React.ReactNode;
  onDrawerOpen?: () => void;
  onDrawerClose?: () => void;
};

export const ChatDrawer: React.FC<Props> = ({
  chatContent,
  children,
  "data-cy": dataCy,
  drawerTitle,
  onDrawerClose,
  onDrawerOpen,
}) => {
  const { appName, drawerOpen, setDrawerOpen } = useChatContext();

  useEffect(() => {
    if (drawerOpen) {
      onDrawerOpen?.();
    } else {
      onDrawerClose?.();
    }
  }, [drawerOpen, onDrawerOpen, onDrawerClose]);

  const handleClose = () => {
    setDrawerOpen(false);
  };

  return (
    <DrawerLayout
      displayMode="embedded"
      drawer={
        <StyledDrawer
          data-cy={dataCy}
          scrollable={false}
          title={drawerTitle || appName}
        >
          {chatContent}
        </StyledDrawer>
      }
      isDrawerOpen={drawerOpen}
      onClose={handleClose}
    >
      {children}
    </DrawerLayout>
  );
};

// Make drawer contents take up the whole height
const StyledDrawer = styled(Drawer)`
  > div {
    > div {
      > div:nth-of-type(2) {
        > div {
          height: 100%;
        }
      }
    }
  }
`;
