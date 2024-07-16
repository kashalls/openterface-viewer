<script setup lang="ts">
useSeoMeta({
  title: 'Openterface Viewer',
  description: 'A webviewer for the open-source kvm openterface.',
  ogTitle: 'Openterface Viewer',
  ogDescription: 'A webviewer for the open-source kvm openterface.'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const { supported } = useBrowserSupport()

const viewer = ref(false)
const camera = ref()
const relativeMouse = ref(false)
const resolution = ref('')

const {
  enabled: keyboardEnabled,
  handleEvent: handleKeyboardEvent
} = useViewerKeyboard()
const {
  enabled: mouseEnabled,
  mouse,
  handleClick
} = useViewerMouse(camera)

const {
  isConnected,
  connect,
  disconnect
} = useSerial()

onMounted(async () => {
  window.addEventListener('keyup', (event) => handleKeyboardEvent(event, false))
  window.addEventListener('keydown', (event) => handleKeyboardEvent(event, true))
  await refreshMediaDevices()
})

async function refreshMediaDevices() {
  viewer.value = false
  if (camera.value?.srcObject) {
    camera.value.srcObject.getTracks()
      .forEach((track: MediaStreamTrack) => track.stop())
  }

  await navigator.mediaDevices.getUserMedia({ video: CAMERA_HIGH_RES })
    .catch((err) => console.error(err))
    .then((stream) => {
      if (!stream) return;

      viewer.value = true
      camera.value.srcObject = stream

      const videoTrack = stream.getVideoTracks()[0]
      const settings = videoTrack.getSettings()

      resolution.value = `${settings.width}x${settings.height} @ ${settings.frameRate}fps`
    })
}
</script>

<template>
  <div class="h-full flex-col md:flex container md:max-w-screen-2xl">
    <div
      class="flex flex-row items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
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
          <Unsupported v-if="!supported" />
          <div>
            <HoverCard>
              <HoverCardTrigger as-child>
                <Button variant="secondary" @click="refreshMediaDevices">
                  {{ viewer ? 'Refresh' : 'Request' }} Video
                </Button>
              </HoverCardTrigger>
              <HoverCardContent class="w-80 text-sm ">
                <p class="pb-2">{{ camera ? 'Disconnect & Reconnect' : 'Connects' }} to the Openterface KVM Camera.</p>
                <p>Helpful if the display is not at the correct resolution or if there are artifacts appearing
                  on-screen.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div>
            <HoverCard>
              <HoverCardTrigger as-child>
                <Button variant="secondary" v-if="isConnected" @click="disconnect">
                  Disconnect Serial
                </Button>
                <Button variant="secondary" v-else @click="connect">
                  Connect Serial
                </Button>
              </HoverCardTrigger>
              <HoverCardContent class="w-80 text-sm ">
                <p class="pb-2">Chrome will not let me automatically request the serial port without a user-interaction.
                </p>
                <p>This button is required to enable serial writing to the KVM.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
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
          <InputToggles />
        </div>
      </div>
    </div>
    <div class="flex h-full flex-col space-y-4">
      <AspectRatio :ratio="16 / 9" class="bg-muted rounded content-center">
        <WelcomeArt v-if="!viewer" />
        <video v-else ref="camera" class="flex-1" autoplay playsinline @click.left.prevent="handleClick"
          @click.middle.prevent="handleClick" @click.right.prevent="handleClick">
          <WelcomeArt />
        </video>

      </AspectRatio>
    </div>
    <div class="flex justify-between py-4">
      <div class="justify-start text-center flex flex-row gap-3 *:text-sm">
        <p>Openterface Viewer made with Nuxt 3 by <a href="https://jordanjones.org" class="text-primary">Jordan
            Jones</a>.</p>
        <p>Artwork provided by <Badge class="bg-[#e75c24] hover:bg-[#bd3a26] transition-all text-white">Openterface
          </Badge>
        </p>
      </div>
      <div class="justify-end">
        <div class="flex flex-grow-0 gap-2">
          <Button as-child variant="ghost">
            <NuxtLink external to="https://github.com/kashalls/openterface-viewer">
              <Icon name="radix-icons:github-logo" class="w-4 h-4" />
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
