<script setup lang="ts">
import type { UseMouseEventExtractor } from '@vueuse/core'
import { cn } from './lib/utils';

const { supported } = useBrowserSupport()

const mouseEnabled = ref(false)
const keyboardEnabled = ref(false)

const serial = ref<SerialPort>()
const writer = ref<WritableStreamDefaultWriter>()
const reader = ref<ReadableStreamDefaultReader>()
const camera = ref()
const relativeMouse = ref(false)
const resolution = ref('')

const keyboardModifiers = ref<number>(0)

const mouse = reactive(useMouse({
  target: camera,
  type: ((event) => {
    return event instanceof TouchEvent || event instanceof Touch ? null : [event.offsetX, event.offsetY]
  })
}))
const lastMousePressState = ref(0)
const { pressed } = useMousePressed({ target: camera })

watch(pressed, (isPressed) => {
  if (!isPressed) lastMousePressState.value = 0
})

watch(mouse, () => handleMouse(), { deep: true })

onMounted(async () => {
  window.addEventListener('keyup', (event) => keypress(event, false))
  window.addEventListener('keydown', (event) => keypress(event, true))
  await refreshMediaDevices()
})

onUnmounted(async () => {
  writer.value?.close()
  reader.value?.releaseLock()
})

async function refreshMediaDevices() {
  if (camera.value?.srcObject) {
    camera.value.srcObject.getTracks()
      .forEach((track: MediaStreamTrack) => track.stop())
  }

  const stream = await navigator.mediaDevices.getUserMedia({ video: CAMERA_HIGH_RES })
  camera.value.srcObject = stream

  const videoTrack = stream.getVideoTracks()[0]
  const settings = videoTrack.getSettings()

  resolution.value = `${settings.width}x${settings.height} @ ${settings.frameRate}fps (AR: ${settings.aspectRatio?.toFixed(3)})`
}

async function refreshSerialDevices(force: boolean) {
  mouseEnabled.value = false
  keyboardEnabled.value = false
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

      mouseEnabled.value = true
      keyboardEnabled.value = true
    } else {
      console.log('Todo: Writer is already bound?')
    }
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
  lastMousePressState.value = MOUSE_BUTTON_MAP[button] ?? 0
  handleMouse(lastMousePressState.value)
}

function handleMouse(button: number = pressed.value ? lastMousePressState.value : 0) {
  const relativeX = (mouse.x / camera.value.clientWidth) * 4096
  const relativeY = (mouse.y / camera.value.clientHeight) * 4096

  const data = new Uint8Array(12)
  data.set(MOUSE_ABS_ACTION_PREFIX, 0)
  data.set([button], MOUSE_ABS_ACTION_PREFIX.length)
  data.set([relativeX & 0xFF, (relativeX >> 8) & 0xFF], MOUSE_ABS_ACTION_PREFIX.length + 1)
  data.set([relativeY & 0xFF, (relativeY >> 8) & 0xFF], MOUSE_ABS_ACTION_PREFIX.length + 3)
  data.set([0 & 0xFF], MOUSE_ABS_ACTION_PREFIX.length + 5)

  if (serial.value?.writable && writer && mouseEnabled.value) {
    writer.value?.write(checksum(data))
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
          <Unsupported />
          <HoverCard>
            <HoverCardTrigger as-child>
              <Button variant="secondary" @click="refreshMediaDevices">
                {{ camera ? 'Refresh' : 'Request' }} Media Device
              </Button>
            </HoverCardTrigger>
            <HoverCardContent class="w-80 text-sm ">
              <p class="pb-2">{{ camera ? 'Disconnect & Reconnect' : 'Connects' }} to the Openterface KVM Camera.</p>
              <p>Helpful if the display is not at the correct resolution or if there are artifacts appearing on-screen.
              </p>
            </HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger as-child>
              <Button variant="secondary" @click="refreshSerialDevices(Boolean(serial))">
                {{ serial ? 'Refresh' : 'Connect' }} Serial Device
              </Button>
            </HoverCardTrigger>
            <HoverCardContent class="w-80 text-sm ">
              <p class="pb-2">Chrome will not let me automatically request the serial port without a user-interaction.
              </p>
              <p>This button is required to enable serial writing to the KVM.</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
    <div class="container flex h-full flex-col space-y-4">
      <AspectRatio :ratio="16 / 9" class="bg-muted" @keydown.prevent="keypress">
        <video ref="camera" class="flex-1" autoplay playsinline @click.left.prevent="click"
          @click.middle.prevent="click" @click.right.prevent="click" />
      </AspectRatio>
    </div>
    <div class="container flex justify-between py-4">
      <div class="flex flex-grow-0 gap-2">
        <Badge :class="cn(
          'text-white',
          mouseEnabled ? 'bg-green-700 hover:bg-green-600' : 'bg-red-700 hover:bg-red-600'
        )" @click="mouseEnabled = !mouseEnabled">
          <Icon name="radix-icons:cursor-arrow" />
        </Badge>
        <Badge :class="cn(
          'text-white',
          keyboardEnabled ? 'bg-green-700 hover:bg-green-600' : 'bg-red-700 hover:bg-red-600'
        )" @click="keyboardEnabled = !keyboardEnabled">
          <Icon name="radix-icons:keyboard" />
        </Badge>
      </div>
      <div class="justify-end">
        <Button as-child variant="ghost">
          <NuxtLink external to="https://github.com/kashalls/openterface-viewer">
            <Icon name="radix-icons:github-logo" class="w-4 h-4" />
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>
