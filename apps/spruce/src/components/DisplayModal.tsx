import styled from "@emotion/styled";
import { Modal, ModalProps } from "@leafygreen-ui/modal";
import { Body, H3 } from "@leafygreen-ui/typography";
import { size as tokenSize } from "@evg-ui/lib/constants/tokens";

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
    {title && <H3 data-cy="modal-title">{title}</H3>}
    {subtitle && (
      <StyledSubtitle data-cy="modal-subtitle">{subtitle}</StyledSubtitle>
    )}
    {children}
  </Modal>
);

const StyledSubtitle = styled(Body)`
  margin-bottom: ${tokenSize.xs};
`;
