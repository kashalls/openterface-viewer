const UsbFilterId = { filters: [{ usbVendorId: 0x1A86 }]}

export const useSerial = () => {
  let serial: SerialPort | null = null;

  const open = async (): Promise<void> => {
    if (!('serial' in navigator)) {
      throw new Error('This browser does not currently support the Serial API.')
    }

    if (serial) {
      console.log('Serial port is already open.')
      return;
    }
    
    try {
      serial = await navigator.serial.requestPort(UsbFilterId)
    }
  }
}
