import { useCallback, useEffect, useRef } from "react";
import { CharKey, ModifierKey } from "../../constants/keys";
import { arraySymmetricDifference } from "../../utils/array";

type ShortcutEvent = {
  name: string;
  keys: string;
};

const useEmptyAnalytics = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendEvent = (_event: ShortcutEvent) => {
  };
  return { sendEvent };
};

type ShortcutKeys = {
  modifierKeys?: ModifierKey[];
  charKey: CharKey;
};

type UseKeyboardShortcutOptions = {
  disabled?: boolean;
  preventDefault?: boolean;
  ignoreFocus?: boolean;
};

// Used to prevent shortcuts from being activated when input elements have focus.
const INPUT_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];

/**
 * `useKeyboardShortcut` is a hook that executes a callback when a specific keyboard shortcut is pressed.
 * @param keys - object containing the keys to listen for
 * @param cb - callback to execute when the shortcut is pressed
 * @param options - options for the hook
 */
export const useKeyboardShortcut = (
  keys: ShortcutKeys,
  cb: () => void,
  options: UseKeyboardShortcutOptions = {},
) => {
  if (!keys.modifierKeys?.length && !keys.charKey) {
    throw new Error("Must provide at least one key.");
  }

  const { sendEvent } = useEmptyAnalytics();
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const {
    disabled = false,
    ignoreFocus = false,
    preventDefault = true,
  } = options;

  const areExactModifierKeysPressed = (
    event: KeyboardEvent,
    modifierKeys: ModifierKey[],
  ): boolean => {
    const pressedModifierKeys: ModifierKey[] = [
      ...(event.ctrlKey || event.metaKey ? [ModifierKey.Control] : []),
      ...(event.altKey ? [ModifierKey.Alt] : []),
      ...(event.shiftKey ? [ModifierKey.Shift] : []),
    ];
    return (
      arraySymmetricDifference(pressedModifierKeys, modifierKeys).length === 0
    );
  };

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      const exactModifierKeysPressed = areExactModifierKeysPressed(
        event,
        keys.modifierKeys ?? [],
      );
      const charKeyPressed = event.key === keys.charKey;

      const shouldExecute =
        ignoreFocus ||
        !INPUT_ELEMENTS.includes((event.target as HTMLElement).tagName);

      if (exactModifierKeysPressed && charKeyPressed) {
        if (shouldExecute) {
          if (preventDefault) {
            event.preventDefault();
          }
          cbRef.current();
          sendEvent({
            name: "Used Shortcut",
            keys: getPressedKeysAsString(keys),
          });
        }
      }
    },
    [keys, preventDefault, ignoreFocus, sendEvent],
  );

  useEffect(() => {
    if (disabled) {
      document.removeEventListener("keydown", handleKeydown);
    } else {
      document.addEventListener("keydown", handleKeydown);
    }

    return (): void => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown, disabled]);
};

const getPressedKeysAsString = (keys: ShortcutKeys): string => {
  const { charKey, modifierKeys } = keys;
  const modifierKeysString = modifierKeys?.join("+") ?? "";
  const charKeyString = charKey ?? "";
  return `${modifierKeysString}${charKeyString}`;
};
