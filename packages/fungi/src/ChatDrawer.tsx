import styled from "@emotion/styled";
import { Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { useChatContext } from "./useChatContext";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
  title: string;
};

export const ChatDrawer: React.FC<Props> = ({
  chatContent,
  children,
  title,
}) => {
  const { drawerOpen, setDrawerOpen } = useChatContext();

  return (
    <DrawerLayout
      displayMode="embedded"
      drawer={<StyledDrawer title={title}>{chatContent}</StyledDrawer>}
      isDrawerOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      {children}
    </DrawerLayout>
  );
};

const StyledDrawer = styled(Drawer)`
  > div {
    padding: 0;
  }
`;
