<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>()
const mouseModes = ['Absolute', 'Relative']
const mouseMode = ref('Absolute')

// Keyboard Layout
const keyFormat = ['QWERTY']
const keyFormatSelected = ref(keyFormat[0])

// Display
const { selectedDevice, devices, showAllDevices } = useViewerMedia()

const options = computed(() => {
    return unref(devices.value).filter((dev) => unref(showAllDevices) ? true : dev.label.startsWith('Openterface'))
})

const device = computed({
    get() {
        return unref(devices).find((device) => device.deviceId === selectedDevice.value)
    },
    set(value) {
        selectedDevice.value = value!.deviceId
    }
})
</script>

<template>
    <UModal :close="{ onClick: () => emit('close', false) }" :ui="{ footer: 'justify-between' }" title="Settings"
        description="Configure how this application interacts with your devices.">

        <template #body>
            <div class="grid grid-flow-row grid-cols-2 gap-4">
                <UFormField label="Openterface Camera">
                    <USelectMenu v-model="device" :options="options" option-attribute="label" />
                </UFormField>
                <UFormField label="Mouse Mode">
                    <USelectMenu v-model="mouseMode" :options="mouseModes" disabled />
                </UFormField>
                <UFormField label="Keyboard Layout">
                    <USelectMenu v-model="keyFormatSelected" :options="keyFormat" disabled />
                </UFormField>
            </div>
        </template>

        <template #footer="{ close }">
            <UButton label="Forget Devices" variant="ghost" color="error" />
            <UButton label="Save" color="success" />
        </template>
    </UModal>
</template>