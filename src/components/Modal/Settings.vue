<script setup lang="ts">
const modal = useModal()
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
    <UModal>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <h1 class="font-semibold text-lg">Settings</h1>
            </template>

            <div class="grid grid-flow-row grid-cols-2 gap-4">
                <UFormGroup label="Openterface Camera">
                    <USelectMenu v-model="device" :options="options" option-attribute="label" />
                </UFormGroup>
                <UFormGroup label="Mouse Mode">
                    <USelectMenu v-model="mouseMode" :options="mouseModes" disabled />
                </UFormGroup>
                <UFormGroup label="Keyboard Layout">
                    <USelectMenu v-model="keyFormatSelected" :options="keyFormat" disabled />
                </UFormGroup>
            </div>

            <template #footer>
                <div class="flex flex-row justify-between">
                    <div class="justify-start">
                        <UButton label="Forget Devices" variant="ghost" color="red" />
                    </div>
                    <div class="justify-end">
                        <UButton label="Save" @click="modal.close()" />
                    </div>
                </div>
            </template>
        </UCard>
    </UModal>
</template>