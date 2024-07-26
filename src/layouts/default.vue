<script setup lang="ts">
useSeoMeta({
    title: 'Openterface Viewer',
    description: 'A webviewer for the open-source kvm openterface.',
    ogTitle: 'Openterface Viewer',
    ogDescription: 'A webviewer for the open-source kvm openterface.'
})

useHead({
    htmlAttrs: {
        lang: 'en'
    }
})
</script>

<template>
    <div>
        <UContainer :ui="{ constrained: 'max-w-[94rem]' }">
            <NuxtPage />
        </UContainer>

        <UModals />
        <UNotifications />
    </div>
</template>