import { Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { useChatContext } from "../Context";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
};

export const ChatDrawer: React.FC<Props> = ({ chatContent, children }) => {
  const { appName, drawerOpen, setDrawerOpen } = useChatContext();

  return (
    <DrawerLayout
      displayMode="embedded"
      drawer={
        <Drawer scrollable={false} title={appName}>
          {chatContent}
        </Drawer>
      }
      isDrawerOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      {children}
    </DrawerLayout>
  );
};
