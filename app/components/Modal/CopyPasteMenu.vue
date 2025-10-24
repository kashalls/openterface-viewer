<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>()

const data = ref('')
</script>

<template>
    <UModal>
        <UCard variant="soft">
            <template #header>
                <h1 class="font-semibold text-lg">Target Paste</h1>
            </template>
            <UFormGroup label="Paste To Target"
                help="This will type out the text above one character at a time. Input from the viewer will be blocked until this completes.">
                <UTextarea color="neutral" :rows="9" variant="outline" placeholder="..." :model-value="data" />
            </UFormGroup>
            <template #footer>
                <div class="flex flex-row">
                    <div class="justify-end">
                        <UButton label="Paste" @click="emit('close', false)" />
                    </div>
                </div>
            </template>
        </UCard>
    </UModal>
</template>