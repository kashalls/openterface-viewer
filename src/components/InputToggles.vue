<script setup lang="ts">
const enabled = 'text-green-700 hover:text-green-600'
const disabled = 'text-red-700 hover:text-red-600'

const { enabled: keyboard } = useViewerKeyboard()
const { enabled: hostToggle } = useHostToggle()

// monitor i-ph:monitor-duotone, keyboard i-ph:keyboard-duotone, mouse i-ph:mouse-simple-duotone | i-ph:computer-tower-duotone host toggle switch
</script>

<template>
    <div class="flex flex-row gap-1 items-center content-center select-none">
        <UTooltip text="Monitor Status">
            <UButton icon="i-ph-monitor-duotone" size="sm" color="primary" square variant="ghost" dynamic />
        </UTooltip>
        <UTooltip text="Keyboard Status">
            <UButton icon="i-ph-keyboard-duotone" size="sm" color="primary" square variant="ghost" />
        </UTooltip>

        <OptionsMouse />

        <UDivider orientation="vertical" />

        <UTooltip text="Host / Target Toggle" class="gap-0.5 justify-center place-items-center">
            <UIcon name="i-ph:computer-tower-duotone" dynamic size="1.3rem"
                :class="cn(hostToggle ? enabled : disabled)" />
            <UToggle size="sm" v-model="hostToggle" />
        </UTooltip>
    </div>
</template>