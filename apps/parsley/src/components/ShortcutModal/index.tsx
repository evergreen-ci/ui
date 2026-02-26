import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { Modal } from "@leafygreen-ui/modal";
import { Body, H3, InlineKeyCode } from "@leafygreen-ui/typography";
import { CharKey, ModifierKey } from "@evg-ui/lib/constants/keys";
import { size } from "@evg-ui/lib/constants/tokens";
import { useKeyboardShortcut, useOnClickOutside } from "@evg-ui/lib/hooks";
import { useIsParsleyAIAvailable } from "hooks";

const shortcuts = [
  {
    description: "Open or close the shortcut modal",
    id: "shortcut-modal",
    keys: [["SHIFT", "?"]],
  },
  {
    description: "Focus on the search input",
    id: "search-focus",
    keys: [
      ["CTRL", "F"],
      ["⌘", "F"],
    ],
  },
  {
    description: "Toggle between filter and highlight",
    id: "search-toggle",
    keys: [
      ["CTRL", "S"],
      ["⌘", "S"],
    ],
  },
  {
    description: "Apply the filter or highlight",
    id: "search-apply",
    keys: [
      ["CTRL", "ENTER"],
      ["⌘", "ENTER"],
    ],
  },
  {
    description: "Toggle the side panel",
    id: "side-panel-toggle",
    keys: [["["]],
  },
  {
    description: "Toggle the Parsley AI chat window",
    id: "parsley-ai-toggle",
    keys: [["]"]],
  },
  {
    description: "Paginate forward to the next search result",
    id: "search-next",
    keys: [["N"], ["ENTER"]],
  },
  {
    description: "Paginate backwards to the previous search result",
    id: "search-prev",
    keys: [["P"], ["SHIFT", "ENTER"]],
  },
  {
    description: "Tab to complete a search suggestion",
    id: "search-autocomplete",
    keys: [["TAB"]],
  },
] as const;

interface ShortcutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ShortcutModal: React.FC<ShortcutModalProps> = ({ open, setOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isParsleyAIAvailable = useIsParsleyAIAvailable();

  const visibleShortcuts = useMemo(
    () =>
      shortcuts.filter(
        (shortcut) =>
          shortcut.id !== "parsley-ai-toggle" || isParsleyAIAvailable,
      ),
    [isParsleyAIAvailable],
  );

  useKeyboardShortcut(
    { charKey: CharKey.QuestionMark, modifierKeys: [ModifierKey.Shift] },
    () => {
      setOpen(!open);
    },
  );

  useOnClickOutside([modalRef], () => {
    setOpen(false);
  });

  return (
    <Modal data-cy="shortcut-modal" open={open} setOpen={setOpen}>
      <div ref={modalRef}>
        <ModalTitle>
          <H3>Parsley Keyboard Shortcuts</H3>
        </ModalTitle>

        {visibleShortcuts.map(({ description, id, keys }) => (
          <ModalRow key={id}>
            <ShortcutKeys>
              {keys.map((k, idx) => (
                <span key={k[0]}>
                  <KeyTuple keys={k} />
                  {idx + 1 !== keys.length && <Divider>{" / "}</Divider>}
                </span>
              ))}
            </ShortcutKeys>
            <Body>{description}</Body>
          </ModalRow>
        ))}
      </div>
    </Modal>
  );
};
interface KeyTupleProps {
  keys: readonly string[];
}
const KeyTuple: React.FC<KeyTupleProps> = ({ keys }) => (
  <span>
    {keys.map((k, idx) => (
      <span key={`key_tuple_${k}`}>
        <InlineKeyCode>{k}</InlineKeyCode>
        {idx + 1 !== keys.length && <Divider>{" + "}</Divider>}
      </span>
    ))}
  </span>
);

const ModalTitle = styled.div`
  margin-bottom: ${size.l};
`;

const ModalRow = styled.div`
  display: flex;
  margin: ${size.s} 0;
`;

const ShortcutKeys = styled.div`
  display: flex;
  margin-right: ${size.xs};
  width: 225px;
`;

const Divider = styled.span`
  margin: 0 ${size.xxs};
`;

export default ShortcutModal;
