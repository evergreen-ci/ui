import { useCallback, useEffect, useRef } from "react";
import { CharKey, ModifierKey } from "../../constants/keys";
import { arraySymmetricDifference } from "../../utils/array";

type ShortcutKeys = {
  modifierKeys?: ModifierKey[];
  charKey: CharKey;
};

export type UseKeyboardShortcutOptions = {
  disabled?: boolean;
  preventDefault?: boolean;
  ignoreFocus?: boolean;
  sendAnalytics?: (data: { name: string; keys: string }) => void;
};

const INPUT_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];

/**
 * `useKeyboardShortcut` is a hook that executes a callback when a specific keyboard shortcut is pressed.
 * @param keys - the shortcut keys configuration (modifier keys and character key)
 * @param cb - callback to execute when the shortcut is pressed
 * @param options - configuration options for the shortcut behavior
 */
export const useKeyboardShortcut = (
  keys: ShortcutKeys,
  cb: () => void,
  options: UseKeyboardShortcutOptions = {},
): void => {
  // Validate keys in useEffect to avoid issues during render
  useEffect(() => {
    if (!keys.modifierKeys?.length && !keys.charKey) {
      throw new Error("Must provide at least one key.");
    }
  }, [keys.modifierKeys, keys.charKey]);

  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  const {
    disabled = false,
    ignoreFocus = false,
    preventDefault = true,
    sendAnalytics,
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
          if (sendAnalytics) {
            sendAnalytics({
              name: "Used Shortcut",
              keys: getPressedKeysAsString(keys),
            });
          }
        }
      }
    },
    [keys, preventDefault, ignoreFocus, sendAnalytics],
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
