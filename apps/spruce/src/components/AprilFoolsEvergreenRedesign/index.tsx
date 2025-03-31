import { useState, forwardRef, useImperativeHandle } from "react";
import { css, Global } from "@emotion/react";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import Cookies from "js-cookie";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { SEEN_COMIC_SANS_PRANK } from "constants/cookies";

export interface EvergreenRedesignModalHandle {
  openModal: () => void;
}

const EvergreenRedesignModal = forwardRef<EvergreenRedesignModalHandle>(
  (_, ref) => {
    const [modalOpen, setModalOpen] = useState(
      Cookies.get(SEEN_COMIC_SANS_PRANK) !== "true",
    );
    const [comicSansEnabled, setComicSansEnabled] = useState(false);
    const [isFollowUp, setIsFollowUp] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => {
        setModalOpen(true);
        setIsFollowUp(false);
      },
    }));

    const enableComicSans = () => {
      setComicSansEnabled(true);
      setModalOpen(false);

      setTimeout(() => {
        setIsFollowUp(true);
        setModalOpen(true);
        // Expire the cookies after 2 days which should be after we remove the prank
        Cookies.set(SEEN_COMIC_SANS_PRANK, "true", { expires: 2 });
      }, 10000); // 10 seconds later
    };

    return (
      <>
        {comicSansEnabled && (
          <Global
            styles={css`
              * {
                font-family: "Comic Sans MS", "Comic Sans", cursive !important;
                /* letter-spacing: 0.1em; */
                text-transform: uppercase;
              }
            `}
          />
        )}

        <MarketingModal
          buttonText={
            isFollowUp ? "Okay... I guess?" : "Experience the Redesign"
          }
          css={css`
            z-index: ${zIndex.modal};
          `}
          darkMode
          graphic={<div />}
          linkText={isFollowUp ? "Click here to reset the page" : ""}
          onButtonClick={
            isFollowUp ? () => setModalOpen(false) : enableComicSans
          }
          onClose={() => setModalOpen(false)}
          onLinkClick={() => window.location.reload()}
          open={modalOpen}
          setOpen={setModalOpen}
          showBlob
          title={
            isFollowUp
              ? "Just Kidding — April Fools!"
              : "Introducing the Evergreen Redesign"
          }
        >
          {isFollowUp ? (
            <>
              We got you 😈 Comic Sans is here to stay (unless you reload the
              page).
              <br />
              Happy April Fools!
            </>
          ) : (
            <>
              Evergreen is evolving. After extensive user research, design
              audits, and a lot of soul-searching, we&apos;ve embraced a
              friendlier, more human design.
              <br />
              <br />
              Click below to preview the future of our design system.
            </>
          )}
        </MarketingModal>
      </>
    );
  },
);

EvergreenRedesignModal.displayName = "EvergreenRedesignModal";

export default EvergreenRedesignModal;
