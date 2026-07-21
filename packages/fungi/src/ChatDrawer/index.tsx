import { DisplayMode, Drawer, DrawerLayout } from "@leafygreen-ui/drawer";
import { useChatContext } from "#Context";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
  "data-cy"?: string;
  "data-testid"?: string;
  drawerTitle?: React.ReactNode;
};

export const ChatDrawer = ({
  chatContent,
  children,
  "data-cy": dataCy,
  "data-testid": dataTestId,
  drawerTitle,
}: React.PropsWithChildren<Props>) => {
  const { appName, drawerOpen, setDrawerOpen } = useChatContext();

  const handleClose = () => {
    setDrawerOpen(false);
  };

  return (
    <DrawerLayout
      displayMode={DisplayMode.Embedded}
      drawer={
        <Drawer
          data-cy={dataCy}
          data-testid={dataTestId}
          hasPadding={false}
          title={drawerTitle || appName}
        >
          {chatContent}
        </Drawer>
      }
      isDrawerOpen={drawerOpen}
      onClose={handleClose}
    >
      {children}
    </DrawerLayout>
  );
};
