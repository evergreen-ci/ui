import { Button, Size, Variant } from "@leafygreen-ui/button";
import Sparkle from "@via-ds/icons/Sparkle";
import { useChatContext } from "@evg-ui/fungi";

interface Props {
  setSidePanelCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleChatbotButton: React.FC<Props> = ({
  setSidePanelCollapsed,
}) => {
  const { drawerOpen, setDrawerOpen } = useChatContext();

  return (
    <Button
      leftGlyph={<Sparkle />}
      onClick={() => {
        if (!drawerOpen) {
          setSidePanelCollapsed(true);
        }
        setDrawerOpen((o: boolean) => !o);
      }}
      size={Size.XSmall}
      variant={Variant.PrimaryOutline}
    >
      Parsley AI
    </Button>
  );
};
