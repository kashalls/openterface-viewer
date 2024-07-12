export const useViewerKeyboard = () => {
    const enabled = ref(false)
    const toggles = ref<Array<number>>([])
    const currentModifiers = useState<number>('modifiers')

    const { isConnected, write } = useSerial()

    const handleEvent = (event: KeyboardEvent, pressed: boolean): void => {
        event.preventDefault()

        const keyData = new Uint8Array(13)
        keyData.set(KEYBOARD_ACTION_PREFIX, 0)

        let combinedModifiers = 0
        let mappedKeyCode = WINDOWS_KEYMAP[event.code]

        if (WINDOWS_SHIFT_KEYS.includes(event.code) || WINDOWS_CTRL_KEYS.includes(event.code) || WINDOWS_ALT_KEYS.includes(event.code)) {
            if (currentModifiers.value === 1537) {
                mappedKeyCode = 0xE1;
                currentModifiers.value |= 0x02;
            } else if (currentModifiers.value === 1538) {
                mappedKeyCode = 0xE0;
                currentModifiers.value |= 1538
            } else if (currentModifiers.value === 1540) {
                mappedKeyCode = 0xE2;
                currentModifiers.value |= 0x04;
            }
        } else {
            if (currentModifiers.value != 0) {
                if (isConnected && enabled.value) write(keyData)
                currentModifiers.value = 0
            }

            let newModifiers = currentModifiers.value

            if (event.shiftKey) newModifiers |= 0x02;
            if (event.ctrlKey) newModifiers |= 0x01;
            if (event.altKey) newModifiers |= 0x04;
            if (event.metaKey) newModifiers |= 0x08;

            if (pressed) {
                combinedModifiers = currentModifiers.value |= newModifiers
            } else {
                combinedModifiers = currentModifiers.value &= ~combinedModifiers
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
        modifiers: currentModifiers,
        handleEvent
    }
}