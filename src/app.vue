<script setup lang="ts">
import type { UseMouseEventExtractor } from '@vueuse/core'
import { cn } from './lib/utils';

const supported = computed(() => {
  return "serial" in navigator && "mediaDevices" in navigator
})

const webcamConstraints = { audio: true, video: true }

const serial = ref<SerialPort>()
const writer = ref<WritableStreamDefaultWriter>()
const reader = ref<ReadableStreamDefaultReader>()
const camera = ref()
const extractor: UseMouseEventExtractor = (event) => (event instanceof Touch ? null : [event.offsetX, event.offsetY])
const mouse = reactive(useMouse({ target: camera, type: extractor }))
const lastMousePressState = ref(0)
const { pressed } = useMousePressed({ target: camera })

watch(mouse, ({ x, y }) => {

  let data = new Uint8Array(12)
  const LEN = MOUSE_ABS_ACTION_PREFIX.length // Uint is 0-index
  data.set(MOUSE_ABS_ACTION_PREFIX, 0) // 0 - 5
  data.set([pressed.value ? lastMousePressState.value : 0], LEN)
  data.set([x & 0xFF, (x >> 8) & 0xFF], LEN + 1)
  data.set([y & 0xFF, (y >> 8) & 0xFF], LEN + 3)
  data.set([0 & 0xFF], LEN + 5)

  if (serial.value?.writable && writer) {
    const newRes = checksum(data)
    const hex = newRes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
    console.log(`Writing ${hex}...`)
    writer.value?.write(newRes)
  }
}, { deep: true })

const relativeMouse = ref(false)
const resolution = ref('')

onMounted(async () => {
  await refreshMediaDevices()
})

onBeforeUnmount(async () => {
  writer.value?.close()
  reader.value?.releaseLock()
})

async function refreshMediaDevices(constraints = Object.assign(webcamConstraints, { video: CAMERA_HIGH_RES })) {
  if (camera.value?.srcObject) {
    camera.value.srcObject.getTracks()
      .forEach((track: MediaStreamTrack) => track.stop())
  }

  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  camera.value.srcObject = stream

  const videoTrack = stream.getVideoTracks()[0]
  const settings = videoTrack.getSettings()

  resolution.value = `${settings.width}x${settings.height} @ ${settings.frameRate}fps (AR: ${settings.aspectRatio?.toFixed(3)})`
}

async function refreshSerialDevices(force: boolean) {
  // Check to see if the user has previously authorized us to access a usb device.
  const pairedPorts = await navigator.serial.getPorts()
  if (pairedPorts.length === 1) {
    // The user has authorized us to use one, so lets use that.
    serial.value = pairedPorts[0]
  } else {
    // Either the user has requested to change ports, or there are more than one serial ports so we will not assume anything. Let user pick port.
    const device = await navigator.serial.requestPort({ filters: [{ usbVendorId: 0x1A86 }] })
    serial.value = device
  }

  if (!serial.value) {
    console.error('Listen man. I don\'t know why there isn\'t a serial device available here. I just write the code and hope that it works.\n¯\_(ツ)_/¯\n\nSerial device isn\'t available anymore.')
  }

  try {
    await serial.value.close()
  } catch (err) {
    // Do nothing with this error because we expect it to fail and we want to make sure it's closed before we try and open it.
  }

  try {
    if (!writer.value) {
      await serial.value.open({ baudRate: SERIAL_DEFAULT_BAUDRATE })
      writer.value = serial.value.writable.getWriter()
      writer.value.write(checksum(SERIAL_CMD_GET_PARA_CFG))

      while (writer.value.readable) {
        reader.value = serial.value.readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.value.read();
            if (done) {
              // |reader| has been canceled.
              break;
            }
            console.log(value)
          }
        } catch (error) {
          console.log(error)
        } finally {
          reader.value.releaseLock();
        }
      }

    }
    console.log(serial.value.getInfo())
    writer.value = serial.value.writable.getWriter()
  } catch (err) {
    console.log(err)
  }
}

function checksum(serialData: Uint8Array): Uint8Array {
  const checksum = calculateModulo256Checksum(serialData)
  return new Uint8Array([...serialData, checksum])
}

function keypress(data: KeyboardEvent) {
  console.log(data)
}

function click({ button }: MouseEvent): void {
  lastMousePressState.value = getMouseButton(button)
  console.log(getMouseButton(button))
}

function getMouseButton(button: number): number {
  if (button === 0) { // Left Click
    return 1 // Qt Left
  } else if (button === 2) {
    return 2 // Qt Right
  } else if (button === 1) {
    return 4 // Qt Middle
  } else {
    return 0
  }
}

</script>

<template>
  <div class="h-full flex-col md:flex container">
    <div
      class="container flex flex-row items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
      <h2 class="text-lg font-semibold flex mr-auto w-full">
        Openterface Viewer
      </h2>
      <div class="flex flex-row w-full justify-center gap-1">
        <Badge variant="outline">
          {{ resolution }}
        </Badge>
        <Badge variant="outline">
          X: {{ mouse.x }}
        </Badge>
        <Badge variant="outline">
          Y: {{ mouse.y }}
        </Badge>
        <Badge :variant="relativeMouse ? 'default' : 'destructive'" :class="cn(
          relativeMouse ? 'bg-green-500' : 'bg-red-500'
        )">
          Relative Mouse
        </Badge>
      </div>
      <div class="ml-auto flex w-full space-x-2 sm:justify-end">
        <div class="hidden space-x-2 md:flex">
          <Button variant="secondary" @click="refreshMediaDevices">
            <template v-if="!camera">
              Request Camera
            </template>
            <template v-else>
              Refresh Media Devices
            </template>
          </Button>
          <Button variant="secondary" @click="refreshSerialDevices(Boolean(serial))">
            <template v-if="!serial">
              Connect Serial
            </template>
            <template v-else>
              Refresh Serial Devices
            </template>
          </Button>
        </div>
      </div>
    </div>
    <div class="container flex h-full flex-col space-y-4" @keydown.prevent="keypress">
      <video ref="camera" class="flex-1" autoplay playsinline @click.left.prevent="click" @click.middle.prevent="click"
        @click.right.prevent="click" />
    </div>
  </div>
</template>
