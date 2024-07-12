// Serial Speed
export const SERIAL_DEFAULT_BAUDRATE = 115200
export const SERIAL_ORIGINAL_BAUDRATE = 9600

// Mouse Action Prefixes
export const MOUSE_ABS_ACTION_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x04, 0x07, 0x02]);
export const MOUSE_REL_ACTION_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x05, 0x05, 0x01]);

// Keyboard Action Prefix
export const KEYBOARD_ACTION_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x02, 0x08])

// Serial commands
export const SERIAL_CMD_GET_PARA_CFG = new Uint8Array([0x57, 0xAB, 0x00, 0x08, 0x00]);
export const SERIAL_CMD_RESET = new Uint8Array([0x57, 0xAB, 0x00, 0x0F, 0x00]);
export const SERIAL_CMD_SET_PARA_CFG_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x09, 0x32, 0x82, 0x80, 0x00, 0x00,0x01, 0xC2, 0x00])
export const SERIAL_CMD_SET_PARA_CFG_MID = new Uint8Array([0x08, 0x00, 0x00, 0x03, 0x86, 0x1A, 0x29, 0xE1, 0x00, 0x00, 0x00, 0x01, 0x00, 0x0d, 0x00,0x00, 0x00, 0x00, 0x00, 0x00, ...new Uint8Array(23)])

export const MOUSE_BUTTON_MAP: { [key: number]: number } = {
    0: 1, // Left Click
    2: 2, // Right Click
    1: 4 // Middle Click
}

export function calculateModulo256Checksum(serialData: Uint8Array): Uint8Array {
    let sum: number = 0;
    for (let i = 0; i < serialData.length; i++) {
        sum += serialData[i];
    }
    return new Uint8Array([...serialData, sum % 256])
}

export const SERIAL_COMMAND_MAP: { [key: string]: string } = {
    0x02: "KEYBOARD",
    0x04: "ABSMOUSE",
    0x05: "RELMOUSE",
    0x09: "CONFIG",
    0x0F: "RESET"
}