import { Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { useChatContext } from "../Context";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
  "data-cy"?: string;
};

export const ChatDrawer: React.FC<Props> = ({
  chatContent,
  children,
  "data-cy": dataCy,
}) => {
  const { appName, drawerOpen, setDrawerOpen } = useChatContext();

  return (
    <DrawerLayout
      displayMode="embedded"
      drawer={
        <Drawer data-cy={dataCy} scrollable={false} title={appName}>
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
