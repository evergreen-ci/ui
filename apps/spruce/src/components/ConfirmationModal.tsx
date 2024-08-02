import styled from "@emotion/styled";
import Modal, { Variant } from "@leafygreen-ui/confirmation-modal";
import { zIndex } from "constants/tokens";

const ConfirmationModal = styled(Modal)`
  z-index: ${zIndex.modal};
`;
export { ConfirmationModal, Variant };
