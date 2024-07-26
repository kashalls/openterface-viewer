/// <reference types="w3c-web-serial" />

export enum SerialState {
  Disconnected,
  Opening,
  Closing,
  Connected
}
export const port = ref<SerialPort>();
export const writer = ref<WritableStreamDefaultWriter | null>()
export const reader = ref<ReadableStream | null>()

export default function useSerial() {
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

      // Check if the port is already open
      if (!port.value.readable && !port.value.writable) {
        console.debug('[Serial][Connect] Attempting to open serial port...')
        // Open the serial port.
        await port.value.open({ baudRate: SerialHelper.OPENTERFACE_BAUDRATE });
      }

      state.value = SerialState.Connected

      // Set up the reader.
      reader.value = port.value.readable
      reader.value?.pipeTo(readStream);
      // readLoop();

      // Set up the writer.
      const writeStream = port.value.writable?.getWriter();
      await writeStream?.ready
      writer.value = writeStream

      write(new Uint8Array([...SerialHelper.FRAME_HEAD, SerialHelper.DEFAULT_ADDR, SerialHelper.COMMANDS.CMD_GET_INFO, 0x00]))
    } catch (error) {
      console.error('Error connecting to serial device:', error);
      disconnect();
    }
  };

  let readBuffer = new Uint8Array()
  const readStream = new WritableStream({
    write(chunk: Uint8Array) {
      const checkSum = chunk[chunk.length - 1]
      const originalData = chunk.subarray(0, chunk.length - 1)
      if (SerialHelper.checksum(originalData) === checkSum) return handleIncomingData(chunk)

      // This chunk is invalid, combine with the other chunks.

      // Discard the packet if the readBuffer is empty and this chunk doesn't start a packet.
      // We don't know where this data belongs soooo. ¯\_(ツ)_/¯
      if (readBuffer.length === 0) {
        const headerIndex = chunk.findIndex((byte, index) => {
          return byte === 0x57 && chunk[index + 1] === 0xAB
        })
        // This chunk data does not contain any header data and the buffer is empty, discard.
        if (headerIndex === -1) return
      }

      // Combine the buffers
      readBuffer = new Uint8Array([...readBuffer, ...chunk])

      // Check how many sutiable packets we might have so we know how many times we need to loop through.
      const potentialPackets = readBuffer.filter((byte, index) => {
        return byte === 0x57 && readBuffer[index + 1] === 0xAB
      })

      // Loop through the packets searching for the first packet. There is a chance that our first header is actual data so we skip to the next iteration.
      for (let i = 0; i < potentialPackets.length; i++) {
        const headerIndex = readBuffer.indexOf(0x57)

        // Index not found, yet potential is more than 1?
        if (headerIndex === -1) continue;
        // Next byte is not available? 
        if (!(readBuffer[headerIndex + 1])) continue;

        // If the buffer is undefined at this location
        const dataLength: number = readBuffer[headerIndex + 4];
        if (!dataLength) continue;

        const endOfData: number = (headerIndex + 4) + (dataLength + 1) + 1
        const data: Uint8Array = readBuffer.subarray(headerIndex, endOfData)
        const dataCheckSum: number = data[data.length - 1]
        const dataOriginalData: Uint8Array = data.subarray(0, data.length - 1)

        if (SerialHelper.checksum(dataOriginalData) === dataCheckSum) {
          readBuffer = readBuffer.slice(headerIndex, endOfData)
          handleIncomingData(data)
        }
      }
    }
  })

  const disconnect = async () => {
    state.value = SerialState.Closing

    try {
      if (reader.value) {
        await reader.value.cancel()
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
        const checksumedData = new Uint8Array([...data, SerialHelper.checksum(data)])
        console.debug(`[Serial] Writing ${SerialHelper.stringify(checksumedData)}`)
        await writer.value.write(checksumedData);
      } catch (error) {
        console.error('[Serial][Write] Error writing data to serial device:', error);
      }
    } else {
      console.error('[Serial][Write] Writer is not available.');
    }
  };

  const handleIncomingData = (data: Uint8Array): void => {
    const checkSum = data[data.length - 1]
    const originalData = data.subarray(0, data.length - 1)
    if (SerialHelper.checksum(originalData) !== checkSum) {
      console.error(`[Serial][Incoming] Discarding Invalid Data: ${SerialHelper.stringify(data)}`)
      return
    }
    // Checking to see if we are getting the RecieveInfo
    if (data[3] === (SerialHelper.COMMANDS.CMD_GET_INFO + 0x80)) {
      const version = `${data[5].toString(16).split('')[1]}`
      const connected = Boolean(data[6])
      const lockStatuses = data[7].toString(2).padStart(3, '0')
      lockStatus.value = { num: lockStatuses[2] === '1', caps: lockStatuses[1] === '1', scroll: lockStatuses[0] === '1' }
      console.log(`Connected to Openterface. CH9329 v1.${version}`)
      console.log(`NumLock: ${lockStatuses[2] === '1'} | CapsLock: ${lockStatuses[1] === '1'} | ScrollLock: ${lockStatuses[0] === '1'}`)
    }
  }

  const handleMediaKeys = (byte: number): void => {
    
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
    handleMediaKeys,
    lockStatus,
    isConnected
  };
}