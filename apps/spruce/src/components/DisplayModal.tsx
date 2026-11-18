import { Content, Dialog, DialogRoot, Header, Text } from "@via-ds/components";

type DisplayModalProps = {
  children: React.ReactNode;
  "data-testid"?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  size?: "small" | "medium" | "large";
  subtitle?: string;
  title: React.ReactNode;
};

export const DisplayModal: React.FC<DisplayModalProps> = ({
  children,
  "data-testid": dataTestId,
  open,
  setOpen,
  size,
  subtitle,
  title,
}) => (
  <DialogRoot isOpen={open} onOpenChange={setOpen}>
    <Dialog data-testid={dataTestId} size={size}>
      <Header>
        <Text data-testid="modal-title" slot="title">
          {title}
        </Text>
        {subtitle && (
          <Text data-testid="modal-subtitle" slot="description">
            {subtitle}
          </Text>
        )}
      </Header>
      <Content>{children}</Content>
    </Dialog>
  </DialogRoot>
);
