<script setup lang="ts">
const keyboard = useState('keyboard', () => false)
const mouse = useState('mouse', () => false)
const hostToggle = useState('host-toggle', () => false)
const { enabled, connect: viewerConnect, disconnect: viewerDisconnect } = useViewerMedia()
const { isConnected, connect: serialConnect, disconnect: serialDisconnect } = useSerial()

async function handleMonitorToggle() {
    if (enabled.value) {
        await viewerDisconnect()
    } else {
        await viewerConnect()
    }

    if (isConnected.value) {
        keyboard.value = false
        mouse.value = false
        await serialDisconnect()
    } else {
        await serialConnect()
        keyboard.value = true
        mouse.value = true
    }
}
</script>

<template>
    <div class="flex flex-row  items-center content-center select-none gap-x-1.5">
        <UTooltip text="Host / Target Toggle" class="justify-center place-items-center">
            <UToggle size="lg" disabled v-model="hostToggle" on-icon="i-tabler-letter-t" off-icon="i-tabler-letter-h" />
        </UTooltip>

        <UTooltip text="Toggle Monitor Status">
            <UButton icon="i-ph-monitor-duotone" size="md" square variant="outline" @click="handleMonitorToggle"
                :color="enabled ? 'green' : 'red'">
            </UButton>
        </UTooltip>

        <UTooltip text="Toggle Keyboard Status">
            <UButton icon="i-ph-keyboard-duotone" size="md" :padded="true" :color="keyboard ? 'green' : 'red'" square
                variant="outline" @click="keyboard = !keyboard" />
        </UTooltip>

        <UTooltip text="Toggle Mouse Status">
            <UButton icon="i-ph-mouse-simple-duotone" size="md" :padded="true" :color="mouse ? 'green' : 'red'"
                variant="outline" @click="mouse = !mouse" />
        </UTooltip>
    </div>
</template>