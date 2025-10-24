<script setup lang="ts">
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
    <div class="inline-flex items-center gap-2">
        <UIcon name="i-ph-monitor-duotone" />
        <USelectMenu v-model="device" :options="options" option-attribute="label" />
    </div>
</template>