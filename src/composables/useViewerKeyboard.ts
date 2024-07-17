import type { ControlKeys } from "~/types/keyboard"

export const useViewerKeyboard = () => {
    const enabled = useState<boolean>('keyboard', () => false)
    const toggles = ref<Array<number>>([])
    const modifiers = useState<number>('modifiers')
    const controlKeys = useState<ControlKeys>('control-keys', () => ({
        windowsRight: false,
        altRight: false,
        shiftRight: false,
        ctrlRight: false,
        windowsLeft: false,
        altLeft: false,
        shiftLeft: false,
        ctrlLeft: false
    }))

    const { isConnected, write } = useSerial()

    const handleEvent = (event: KeyboardEvent, pressed: boolean): void => {
        event.preventDefault()

        const keyData = new Uint8Array(13)
        keyData.set(KEYBOARD_ACTION_PREFIX, 0)

        let combinedModifiers = 0
        let mappedKeyCode = WINDOWS_KEYMAP[event.code]

        if (WINDOWS_SHIFT_KEYS.includes(event.code) || WINDOWS_CTRL_KEYS.includes(event.code) || WINDOWS_ALT_KEYS.includes(event.code)) {
            if (modifiers.value === 1537) {
                mappedKeyCode = 0xE1;
                modifiers.value |= 0x02;
            } else if (modifiers.value === 1538) {
                mappedKeyCode = 0xE0;
                modifiers.value |= 1538
            } else if (modifiers.value === 1540) {
                mappedKeyCode = 0xE2;
                modifiers.value |= 0x04;
            }
        } else {
            if (modifiers.value != 0) {
                if (isConnected && enabled.value) write(keyData)
                modifiers.value = 0
            }

            let newModifiers = modifiers.value

            if (event.shiftKey || controlKeys.value.shiftLeft) newModifiers |= 0x02;
            if (event.ctrlKey || controlKeys.value.ctrlLeft) newModifiers |= 0x01;
            if (event.altKey || controlKeys.value.altLeft) newModifiers |= 0x04;
            if (event.metaKey || controlKeys.value.windowsLeft) newModifiers |= 0x08;

            if (pressed) {
                combinedModifiers = modifiers.value |= newModifiers
            } else {
                combinedModifiers = modifiers.value &= ~combinedModifiers
            }

        }

        if (mappedKeyCode != 0) {
            keyData[5] = pressed ? combinedModifiers : 0;
            keyData[7] = pressed ? mappedKeyCode : 0;
            if (isConnected && enabled.value) write(keyData)
        }
    }

    return {
        enabled,
        toggles,
        modifiers,
        controlKeys,
        handleEvent
    }
}