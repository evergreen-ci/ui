import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
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

    const [isFolding, setIsFolding] = useState(false);

    const triggerComicSansWithAnimation = () => {
      setIsFolding(true);
      setModalOpen(false); // Hide original modal

      setTimeout(() => {
        setComicSansEnabled(true);
        setIsFolding(false);

        // Now start the 10s timer for the follow-up prank modal
        setTimeout(() => {
          setIsFollowUp(true);
          setModalOpen(true);
          Cookies.set(SEEN_COMIC_SANS_PRANK, "true", { expires: 2 });
        }, 10000);
      }, 2000); // Match animation duration
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
        <Global
          styles={css`
            @keyframes curtainReveal {
              0% {
                transform: translateY(0%);
              }
              100% {
                transform: translateY(-100%);
              }
            }
          `}
        />

        {isFolding && (
          <div
            css={css`
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background: linear-gradient(to bottom, #007d3c 0%, #00642f 100%);
              animation: curtainReveal 2s ease-in-out forwards;
              transform-origin: top;
              z-index: 2147483647 !important;
              transform: translateZ(0);
              will-change: transform;
              pointer-events: all;
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
            isFollowUp
              ? () => setModalOpen(false)
              : triggerComicSansWithAnimation
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
