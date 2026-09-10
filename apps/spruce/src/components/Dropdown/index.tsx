import { Component, useRef } from "react";
import { Button, Popover, PopoverRoot } from "@via-ds/components";
import { Body } from "@via-ds/components/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";

import { useDimensions } from "hooks/useDimensions";
import styles from "./index.module.css";

interface DropdownProps {
  buttonRenderer?: () => React.ReactNode;
  buttonText?: string;
  children?: React.ReactNode;
  ["data-testid"]?: string;
  disabled?: boolean;
  id?: string;
  isOpen: boolean;
  onClose?: () => void;
  setIsOpen: (isOpen: boolean) => void;
  useHorizontalPadding?: boolean;
}
const Dropdown: React.FC<DropdownProps> = ({
  buttonRenderer,
  buttonText,
  children,
  "data-testid": dataTestId = "dropdown-button",
  disabled = false,
  id,
  isOpen,
  onClose = () => {},
  setIsOpen,
  useHorizontalPadding = true,
}) => {
  const listMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const menuSize = useDimensions(menuButtonRef);
  const menuWidth = menuSize?.width ?? 0;

  return (
    <div className={styles.container} id={id}>
      <PopoverRoot
        isNonModal
        isOpen={isOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setIsOpen(false);
            onClose();
          }
        }}
        triggerType="dialog"
      >
        <Button
          ref={menuButtonRef}
          className={styles.button}
          data-testid={dataTestId}
          isDisabled={disabled}
          onPress={() => setIsOpen(!isOpen)}
        >
          <div className={styles.buttonContent}>
            <div className={styles.labelWrapper}>
              {buttonRenderer ? (
                buttonRenderer()
              ) : (
                <Body
                  className={styles.overflowBody}
                  data-testid="dropdown-value"
                >
                  {buttonText}
                </Body>
              )}
            </div>
          </div>
          <Icon glyph="CaretDown" />
        </Button>
        <Popover
          className={styles.menu}
          data-testid={`${dataTestId}-options`}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: menuWidth,
            padding: useHorizontalPadding ? size.xs : `${size.xs} 0`,
          }}
        >
          <div ref={listMenuRef}>{children}</div>
        </Popover>
      </PopoverRoot>
    </div>
  );
};

interface DropdownWithRefProps extends Omit<
  DropdownProps,
  "isOpen" | "setIsOpen"
> {
  ref?: React.Ref<DropdownWithRef>;
}

interface DropdownWithRefState {
  isOpen: boolean;
}
/**
 * DropdownWithRef is a class component that allows the implementer to control its internal state methods with a ref in order to trigger state updates
 */
class DropdownWithRef extends Component<
  DropdownWithRefProps,
  DropdownWithRefState
> {
  constructor(props: DropdownWithRefProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  setIsOpen = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <Dropdown {...this.props} isOpen={isOpen} setIsOpen={this.setIsOpen} />
    );
  }
}

export default DropdownWithRef;
