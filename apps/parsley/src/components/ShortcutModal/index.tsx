import { useRef } from "react";
import styled from "@emotion/styled";
import { Modal } from "@leafygreen-ui/modal";
import { Body, H3, InlineKeyCode } from "@leafygreen-ui/typography";
import { CharKey, ModifierKey, size } from "@evg-ui/lib/constants";
import { useKeyboardShortcut, useOnClickOutside } from "@evg-ui/lib/hooks";

const shortcuts = [
  { description: "Open or close the shortcut modal", keys: [["SHIFT", "?"]] },
  {
    description: "Focus on the search input",
    keys: [
      ["CTRL", "F"],
      ["⌘", "F"],
    ],
  },
  {
    description: "Toggle between filter and highlight",
    keys: [
      ["CTRL", "S"],
      ["⌘", "S"],
    ],
  },
  {
    description: "Apply the filter or highlight",
    keys: [
      ["CTRL", "ENTER"],
      ["⌘", "ENTER"],
    ],
  },
  { description: "Toggle the side panel", keys: [["["]] },
  {
    description: "Paginate forward to the next search result",
    keys: [["N"], ["ENTER"]],
  },
  {
    description: "Paginate backwards to the previous search result",
    keys: [["P"], ["SHIFT", "ENTER"]],
  },
  {
    description: "Tab to complete a search suggestion",
    keys: [["TAB"]],
  },
];

interface ShortcutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ShortcutModal: React.FC<ShortcutModalProps> = ({ open, setOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

        {shortcuts.map(({ description, keys }) => (
          <ModalRow key={description}>
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
  keys: string[];
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
