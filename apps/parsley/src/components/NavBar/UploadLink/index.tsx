import { useCallback, useState } from "react";
import { css } from "@emotion/react";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useLogDropAnalytics } from "analytics";
import routes from "constants/routes";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";

interface UploadLinkProps {
  hasLogs: boolean | null;
  clearLogs: () => void;
}
const UploadLink: React.FC<UploadLinkProps> = ({ clearLogs, hasLogs }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { sendEvent } = useLogDropAnalytics();
  const handleClick = useCallback(() => {
    if (hasLogs) {
      sendEvent({ "has.logs": true, name: "Clicked file upload link" });
      setOpen(true);
    } else {
      leaveBreadcrumb(
        "upload-link",
        { from: pathname, hasLogs: false, to: "/upload" },
        SentryBreadcrumb.Navigation,
      );
      sendEvent({ "has.logs": false, name: "Clicked file upload link" });
      navigate(routes.upload);
    }
  }, [hasLogs, pathname, sendEvent, navigate]);
  return (
    <>
      <StyledRouterLink
        data-cy="upload-link"
        onClick={handleClick}
        to={hasLogs ? "#" : routes.upload}
      >
        Upload
      </StyledRouterLink>
      <ConfirmationModal
        buttonText="Confirm"
        css={css`
          z-index: ${zIndex.modal};
        `}
        data-cy="confirmation-modal"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          clearLogs();
          setOpen(false);
          navigate(routes.upload);
        }}
        open={open}
        title="Navigating away will clear your current logs."
        variant="danger"
      >
        Are you sure you want to navigate away?
      </ConfirmationModal>
    </>
  );
};

export default UploadLink;
