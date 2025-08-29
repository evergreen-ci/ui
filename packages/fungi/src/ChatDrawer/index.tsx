import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useChatContext } from "../Context";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
  title: string;
};

export const ChatDrawer: React.FC<Props> = ({
  chatContent,
  children,
  title,
}) => {
  const { drawerOpen, setDrawerOpen } = useChatContext();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  // Lock page scroll when open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (drawerOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  // Move focus to panel when opened
  useEffect(() => {
    if (drawerOpen) {
      // slight delay to ensure element is in DOM
      const id = requestAnimationFrame(() => panelRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [drawerOpen]);

  return (
    <>
      {/* Main page is always rendered and interactive */}
      {children}

      {/* Backdrop */}
      <Backdrop
        $open={drawerOpen}
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Sliding panel */}
      <Panel
        ref={panelRef}
        $open={drawerOpen}
        aria-label={title}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        <PanelHeader>
          <Title>{title}</Title>
          <IconButton
            aria-label="Close chat"
            onClick={() => setDrawerOpen(false)}
            type="button"
          />
        </PanelHeader>
        <PanelBody>{chatContent}</PanelBody>
      </Panel>
    </>
  );
};

/* ===== Styles ===== */

const Z = {
  backdrop: 1000,
  panel: 1001,
};

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 40, 0.4);
  opacity: ${(p) => (p.$open ? 1 : 0)};
  transition: opacity 200ms ease;
  pointer-events: ${(p) => (p.$open ? "auto" : "none")};
  z-index: ${Z.backdrop};
`;

const Panel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  width: clamp(320px, 32vw, 520px);
  background: #ffffff;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.12);
  transform: translateX(${(p) => (p.$open ? "0%" : "100%")});
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: ${Z.panel};
  display: flex;
  flex-direction: column;
  outline: none;
  /* Optional: elevate on mac dark backgrounds */
  @media (prefers-color-scheme: dark) {
    background: #0f1115;
    color: #e6e6e6;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(60, 60, 67, 0.12);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
`;

const IconButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  line-height: 0;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;

const PanelBody = styled.div`
  flex: 1;
  overflow: auto;
  padding: 12px 16px 16px;
`;
