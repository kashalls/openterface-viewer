<script lang="ts" setup>
const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal :overlay="true">
    <UCard>
      <template #header>
        <p class="font-semibold text-red-500">Limited Support - Viewing Only</p>
      </template>
      <div class="space-y-3">
        <p class="text-base">
          It looks like your current browser does not support the required <b>WebSerial API</b> feature.
          This means you won't be able to connect to external devices through a serial connection.
          However, you can still use this client to view the display.
        </p>
        <p class="text-sm">For the best experience and full functionality, please consider using a browser that supports the
          <b>WebSerial API</b> feature.
        </p>
      </div>
      <template #footer>
        <div class="flex">
          <UButton label="Browser Compatibility" color="neutral" href="https://developer.mozilla.org/en-US/docs/Web/API/SerialPort#browser_compatibility" />
          <UButton label="I Understand" color="primary" @click="emit('close', true)" class="ml-auto" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
