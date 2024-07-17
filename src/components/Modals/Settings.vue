<script setup lang="ts">
const modal = useModal()
const mouseModes = ['Absolute', 'Relative']
const mouseMode = ref('Absolute')
</script>

<template>
    <UModal>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <h1 class="font-semibold text-lg">Settings</h1>
            </template>

            <div class="grid grid-rows-3 gap-2">
                <div>
                    <h2 class="font-medium">Display</h2>
                    <p class="italic">Not supported yet...</p>
                </div>
                <div>
                    <h2 class="font-medium">Mouse</h2>
                    <div class="grid grid-cols-2">
                        <UFormGroup label="Mouse Mode">
                            <USelectMenu v-model="mouseMode" :options="mouseModes" />
                        </UFormGroup>
                    </div>
                </div>
                <div>
                    <h2 class="font-medium">Keyboard</h2>
                    <p class="italic">Not supported yet...</p>
                </div>
            </div>

            <template #footer>
                <div class="flex flex-row justify-between">
                    <div class="justify-start">
                        <UButton label="Reset" variant="ghost" color="red" />
                    </div>
                    <div class="justify-end">
                        <UButton label="Save" @click="modal.close()" />
                    </div>
                </div>
            </template>
        </UCard>
    </UModal>
</template>