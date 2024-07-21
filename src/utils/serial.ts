// Mouse Action Prefixes
export const MOUSE_ABS_ACTION_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x04, 0x07, 0x02]);
export const MOUSE_REL_ACTION_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x05, 0x05, 0x01]);

// Keyboard Action Prefix
export const KEYBOARD_ACTION_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x02, 0x08])

export class Serial {
    static readonly FRAME_HEAD = new Uint8Array([0x57, 0xAB]);
    static readonly DEFAULT_ADDR = 0x00;

    static readonly FACTORY_BAUDRATE = 9600;
    static readonly OPENTERFACE_BAUDRATE = 115200;

    static readonly COMMANDS = {
        CMD_GET_INFO: 0x01,
        CMD_SEND_KB_GENERAL_DATA: 0x02,
        CMD_SEND_KB_MEDIA_DATA: 0x03,
        CMD_SEND_MS_ABS_DATA: 0x04,
        CMD_SEND_MS_REL_DATA: 0x05,
        CMD_SEND_MY_HID_DATA: 0x06,
        CMD_READ_MY_HID_DATA: 0x87,
        CMD_GET_PARA_CFG: 0x08,
        CMD_SET_PARA_CFG: 0x09,
        CMD_GET_USB_STRING: 0x0A,
        CMD_SET_USB_STRING: 0x0B,
        CMD_SET_DEFAULT_CFG: 0x0C,
        CMD_RESET: 0x0F,
    }

    static readonly CMD_LENGTH = {
        CMD_GET_INFO: 0x00,
        CMD_SEND_KB_GENERAL_DATA: 0x08,
        CMD_SEND_KB_MEDIA_DATA: 0x02,
        CMD_SEND_MS_ABS_DATA: 0x07,
        CMD_SEND_MS_REL_DATA: 0x05,
        CMD_SEND_MY_HID_DATA: null,
        CMD_READ_MY_HID_DATA: null,
        CMD_GET_PARA_CFG: 0x00,
        CMD_SET_PARA_CFG: 0x50,
        CMD_GET_USB_STRING: 0x01
    }

    static readonly ERROR_RESPONSE = {
        0x00: 'Command was completed successfully.',
        0xE1: 'Serial port recieves a byte timeout.',
        0xE2: 'Error in recieving the packet header byte.',
        0xE3: 'Error in recieving the command code.',
        0xE4: 'Checksum mismatch.',
        0xE5: 'Parameter error.',
        0xE6: 'Frame normal, execution failed.'
    }

    /**
     * Useful for mapping the browser's MouseEvent to CH9329 mouse events
     * 
     * Browser:
     *  0 - Left Click
     *  1 - Middle Button
     *  2 - Right Button
     * 
     * CH9329:
     *  1 - Left Click
     *  4 - Right Click
     *  2 - Middle Button
     */
    static readonly MOUSE_BUTTON_MAP: { [key: number]: number } = {
        0: 1,
        2: 2,
        1: 4,
    }

    /**
     * Returns a single byte that represents the sum of all bytes in an Uint8Array.
     * 
     * @remarks
     * Modulo 256 Checksum?
     * 
     * @param data - The data sent/recieved.
     * @returns The sum of all bytes of data as a single byte.
     */
    static checksum(data: Uint8Array): number {
        let sum: number = 0;
        for (const byte of data) sum += byte;
        return sum & 0xFF;
    }

    /**
     * Converts Uint8Array into string
     * 
     * @param data The data sent/recieved.
     * @returns String of hex bytes.
     */
    static stringify(data: Uint8Array) {
        return Array.from(data).map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
    }

    /**
     * Checks to see if the command we are sending/recieving is valid.
     * 
     * @param data The data sent/recieved.
     * @returns { valid }
     */
    static isError(data: Uint8Array): boolean {
        // Does the data in the packet match the checksum?
        const commandPacket = data.subarray(0, data.length - 1);
        const sumByte = data[data.length]
        const valid = this.checksum(commandPacket) !== sumByte
        if (!valid) return true; 

        // Unfinished and untested code.
        const commandCode = data[3]
        // Is the command code referring to a Error Response Packet?
        if (commandCode >= 0xC0) return true
        if (commandCode >= 0x80) {
            // This should return the original code.
            const originalCode = commandCode - 0x80
            // const packet = Object.keys(this.COMMANDS).find((key) => this.COMMANDS[key] === originalCode)
        }
        return false
    }
}
