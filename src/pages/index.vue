<script setup lang="ts">
import { ModalCopyPasteMenu, ModalSettings, ModalUnsupportedBrowser } from '#components';

const colorMode = useColorMode()
const modal = useModal()
const camera = ref()
const {
    handleEvent: handleKeyboardEvent
} = useViewerKeyboard()
const {
    mouse,
    handleClick
} = useViewerMouse(camera)


const { supported, commitSha } = useBrowserSupport()
onMounted(async () => {
    window.addEventListener('keyup', (event) => handleKeyboardEvent(event, false))
    window.addEventListener('keydown', (event) => handleKeyboardEvent(event, true))
})
</script>

<template>
    <div>
        <div
            class="flex flex-row items-center justify-between space-y-2 py-2 sm:flex-row sm:items-center sm:space-y-0 md:h-12">
            <div class="inline-flex flex-stretch-0 w-full gap-2 justify-start">
                <h2 class="text-md font-semibold justify-center self-center">
                    Openterface Viewer
                </h2>
                <UBadge variant="soft">{{ commitSha }}</UBadge>

            </div>
            <div class="flex flex-row w-full justify-center gap-1">

                <UBadge variant="soft">X: {{ mouse.x }}, Y: {{ mouse.y }}</UBadge>

            </div>
            <div class="ml-auto flex w-full space-x-2 sm:justify-end">
                <div class="space-x-2 flex">
                    <InputToggles />
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
            <div class="justify-end gap-x-1">
                <UButton variant="soft" color="red" icon="i-radix-icons-exclamation-triangle" class="animate-pulse"
                    v-if="!supported" @click="modal.open(ModalUnsupportedBrowser)" />
                <UButton icon="i-ph-gear-duotone" variant="ghost" label="Settings" @click="modal.open(ModalSettings)" />
                <UButton icon="i-ph-copy-simple-duotone" variant="ghost" @click="modal.open(ModalCopyPasteMenu)" disabled />
                <ColorMode />
                <UButton icon="i-ph-github-logo-duotone" variant="ghost"
                    to="https://github.com/kashalls/openterface-viewer" target="_blank" />
            </div>
        </div>
    </div>
</template>
