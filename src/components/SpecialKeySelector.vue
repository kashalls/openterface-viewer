<script setup lang="ts">
const selected = ref([])

function getFunctionKeys() {
    const fnKeys = [] as Array<object>;

    for (let i = 1; i <= 12; i++) {
        const keyLabel = `F${i}`;
        const keyValue = WINDOWS_KEYMAP[keyLabel];

        fnKeys.push({ label: keyLabel, value: keyValue });
    }

    return fnKeys;
}

const keys = computed(() => {
    return [...getFunctionKeys()]
})
</script>

<template>
    <USelectMenu v-model="selected" :options="keys" multiple placeholder="Select keys" />
</template>