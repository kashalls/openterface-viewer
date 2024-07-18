<script setup lang="ts">
const { controlKeys } = useViewerKeyboard()
</script>

<template>
    <div class="flex flex-grow-0 flex-row gap-1 *:shadow">
        <UButton size="sm" @click="controlKeys.shift = !controlKeys.shift"
            :variant="controlKeys.shift ? 'solid' : 'outline'">SHIFT</UButton>
        <UButton size="sm" @click="controlKeys.ctrl = !controlKeys.ctrl"
            :variant="controlKeys.ctrl ? 'solid' : 'outline'">CTRL</UButton>
        <UButton size="sm" @click="controlKeys.alt = !controlKeys.alt"
            :variant="controlKeys.alt ? 'solid' : 'outline'">ALT</UButton>
        <UButton size="sm" @click="controlKeys.windows = !controlKeys.windows"
            :variant="controlKeys.windows ? 'solid' : 'outline'" icon="i-tabler-brand-windows" />
    </div>
</template>