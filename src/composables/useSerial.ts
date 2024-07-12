export default function useSerial() {
  const port = ref<SerialPort>();
  const reader = ref<ReadableStreamDefaultReader>();
  const writer = ref<WritableStreamDefaultWriter>();
  const isConnected = ref(false);
  const isOpening = ref(false);

  const connect = async () => {
    if (isOpening.value || isConnected.value) return;

    isOpening.value = true;
    try {
      // Check if there's already a port available
      const ports = await navigator.serial.getPorts();
      if (ports.length > 0) {
        port.value = ports[0];
      } else {
        // Request a port and open a connection.
        port.value = await navigator.serial.requestPort({
          filters: [{ usbVendorId: 0x1A86 }]
        });
      }

      // Check if the port is already open
      if (!port.value.readable && !port.value.writable) {
        // Open the serial port.
        await port.value.open({ baudRate: SERIAL_DEFAULT_BAUDRATE });
      }

      isConnected.value = true;

      // Set up the reader.
      reader.value = port.value.readable.getReader();
      readLoop();

      // Set up the writer.
      writer.value = port.value.writable.getWriter();
    } catch (error) {
      console.error('Error connecting to serial device:', error);
      disconnect();
    } finally {
      isOpening.value = false;
    }
  };

  const readLoop = async () => {
    while (port.value?.readable) {
      try {
        const { value, done } = await reader.value!.read();
        if (done) {
          break;
        }
        console.log('[Serial] Received Data:', value);
      } catch (error) {
        console.error('Error reading data from serial device:', error);
      }
    }
  };

  const disconnect = async () => {
    if (reader.value) {
      reader.value.releaseLock();
      reader.value = undefined;
    }

    if (writer.value) {
      writer.value.releaseLock();
      writer.value = undefined;
    }

    if (port.value) {
      try {
        await port.value.close();
      } catch (error) {
        console.error('Error closing the port:', error);
      }
      port.value = undefined;
    }

    isConnected.value = false;
  };

  const write = async (data: Uint8Array): Promise<void> => {
    if (writer.value) {
      try {
        const type = SERIAL_COMMAND_MAP[data[3]] ?? 'Unknown'
        const checksumedData = calculateModulo256Checksum(data)
        console.debug(`[${type}] Writing ${checksumedData}`)
        await writer.value.write(checksumedData);
      } catch (error) {
        console.error('Error writing data to serial device:', error);
      }
    } else {
      console.error('Writer is not available.');
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    connect,
    disconnect,
    write,
    isConnected,
  };
}