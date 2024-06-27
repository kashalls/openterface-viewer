export function calculateModulo256Checksum(data: Uint8Array): number {
    let sum: number = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
    }
    return sum % 256;
}

export const SERIAL_DEFAULT_BAUDRATE = 115200
export const SERIAL_ORIGINA_BAUDRATE = 9600