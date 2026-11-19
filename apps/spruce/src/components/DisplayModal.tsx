import { Dialog, DialogProps, DialogRoot } from "@via-ds/components/dialog";
import { Content, Header } from "@via-ds/components/structure";
import { Text } from "@via-ds/components/typography";

type DisplayModalProps = Pick<DialogProps, "children" | "size"> & {
  "data-testid"?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
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
