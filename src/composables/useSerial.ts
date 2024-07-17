export enum SerialState {
  Disconnected,
  Opening,
  Closing,
  Connected
}
export const port = ref<SerialPort>();
export const writer = ref<WritableStreamDefaultWriter>()
export const reader = ref<ReadableStreamDefaultReader>()

export default function useSerial() {
  const toast = useToast()
  const state = useState<SerialState>('serial', () => SerialState.Disconnected)
  const lockStatus = useState('serial-lockstatus', () => ({
    num: false,
    caps: false,
    scroll: false
  }))


  const connect = async () => {
    if (state.value !== SerialState.Disconnected) return;

    state.value = SerialState.Opening
    try {
      // Check if there's already a port available
      const ports = await navigator.serial.getPorts();
      if (ports.length > 0) {
        console.debug('[Serial][Connect] Reusing serial permissions...')
        port.value = ports[0];
      } else {
        // Request a port and open a connection.
        console.debug('[Serial][Connect] Requesting serial permissions...')
        port.value = await navigator.serial.requestPort({
          filters: [{ usbVendorId: 0x1A86 }]
        });
      }

      console.log(port.value)

      // Check if the port is already open
      if (!port.value.readable && !port.value.writable) {

        console.debug('[Serial][Connect] Attempting to open serial port...')
        // Open the serial port.
        await port.value.open({ baudRate: SERIAL_DEFAULT_BAUDRATE });
        const signals = await port.value.getSignals()

        console.debug('[Serial][Connect] Serialport was opened...')
        console.debug(signals)
      }

      state.value = SerialState.Connected

      // Set up the reader.
      console.debug('[Serial][Connect] Attempting to get a reader...')
      reader.value = port.value?.readable.getReader();
      console.log(reader.value)
      readLoop();

      // Set up the writer.
      console.debug('[Serial][Connect] Attempting to get a writer...')
      const writeStream = port.value.writable.getWriter();
      await writeStream.ready
      writer.value = writeStream
      console.log(writer.value)

      write(new Uint8Array([...SERIAL_HEADER, SERIAL_COMMANDS.GetInfo, 0x00]))
    } catch (error) {
      console.error('Error connecting to serial device:', error);
      disconnect();
    }
  };

  const readLoop = async () => {
    console.debug('Starting read cycle')
    while (reader.value && state.value === SerialState.Connected) {
      try {
        const { value, done } = await reader.value.read();
        console.log('[Serial][ReadLoop] Completed Read.')
        if (done) {
          console.log('[Serial][ReadLoop] Done reading...')
          break;
        }
        console.log(`[Serial][ReadLoop] ${decimalArrayToHexString(value)} - ${value.length}`)
        handleIncomingData(value)
      } catch (error) {
        console.error('Error reading data from serial device:', error);
      }
    }
  };

  const disconnect = async () => {
    state.value = SerialState.Closing

    try {
      if (reader.value) {
        reader.value.releaseLock()
        await reader.value?.cancel()
        reader.value = undefined;
      }

      if (writer.value) {
        await writer.value.releaseLock();
        writer.value = undefined;
      }

      if (port.value) {
        try {
          await port.value.close();
        } catch (error) {
          console.error('[Serial][Disconnect] Error closing the port:', error);
        }
        port.value = undefined;
      }
    } catch (error) {
      console.log(`[Serial][Disconnect] Error while trying to disconnect: ${error}`)
    } finally {
      state.value = SerialState.Disconnected
    }
  };

  const write = async (data: Uint8Array): Promise<void> => {
    if (writer.value) {
      try {
        const type = SERIAL_COMMAND_MAP[data[3]] ?? 'Unknown'
        const checksumedData = new Uint8Array([...data, calculateModulo256Checksum(data)])
        console.debug(`[${type}] Writing ${decimalArrayToHexString(checksumedData)}`)
        await writer.value.write(checksumedData);
      } catch (error) {
        console.error('[Serial][Write] Error writing data to serial device:', error);
      }
    } else {
      console.error('[Serial][Write] Writer is not available.');
    }
  };

  const handleIncomingData = (data: Uint8Array): void => {
    const originalData = data.subarray(0, data.length - 1)
    const checkSum = data[data.length]
    if (calculateModulo256Checksum(originalData) !== checkSum) {
      console.error(`[Serial][Incoming] Discarding Invalid Data: ${decimalArrayToHexString(data)}`)
      toast.add({
        title: 'Invalid Data Recieved',
        description: 'Viewer has recieved some invalid data from Openterface. You may need to connect your device to an official viewer to correct this.',
        icon: 'i-ph-cherries-duotone',
        color: 'red'
      })
      return;
    }
    // Checking to see if we are getting the RecieveInfo
    if (data[3] === SERIAL_COMMANDS.RecieveInfo) {
      const version = `${data[5].toString(16).split('')[1]}`
      const connected = Boolean(data[6])
      const lockStatuses = data[7].toString(2).padStart(3, '0')
      lockStatus.value = { num: lockStatuses[2] === '1', caps: lockStatuses[1] === '1', scroll: lockStatuses[0] === '1' }
      console.log(`Connected to Openterface. CH9329 v1.${version}`)
      console.log(`NumLock: ${lockStatuses[2] === '1'} | CapsLock: ${lockStatuses[1] === '1'} | ScrollLock: ${lockStatuses[0] === '1'}`)
    }
  }

  onBeforeUnmount(async () => {
    await disconnect();
  });

  const isConnected = computed(() => {
    return state.value === SerialState.Connected
  })

  return {
    connect,
    disconnect,
    write,
    lockStatus,
    isConnected
  };
}