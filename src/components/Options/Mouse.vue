<script setup lang="ts">
const { enabled } = useViewerMouse()

const items = [
    [
        {
            label: enabled ? 'Enabled' : 'Disabled',
            icon: 'i-ph-mouse-duotone'
        }
    ], [
        {
            label: 'Absolute',
            icon: 'i-ph-navigation-arrow-duotone',
            click: () => {
                console.log('Absolute Mouse')
            }
        }, {
            label: 'Relative',
            icon: 'i-ph-arrows-out-cardinal',
            disabled: true
        }
    ]
]
</script>

<template>
    <UDropdown :items="items">
        <UTooltip text="Mouse Options" :popper="{ placement: 'top' }">
            <UButton icon="i-ph-mouse-simple-duotone" size="sm" color="primary" square variant="ghost"
                trailing-icon="i-heroicons-chevron-down-20-solid" :ui="{ gap: { sm: '' } }" />
        </UTooltip>
    </UDropdown>
</template>
