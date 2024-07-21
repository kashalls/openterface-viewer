<script setup lang="ts">
const selected = ref<Array<string>>([])

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

const onUpdate = (elements: string[]) => {
    if (elements.length > 5) return;
    selected.value = elements
}
</script>

<template>
    <div class="grid grid-cols-4 gap-2 *:justify-center">
        <UButton v-for="key in keys"
            :label="key.label" variant="outline" color="green" />
    </div>
</template>