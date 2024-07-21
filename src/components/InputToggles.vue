<script setup lang="ts">
const keyboard = useState('keyboard', () => false)
const mouse = useState('mouse', () => false)
const hostToggle = useState('host-toggle', () => false)
const { enabled, connect, disconnect } = useViewerMedia()

function handleMonitorToggle () {
    if (enabled.value) disconnect()
    else connect()
}
</script>

<template>
    <div class="flex flex-row  items-center content-center select-none gap-x-1.5">
        <UTooltip text="Host / Target Toggle" class="justify-center place-items-center">
            <UToggle size="lg" disabled v-model="hostToggle" on-icon="i-tabler-letter-t" off-icon="i-tabler-letter-h" />
        </UTooltip>
        
        <UTooltip text="Toggle Monitor Status">
            <UButton icon="i-ph-monitor-duotone" size="md" square variant="outline"
                @click="handleMonitorToggle" :color="enabled ? 'green' : 'red'" />
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