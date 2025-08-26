import { Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { useChatContext } from "../Context";

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
      drawer={
        <Drawer scrollable={false} title={title}>
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
