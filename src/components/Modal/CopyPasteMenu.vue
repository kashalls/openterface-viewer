<script setup lang="ts">
const modal = useModal()

const data = ref()
</script>

<template>
    <UModal>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <h1 class="font-semibold text-lg">Target Paste</h1>
            </template>
            <UFormGroup label="Paste To Target"
                help="This will type out the text above one character at a time. Input from the viewer will be blocked until this completes.">
                <UTextarea color="gray" :rows="9" variant="outline" placeholder="..." :model-value="data" />
            </UFormGroup>
            <template #footer>
                <div class="flex flex-row">
                    <div class="justify-end">
                        <UButton label="Paste" @click="modal.close()" />
                    </div>
                </div>
            </template>
        </UCard>
    </UModal>
</template>