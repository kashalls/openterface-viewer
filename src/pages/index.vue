<script setup lang="ts">
import { ModalsSettings, ModalsUnsupportedBrowser } from '#components';

const viewer = ref(false)
const camera = ref()
const relativeMouse = ref(false)
const resolution = ref('')

const modal = useModal()

const {
    handleEvent: handleKeyboardEvent
} = useViewerKeyboard()
const {
    mouse,
    handleClick
} = useViewerMouse(camera)

const {
    isConnected,
    connect,
    disconnect
} = useSerial()

const { supported } = useBrowserSupport()
onMounted(async () => {
    if (!supported) modal.open(ModalsUnsupportedBrowser)
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

    const stream = await navigator.mediaDevices.getUserMedia({ video: CAMERA_HIGH_RES })
        .catch((err) => console.error(err))

    if (!stream) return;

    viewer.value = true
    camera.value.srcObject = stream

    const videoTrack = stream.getVideoTracks()[0]
    const settings = videoTrack.getSettings()

    resolution.value = `${settings.width}x${settings.height} @ ${settings.frameRate}fps`
}
</script>

<template>
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-[96rem] transition-all">
        <div
            class="flex flex-row items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
            <div class="flex flex-row mr-auto w-full gap-2">
                <h2 class="text-lg font-semibold">
                    Openterface Viewer
                </h2>
            </div>
            <div class="flex flex-row w-full justify-center gap-1">
                <UBadge variant="soft" v-if="resolution">{{ resolution }}</UBadge>
                <UBadge variant="soft">X: {{ mouse.x }}, Y: {{ mouse.y }}</UBadge>
                <UBadge :class="cn(
                    relativeMouse ? 'bg-green-500' : 'bg-red-500'
                )">
                    Relative Mouse
                </UBadge>

            </div>
            <div class="ml-auto flex w-full space-x-2 sm:justify-end">
                <div class="hidden space-x-2 md:flex">
                    <UButton variant="soft" color="red" class="animate-pulse" v-if="!supported"
                        @click="modal.open(ModalsUnsupportedBrowser)">
                        <span class="sr-only">Unsupported Browser</span>
                        <Icon name="radix-icons:exclamation-triangle" class="h-4 w-4" />
                    </UButton>
                    <UTooltip>
                        <UButton variant="outline" @click="refreshMediaDevices">
                            {{ viewer ? 'Refresh' : 'Request' }} Video
                        </UButton>
                        <template #text>
                            <p class="pb-2">{{ camera ? 'Disconnect & Reconnect' : 'Connects' }} to the Openterface KVM
                                Camera.</p>
                            <p>Helpful if the display is not at the correct resolution or if there are artifacts
                                appearing
                                on-screen.
                            </p>
                        </template>
                    </UTooltip>
                    <UTooltip>
                        <UButton variant="outline" v-if="isConnected" @click="disconnect">
                            Disconnect Serial
                        </UButton>
                        <UButton variant="outline" v-else @click="connect">
                            Connect Serial
                        </UButton>
                        <template #text>
                            <p class="pb-2">Chrome will not let me automatically request the serial port without a
                                user-interaction.
                            </p>
                            <p>This button is required to enable serial writing to the KVM.</p>
                        </template>
                    </UTooltip>
                    <InputToggles />
                </div>
            </div>
        </div>
        <div class="flex h-full flex-col space-y-4 bg-black rounded-lg">
            <WelcomeArt v-if="!viewer" />
            <video v-else ref="camera" class="flex-1" autoplay playsinline @click.left.prevent="handleClick"
                @click.middle.prevent="handleClick" @click.right.prevent="handleClick" />
        </div>
        <div class="flex justify-between py-4">
            <div class="justify-start flex flex-row gap-3">
                <Test />
                <UDivider orientation="vertical" />
                <SpecialKeySelector />
            </div>
            <div class="justify-end">
                <div class="flex flex-grow-0 gap-2">
                    <UButton icon="i-ph-gear-duotone" variant="ghost" label="Settings"
                        @click="modal.open(ModalsSettings)" />
                    <ColorMode />
                    <UButton icon="i-ph-github-logo-duotone" variant="ghost"
                        to="https://github.com/kashalls/openterface-viewer" />
                </div>
            </div>
        </div>
        <UModals />
        <UNotifications />
    </div>
</template>
