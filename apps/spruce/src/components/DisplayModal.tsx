import { Content, Dialog, DialogRoot, Header, Text } from "@via-ds/components";
import { Body } from "@via-ds/components/typography";
import styles from "./DisplayModal.module.css";

type DisplayModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: React.ReactNode | string;
  subtitle?: string;
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
  "data-testid"?: string;
};

export const DisplayModal: React.FC<DisplayModalProps> = ({
  children,
  open,
  setOpen,
  size = "medium",
  subtitle,
  title,
  ...rest
}) => (
  <DialogRoot isOpen={open} onOpenChange={setOpen}>
    <Dialog size={size} {...rest}>
      <Header>{title && <Text slot="title">{title}</Text>}</Header>
      <Content>
        {subtitle && (
          <Body className={styles.subtitle} data-testid="modal-subtitle">
            {subtitle}
          </Body>
        )}
        {children}
      </Content>
    </Dialog>
  </DialogRoot>
);
