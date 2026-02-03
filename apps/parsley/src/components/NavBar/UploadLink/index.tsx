import { useCallback, useState } from "react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components";
import { SentryBreadcrumbTypes, leaveBreadcrumb } from "@evg-ui/lib/utils";
import { useLogDropAnalytics } from "analytics";
import routes from "constants/routes";

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
        SentryBreadcrumbTypes.Navigation,
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
        cancelButtonProps={{
          onClick: () => setOpen(false),
        }}
        confirmButtonProps={{
          children: "Confirm",
          onClick: () => {
            clearLogs();
            setOpen(false);
            navigate(routes.upload);
          },
        }}
        data-cy="confirmation-modal"
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
