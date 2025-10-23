import styled from "@emotion/styled";
import { DisplayMode, Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { useChatContext } from "../Context";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
  "data-cy"?: string;
  drawerTitle?: React.ReactNode;
};

export const ChatDrawer = ({
  chatContent,
  children,
  "data-cy": dataCy,
  drawerTitle,
}: React.PropsWithChildren<Props>) => {
  const { appName, drawerOpen, setDrawerOpen } = useChatContext();

  const handleClose = () => {
    setDrawerOpen(false);
  };

  return (
    <StyledDrawerLayout
      displayMode={DisplayMode.Embedded}
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
    </StyledDrawerLayout>
  );
};

// Make drawer contents take up the whole height
const StyledDrawer = styled(Drawer)`
  > div {
    > div {
      > div:nth-of-type(2) {
        > div {
          /* Override default 16px */
          padding: 0;

          height: 100%;
          > div {
            height: 100%;
          }
        }
      }
    }
  }
`;

const StyledDrawerLayout = styled(DrawerLayout)`
  height: 100%;
`;
