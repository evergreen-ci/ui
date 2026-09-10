import {
  AlertDialog,
  Body,
  Button,
  Content,
  DialogRoot,
  Footer,
  Header,
  Text,
} from "@via-ds/components";
import {
  unstable_BlockerFunction as BlockerFunction,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";

export type NavigationModalProps = {
  shouldBlock: boolean | BlockerFunction;
  unsavedTabs: Array<{
    title: string;
    value: string;
  }>;
};

export const NavigationWarningModal: React.FC<NavigationModalProps> = ({
  shouldBlock,
  unsavedTabs,
}) => {
  const blocker = useBlocker(shouldBlock);

  return blocker.state === "blocked" ? (
    <DialogRoot isOpen onOpenChange={() => blocker.reset?.()}>
      <AlertDialog data-testid="navigation-warning-modal" variant="danger">
        <Header>
          <Text slot="title">
            You have unsaved changes that will be discarded. Are you sure you
            want to leave?
          </Text>
        </Header>
        <Content>
          <Body>Unsaved changes are present on the following pages:</Body>
          <ol data-testid="unsaved-pages">
            {unsavedTabs.map(({ title, value }) => (
              <li key={value}>{title}</li>
            ))}
          </ol>
        </Content>
        <Footer>
          <Button onPress={() => blocker.reset?.()} slot="cancel">
            Cancel
          </Button>
          <Button
            onPress={() => blocker.proceed?.()}
            slot="action"
            variant="danger"
          >
            Leave
          </Button>
        </Footer>
      </AlertDialog>
    </DialogRoot>
  ) : null;
};
