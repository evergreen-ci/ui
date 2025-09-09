import styled from "@emotion/styled";
import { Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { useChatContext } from "../Context";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
  "data-cy"?: string;
  drawerTitle: React.ReactNode;
};

export const ChatDrawer: React.FC<Props> = ({
  chatContent,
  children,
  "data-cy": dataCy,
  drawerTitle,
}) => {
  const { drawerOpen, setDrawerOpen } = useChatContext();

  return (
    <DrawerLayout
      displayMode="embedded"
      drawer={
        <StyledDrawer data-cy={dataCy} scrollable={false} title={drawerTitle}>
          {chatContent}
        </StyledDrawer>
      }
      isDrawerOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
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
