import { Modal, ModalProps } from "@leafygreen-ui/modal";
import { Body, H3 } from "@leafygreen-ui/typography";
import styles from "./DisplayModal.module.css";

type DisplayModalProps = Omit<ModalProps, "title"> & {
  title?: React.ReactNode | string;
  subtitle?: string;
};

export const DisplayModal: React.FC<DisplayModalProps> = ({
  children,
  subtitle,
  title,
  ...rest
}) => (
  <Modal {...rest}>
    {title && <H3 data-testid="modal-title">{title}</H3>}
    {subtitle && (
      <Body className={styles.subtitle} data-testid="modal-subtitle">
        {subtitle}
      </Body>
    )}
    {children}
  </Modal>
);
