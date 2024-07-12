export const WINDOWS_KEYMAP: { [key: string]: number } = {
  'KeyA': 0x04, // a
  'KeyB': 0x05, // b
  'KeyC': 0x06, // c
  'KeyD': 0x07, // d
  'KeyE': 0x08, // e
  'KeyF': 0x09, // f
  'KeyG': 0x0A, // g
  'KeyH': 0x0B, // h
  'KeyI': 0x0C, // i
  'KeyJ': 0x0D, // j
  'KeyK': 0x0E, // k
  'KeyL': 0x0F, // l
  'KeyM': 0x10, // m
  'KeyN': 0x11, // n
  'KeyO': 0x12, // o
  'KeyP': 0x13, // p
  'KeyQ': 0x14, // q
  'KeyR': 0x15, // r
  'KeyS': 0x16, // s
  'KeyT': 0x17, // t
  'KeyU': 0x18, // u
  'KeyV': 0x19, // v
  'KeyW': 0x1A, // w
  'KeyX': 0x1B, // x
  'KeyY': 0x1C, // y
  'KeyZ': 0x1D, // z
  'Digit0': 0x27, // 0
  'Digit1': 0x1E, // 1
  'Digit2': 0x1F, // 2
  'Digit3': 0x20, // 3
  'Digit4': 0x21, // 4
  'Digit5': 0x22, // 5
  'Digit6': 0x23, // 6
  'Digit7': 0x24, // 7
  'Digit8': 0x25, // 8
  'Digit9': 0x26, // 9
  'Enter': 0x28, // Enter
  'NumpadEnter': 0x58, // Numpad Enter
  'Escape': 0x29, // Escape
  'Backspace': 0x2A, // Backspace
  'Tab': 0x2B, // Tab
  'Space': 0x2C, // Space
  'Minus': 0x2D, // -
  'Equal': 0x2E, // =
  'BracketLeft': 0x2F, // [
  'BracketRight': 0x30, // ]
  'Backslash': 0x31, // Backslash
  'Semicolon': 0x33, // ;
  // 'Quote': 0x34, // '
  'Backquote': 0x35, // `
  'Comma': 0x36, // ,
  'Period': 0x37, // .
  'Slash': 0x38, // /
  'CapsLock': 0x39, // Caps Lock
  'F1': 0x3A, // F1
  'F2': 0x3B, // F2
  'F3': 0x3C, // F3
  'F4': 0x3D, // F4
  'F5': 0x3E, // F5
  'F6': 0x3F, // F6
  'F7': 0x40, // F7
  'F8': 0x41, // F8
  'F9': 0x42, // F9
  'F10': 0x43, // F10
  'F11': 0x44, // F11
  'F12': 0x45, // F12
  'PrintScreen': 0x46, // Print Screen
  'ScrollLock': 0x47, // Scroll Lock
  'Pause': 0x48, // Pause
  'Insert': 0x49, // Insert
  'Home': 0x4A, // Home
  'PageUp': 0x4B, // Page Up
  'Delete': 0x4C, // Delete
  'End': 0x4D, // End
  'PageDown': 0x4E, // Page Down
  'ArrowRight': 0x4F, // Right Arrow
  'ArrowLeft': 0x50, // Left Arrow
  'ArrowDown': 0x51, // Down Arrow
  'ArrowUp': 0x52, // Up Arrow
  'NumLock': 0x53, // Num Lock
  'NumpadDivide': 0x54, // Numpad /
  'NumpadMultiply': 0x55, // Numpad *
  'NumpadAdd': 0x57, // Numpad +
  'ShiftRight': 0xE5, // Right Shift
  'ControlRight': 0xE4, // Right Ctrl
  'AltRight': 0xE6, // Right Alt
  // Additional mappings for special characters
  'Numpad1': 0x1E, // key 1 (!)
  'Numpad2': 0x1F, // key 2 (@)
  'Numpad3': 0x20, // key 3 (#)
  'Numpad4': 0x21, // key 4 ($)
  'Numpad5': 0x22, // key 5 (%)
  'Numpad6': 0x23, // key 6 (^)
  'Numpad7': 0x24, // key 7 (&)
  'Numpad8': 0x2A, // key *
  'Numpad9': 0x26, // key 9 (()
  'Numpad0': 0x27, // key 0 ())
  'NumpadSubtract': 0x2D, // key -
  'NumpadEqual': 0x2E, // key = // key ;
  'Quote': 0x34, // key '
};

// SHIFT keys
export const WINDOWS_SHIFT_KEYS = [
  'ShiftLeft', // Shift Left
  'ShiftRight' // Shift Right
];

// CTRL keys
export const WINDOWS_CTRL_KEYS = [
  'ControlLeft', // Ctrl Left
  'ControlRight' // Ctrl Right
];

// ALT keys
export const WINDOWS_ALT_KEYS = [
  'AltLeft', // Alt Left
  'AltRight' // Alt Right
];