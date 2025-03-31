import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { css, Global } from "@emotion/react";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import Cookies from "js-cookie";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useNavbarAnalytics } from "analytics";
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
    const { sendEvent } = useNavbarAnalytics();
    useImperativeHandle(ref, () => ({
      openModal: () => {
        sendEvent({ name: "Clicked enable april fools link in navbar" });
        setModalOpen(true);
        setIsFollowUp(false);
      },
    }));

    const triggerComicSansWithAnimation = () => {
      setModalOpen(false); // Hide original modal

      setComicSansEnabled(true);

      // Now start the 10s timer for the follow-up prank modal
      setTimeout(() => {
        setIsFollowUp(true);
        setModalOpen(true);
        Cookies.set(SEEN_COMIC_SANS_PRANK, "true", { expires: 2 });
      }, 8000);
    };

    useEffect(() => {
      if (!comicSansEnabled) return;

      const trailElements: HTMLSpanElement[] = [];

      const handleMouseMove = (e: MouseEvent) => {
        const trail = document.createElement("span");
        trail.textContent = "✨"; // or try 🎉, 😎, 🐸, 💚, 🧃
        trail.style.position = "fixed";
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        trail.style.pointerEvents = "none";
        trail.style.zIndex = "2147483647";
        trail.style.transform = "translate(-50%, -50%)";
        trail.style.fontSize = "20px";
        trail.style.opacity = "1";
        trail.style.transition =
          "opacity 0.6s ease-out, transform 0.6s ease-out";
        document.body.appendChild(trail);
        trailElements.push(trail);

        requestAnimationFrame(() => {
          trail.style.opacity = "0";
          trail.style.transform = "translate(-50%, -50%) scale(2)";
        });

        setTimeout(() => {
          trail.remove();
        }, 600);
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        trailElements.forEach((el) => el.remove());
      };
    }, [comicSansEnabled]);

    return (
      <>
        {comicSansEnabled && (
          <Global
            styles={css`
              * {
                font-family: "Comic Sans MS", "Comic Sans", cursive !important;
                letter-spacing: 0.1em;
                text-transform: uppercase;
              }
            `}
          />
        )}

        <MarketingModal
          buttonText={
            isFollowUp
              ? "The Evergreen team rocks for this!"
              : "Experience the Redesign"
          }
          css={css`
            z-index: ${zIndex.modal};
          `}
          darkMode
          graphic={<div />}
          linkText={isFollowUp ? "Click here to reset the page" : ""}
          onButtonClick={
            isFollowUp
              ? () => setModalOpen(false)
              : triggerComicSansWithAnimation
          }
          onClose={() => setModalOpen(false)}
          onLinkClick={() => {
            sendEvent({ name: "Clicked disable april fools link" });
            window.location.reload();
          }}
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
