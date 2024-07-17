<script setup lang="ts">
const isOpen = ref(false)

defineShortcuts({
    escape: {
        usingInput: true,
        whenever: [isOpen],
        handler: () => { isOpen.value = false }
    }
})
</script>

<template>
    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <Placeholder class="h-8" />
            </template>

            <Placeholder class="h-32" />

            <template #footer>
                <Placeholder class="h-8" />
            </template>
        </UCard>
    </UModal>
</template>