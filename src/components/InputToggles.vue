<script setup lang="ts">
const keyboard = useState('keyboard', () => false)
const mouse = useState('mouse', () => false)
const hostToggle = useState('host-toggle', () => false)
</script>

<template>
    <div class="flex flex-row  items-center content-center select-none gap-0.5">
        <UTooltip text="Monitor Status">
            <UButton icon="i-ph-monitor-duotone" size="xl" :padded="true" color="primary" square variant="ghost" />
        </UTooltip>
        <UTooltip text="Keyboard Status">
            <UButton icon="i-ph-keyboard-duotone" size="xl" :padded="true" :color="keyboard ? 'green' : 'red'" square
                variant="ghost" @click="keyboard = !keyboard" />
        </UTooltip>

        <UButton icon="i-ph-mouse-simple-duotone" size="xl" :padded="true" :color="mouse ? 'green' : 'red'" square
            variant="ghost" @click="mouse = !mouse" />

        <UDivider orientation="vertical" />

        <UTooltip text="Host / Target Toggle" class="gap-0.5 justify-center place-items-center">
            <UToggle size="lg" v-model="hostToggle" on-icon="i-tabler-letter-t" off-icon="i-tabler-letter-h" />
        </UTooltip>
    </div>
</template>