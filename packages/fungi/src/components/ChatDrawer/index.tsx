import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { CharKey } from "@evg-ui/lib/constants/keys";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { useKeyboardShortcut } from "@evg-ui/lib/hooks/useKeyboardShortcut";
import { useChatContext } from "../../Context";

type Props = {
  children: React.ReactNode;
  chatContent: React.ReactNode;
  title: string;
  className?: string;
};

export const ChatDrawer: React.FC<Props> = ({
  chatContent,
  children,
  className,
  title,
}) => {
  const { drawerOpen, setDrawerOpen } = useChatContext();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useKeyboardShortcut({ charKey: CharKey.Escape, modifierKeys: [] }, () =>
    setDrawerOpen(false),
  );

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
      {children}
      {/* Sliding panel */}
      <Panel
        ref={panelRef}
        aria-label={title}
        aria-modal="true"
        className={className}
        open={drawerOpen}
        role="dialog"
        tabIndex={-1}
      >
        <PanelHeader>
          {/* @ts-expect-error body component throws an error */}
          <Body weight="bold">{title}</Body>
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

const Panel = styled.div<{ open: boolean }>`
  position: fixed;
  bottom: 0;
  right: 0;
  height: 100%;
  width: clamp(320px, 32vw, 520px);
  background: #ffffff;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.12);
  transform: translateX(${(p) => (p.open ? "0%" : "100%")});
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: ${zIndex.drawer};
  display: flex;
  flex-direction: column;
  outline: none;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${size.s};
  border-bottom: 1px solid rgba(60, 60, 67, 0.12);
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
  padding: ${size.s};
  border: red 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
