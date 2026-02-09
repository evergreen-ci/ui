import { useRef, Component } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Popover } from "@leafygreen-ui/popover";
import { Body } from "@leafygreen-ui/typography";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useOnClickOutside } from "@evg-ui/lib/hooks";
import { useDimensions } from "hooks/useDimensions";

const { gray, white } = palette;

interface DropdownProps {
  buttonRenderer?: () => React.ReactNode;
  buttonText?: string;
  children?: React.ReactNode;
  ["data-cy"]?: string;
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
  "data-cy": dataCy = "dropdown-button",
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

  const handleClickOutside = () => {
    setIsOpen(false);
    onClose();
  };

  // Handle onClickOutside
  useOnClickOutside([listMenuRef, menuButtonRef], handleClickOutside);

  return (
    <Container id={id}>
      <StyledButton
        ref={menuButtonRef}
        data-cy={dataCy}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        rightGlyph={<Icon glyph="CaretDown" />}
      >
        <ButtonContent>
          <LabelWrapper>
            {buttonRenderer ? (
              buttonRenderer()
            ) : (
              <OverflowBody data-cy="dropdown-value">{buttonText}</OverflowBody>
            )}
          </LabelWrapper>
        </ButtonContent>
        <Menu
          active={isOpen}
          adjustOnMutation
          data-cy={`${dataCy}-options`}
          onClick={(e) => e.stopPropagation()}
          refEl={menuButtonRef}
          style={{
            width: menuWidth,
            padding: useHorizontalPadding ? size.xs : `${size.xs} 0`,
          }}
        >
          <div ref={listMenuRef}>{children}</div>
        </Menu>
      </StyledButton>
    </Container>
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

// Styles lifted from LeafyGreen
// https://github.com/mongodb/leafygreen-ui/blob/f38cdc3dca3a82a25884d30f43d87cf79997439d/packages/select/src/ListMenu/ListMenu.styles.ts#L34C5-L39C66
const Menu = styled(Popover)`
  text-align: left;
  position: absolute;
  background-color: ${white};
  overflow: auto;

  border-radius: 12px;
  box-shadow: 0 4px 7px 0 ${gray.light2};
  border: 1px solid ${gray.light2};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Borrow LeafyGreen's styling to un-center button text
// https://github.com/mongodb/leafygreen-ui/blob/a593238ff5801f82a648c20e3595cfc6de6ec6a8/packages/select/src/MenuButton.tsx#L20-L33
const menuButtonStyleOverrides = css`
  // Override button defaults
  > *:last-child {
    grid-template-columns: 1fr 16px;
    justify-content: flex-start;
    > svg {
      justify-self: right;
      width: 16px;
      height: 16px;
    }
  }
`;

const StyledButton = styled(Button)`
  ${menuButtonStyleOverrides}
  background: white;
  width: 100%;
`;

const ButtonContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const OverflowBody = styled(Body)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default DropdownWithRef;
