<script setup lang="ts">
import type { UseMouseEventExtractor } from '@vueuse/core'
import { cn } from './lib/utils';
const MOUSE_ABS_ACTION_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x04, 0x07, 0x02]);
const MOUSE_REL_ACTION_PREFIX = new Uint8Array([0x57, 0xAB, 0x00, 0x05, 0x05, 0x01]);
const CMD_GET_PARA_CFG = new Uint8Array([0x57, 0xAB, 0x00, 0x08, 0x00]);
// const CMD_RESET = new Uint8Array([0x57, 0xAB, 0x00, 0x0F, 0x00]);
const supported = computed(() => {
  return "serial" in navigator && "mediaDevices" in navigator
})

const webcamConstraints = { audio: true, video: true }

const serial = ref<SerialPort>()
const writer = ref()
const camera = ref()
const extractor: UseMouseEventExtractor = (event) => (event instanceof Touch ? null : [event.offsetX, event.offsetY])
const mouse = reactive(useMouse({ target: camera, type: extractor }))
const lastMousePressState = ref(0)
const { pressed } = useMousePressed({ target: camera })

watch(mouse, ({ x, y }) => {

  let data = new Uint8Array(8)
  data.set(MOUSE_ABS_ACTION_PREFIX, 0)
  data[6] = pressed.value ? lastMousePressState.value : 0
  data[1] = x & 0xFF; // Set x low byte at index 1
  data[2] = (x >> 8) & 0xFF; // Set x high byte at index 2
  data[3] = y & 0xFF; // Set y low byte at index 3
  data[4] = (y >> 8) & 0xFF; // Set y high byte at index 4
  data[5] = 0 & 0xFF
  data[7] = calculateModulo256Checksum(data.slice(0, 7))
  // console.log(data, data.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''), `Checksum: ${data[7]}`)

  if (serial.value?.writable && writer) {
    const hex = data.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
    console.log(hex)
    writer.value.write(hex)
  }
}, { deep: true })

const relativeMouse = ref(false)
const resolution = ref('')

const highResolution = { width: 1920, height: 1080 };
const resolutions = [
  { width: 1920, height: 1080, label: '1920x1080' },
  { width: 1280, height: 720, label: '1280x720' },
  { width: 640, height: 480, label: '640x480' },
  { width: 320, height: 240, label: '320x240' }
];

onMounted(async () => {
  await refreshMediaDevices()
})

async function refreshMediaDevices(constraints = Object.assign(webcamConstraints, { video: highResolution })) {
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
    if (!writer.value) {
      await serial.value.open({ baudRate: SERIAL_DEFAULT_BAUDRATE })
    }
    console.log(serial.value.getInfo())
    writer.value = serial.value.writable.getWriter()
  } catch (err) {
    console.log(err)
  }
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
        <Badge variant="default" :class="cn(
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
    <Separator />
    <div class="container flex h-full flex-col space-y-4" @keydown.prevent="keypress">
      <video ref="camera" class="flex-1" autoplay playsinline @click.left.prevent="click" @click.middle.prevent="click"
        @click.right.prevent="click" />
    </div>
  </div>
</template>
