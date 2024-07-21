<script setup lang="ts">
import { ModalsSettings, ModalsUnsupportedBrowser } from '#components';

const viewer = ref(false)
const camera = ref()
const resolution = ref('')

const colorMode = useColorMode()
const modal = useModal()

const {
    enabled: keyboardEnabled,
    handleEvent: handleKeyboardEvent
} = useViewerKeyboard()
const {
    enabled: mouseEnabled,
    mouse,
    handleClick
} = useViewerMouse(camera)

useViewerMedia()

const {
    isConnected,
    connect,
    disconnect
} = useSerial()

const { supported } = useBrowserSupport()
onMounted(async () => {
    window.addEventListener('keyup', (event) => handleKeyboardEvent(event, false))
    window.addEventListener('keydown', (event) => handleKeyboardEvent(event, true))
    if (!supported) modal.open(ModalsUnsupportedBrowser)
})

watch(isConnected, (connected) => {
    if (connected && viewer.value) {
        keyboardEnabled.value = true
        mouseEnabled.value = true
    } else {
        keyboardEnabled.value = false
        mouseEnabled.value = false
    }
})

</script>

<template>
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-[96rem] transition-all">
        <div
            class="flex flex-row items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
            <div class="flex flex-row mr-auto w-full gap-2">
                <h2 class="text-lg font-semibold justify-center self-center">
                    Openterface Viewer
                </h2>
            </div>
            <div class="flex flex-row w-full justify-center gap-1">
                <UBadge variant="soft" v-if="resolution">{{ resolution }}</UBadge>
                <UBadge variant="soft">X: {{ mouse.x }}, Y: {{ mouse.y }}</UBadge>

            </div>
            <div class="ml-auto flex w-full space-x-2 sm:justify-end">
                <div class="hidden space-x-2 md:flex">
                    <UButton variant="soft" color="red" class="animate-pulse" v-if="!supported"
                        @click="modal.open(ModalsUnsupportedBrowser)">
                        <span class="sr-only">Unsupported Browser</span>
                        <Icon name="radix-icons:exclamation-triangle" class="h-4 w-4" />
                    </UButton>
                    <UTooltip>
                        <UButton variant="outline" v-if="isConnected" @click="disconnect" icon="i-tabler-plug-connected">
                            Disconnect Serial
                        </UButton>
                        <UButton variant="outline" v-else @click="connect" icon="i-tabler-plug">
                            Connect Serial
                        </UButton>
                        <template #text>
                            <p class="pb-2">Chrome will not let me automatically request the serial port without a
                                user-interaction.
                            </p>
                            <p>This button is required to enable serial writing to the KVM.</p>
                        </template>
                    </UTooltip>
                    <UButton icon="i-ph-gear-duotone" variant="ghost" disabled label="Settings"
                        @click="modal.open(ModalsSettings)" />
                    <ColorMode />
                    <UButton icon="i-ph-github-logo-duotone" variant="ghost"
                        to="https://github.com/kashalls/openterface-viewer" />
                </div>
            </div>
        </div>
        <div
            class="flex h-full flex-col bg-primary-600/70 dark:bg-black rounded-lg shadow-2xl border-primary-700 hover:border-primary-950 dark:border-primary-900 hover:dark:border-primary-500 border">
            <video ref="camera" class="flex-1" autoplay playsinline
                :poster="`/artwork/welcome-${colorMode.value === 'light' ? 'light' : 'dark'}-spaced.svg`"
                @click.left.prevent="handleClick" @click.middle.prevent="handleClick"
                @click.right.prevent="handleClick" />
        </div>
        <div class="flex flex-row justify-between pt-2 pb-1 h-11">
            <div class="flex flex-row gap-2 justify-start">
                <LatchButtons />
            </div>
            <div class="justify-end">
                <InputToggles />
            </div>
        </div>
    </div>
</template>
