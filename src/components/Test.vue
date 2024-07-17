<script setup lang="ts">
const { controlKeys } = useViewerKeyboard()
</script>

<template>
    <div class="flex flex-grow-0 flex-row gap-1 *:shadow">
        <UButton size="sm" @click="controlKeys.shiftLeft = !controlKeys.shiftLeft"
            :variant="controlKeys.shiftLeft ? 'solid' : 'outline'">SHIFT</UButton>
        <UButton size="sm" @click="controlKeys.ctrlLeft = !controlKeys.ctrlLeft"
            :variant="controlKeys.ctrlLeft ? 'solid' : 'outline'">CTRL</UButton>
        <UButton size="sm" @click="controlKeys.altLeft = !controlKeys.altLeft"
            :variant="controlKeys.altLeft ? 'solid' : 'outline'">ALT</UButton>
        <UButton size="sm" @click="controlKeys.windowsLeft = !controlKeys.windowsLeft"
            :variant="controlKeys.windowsLeft ? 'solid' : 'outline'" icon="i-tabler-brand-windows" />
    </div>
</template>