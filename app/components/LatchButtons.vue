<script setup lang="ts">
const { controlKeys } = useViewerKeyboard()

const { write, isConnected } = useSerial()

const packet = new Uint8Array([...SerialHelper.FRAME_HEAD, SerialHelper.DEFAULT_ADDR, SerialHelper.COMMANDS.CMD_SEND_KB_MEDIA_DATA])
const noTone = new Uint8Array([0x02, 0x00, 0x00, 0x00])
async function handleMediaButton(byte: Array<number>) {
    if (!isConnected) return;
    await write(new Uint8Array([...packet, ...byte]))
    await write(new Uint8Array([...packet, ...noTone]))
}

</script>

<template>
    <div class="flex flex-row gap-3 *:shadow">
        <UFieldGroup size="md">
            <UTooltip text="Try Power Button">
                <UButton @click="handleMediaButton([0x02, 0x01, 0x01])" variant="outline" color="error" icon="i-tabler-power" />
            </UTooltip>

            <UTooltip text="Try Waking">
                <UButton @click="handleMediaButton([0x02, 0x01, 0x04])" variant="outline" color="error" icon="i-tabler-sun" />
            </UTooltip>

            <UTooltip text="Try Sleeping">
                <UButton @click="handleMediaButton([0x02, 0x01, 0x02])" variant="outline" color="error"
                    icon="i-tabler-moon-stars" />
            </UTooltip>
        </UFieldGroup>

        <UFieldGroup size="md">
            <UTooltip text="Toggle Shift Key">
                <UButton @click="controlKeys.shift = !controlKeys.shift"
                    :variant="controlKeys.shift ? 'solid' : 'outline'">SHIFT</UButton>
            </UTooltip>
            <UTooltip text="Toggle Ctrl Key">
                <UButton @click="controlKeys.ctrl = !controlKeys.ctrl"
                    :variant="controlKeys.ctrl ? 'solid' : 'outline'">CTRL</UButton>
            </UTooltip>
            <UTooltip text="Toggle Alt Key">
                <UButton @click="controlKeys.alt = !controlKeys.alt" :variant="controlKeys.alt ? 'solid' : 'outline'">
                    ALT</UButton>
            </UTooltip>
            <UTooltip text="Toggle Windows Key">
                <UButton @click="controlKeys.windows = !controlKeys.windows"
                    :variant="controlKeys.windows ? 'solid' : 'outline'" icon="i-tabler-brand-windows" />
            </UTooltip>
        </UFieldGroup>

        <UFieldGroup size="md">
            <UButton @click="handleMediaButton([0x04, 0x02, 0x20, 0x00, 0x00])" icon="i-tabler-chevrons-left"
                variant="outline" color="info" />
            <UButton @click="handleMediaButton([0x04, 0x02, 0x08, 0x00, 0x00])" icon="i-ph-play-pause-duotone"
                variant="outline" color="info" />
            <UButton @click="handleMediaButton([0x04, 0x02, 0x10, 0x00, 0x00])" icon="i-tabler-chevrons-right"
                variant="outline" color="info" />
        </UFieldGroup>

        <UFieldGroup size="md">
            <UButton @click="handleMediaButton([0x04, 0x02, 0x04, 0x00, 0x00])" icon="i-tabler-volume-3" variant="outline"
                color="info" />
            <UButton @click="handleMediaButton([0x04, 0x02, 0x02, 0x00, 0x00])" icon="i-tabler-volume-2" variant="outline"
                color="info" />
            <UButton @click="handleMediaButton([0x04, 0x02, 0x01, 0x00, 0x00])" icon="i-tabler-volume" variant="outline"
                color="info" />
        </UFieldGroup>

        <UPopover :popper="{ placement: 'top' }" disabled>
            <UButton color="success" disabled variant="outline" icon="i-tabler-function" trailing-icon="i-tabler-chevron-up" />

            <template #content>
                <div class="p-4">
                    <SpecialKeySelector />
                </div>
            </template>
        </UPopover>
    </div>
</template>