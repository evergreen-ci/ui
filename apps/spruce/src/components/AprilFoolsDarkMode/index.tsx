import { useState, forwardRef, useImperativeHandle } from "react";
import { css, Global, keyframes } from "@emotion/react";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import Cookies from "js-cookie";
import { SEEN_DARK_MODE_PRANK } from "constants/cookies";

const fadeToBlack = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export interface AprilFoolsDarkModeHandle {
  openModal: () => void;
}

const AprilFoolsDarkMode = forwardRef<AprilFoolsDarkModeHandle>((_, ref) => {
  const [modalOpen, setModalOpen] = useState(
    Cookies.get(SEEN_DARK_MODE_PRANK) !== "true",
  );
  const [darkMode, setDarkMode] = useState(false);
  const [isJokeReveal, setIsJokeReveal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setIsJokeReveal(false);
      setModalOpen(true);
      setShowOverlay(false);
    },
  }));

  const fakeDarkMode = () => {
    setShowOverlay(true);
    setDarkMode(true);
    setModalOpen(false);

    setTimeout(() => {
      setIsJokeReveal(true);
      setModalOpen(true);
      setShowOverlay(false);
    }, 10000); // 10 seconds
  };

  const turnOffDarkMode = () => {
    setDarkMode(false);
    setShowOverlay(false);
    setModalOpen(false);
    Cookies.set(SEEN_DARK_MODE_PRANK, "true", { expires: 2 });
  };

  return (
    <>
      {darkMode && !isJokeReveal && (
        <Global
          styles={css`
            * {
              background-color: black !important;
              color: black !important;
              border-color: black !important;
              transition:
                background-color 1s ease,
                color 1s ease,
                border-color 1s ease;
            }
          `}
        />
      )}
      {showOverlay && (
        <div
          css={css`
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: black;
            opacity: 0;
            animation: ${fadeToBlack} 1.5s forwards;
            z-index: 9999;
          `}
        />
      )}
      <MarketingModal
        buttonText={isJokeReveal ? "Disable Dark mode" : "Enable Dark Mode!"}
        darkMode
        disclaimer={
          isJokeReveal ? (
            <span>
              If you would like to turn this on again feel free to toggle it
              back from the more menu{" "}
            </span>
          ) : undefined
        }
        graphic={<div />}
        linkText="🙂"
        onButtonClick={isJokeReveal ? turnOffDarkMode : fakeDarkMode}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        setOpen={setModalOpen}
        showBlob
        title={
          isJokeReveal ? "Just kidding — April Fools!" : "Introducing Dark Mode"
        }
      >
        {isJokeReveal
          ? "We got you! There’s no dark mode… yet 😜"
          : "After years of requests, we're excited to announce that Dark Mode is finally here. Click the button below to enable it."}
      </MarketingModal>
    </>
  );
});

AprilFoolsDarkMode.displayName = "AprilFoolsDarkMode";

export default AprilFoolsDarkMode;
