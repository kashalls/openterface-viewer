<script lang="ts" setup>
const modal = useModal()
</script>

<template>
  <UModal :overlay="true">
    <UCard>
      <template #header>
        <p class="font-semibold text-red-600">Unsupported Browser</p>
      </template>
      <div class="space-y-2">
        <UButton color="primary" variant="link"
          to="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility">
          Only chrome & edge browsers fully support the WebSerial API (which this webapp requires).
        </UButton>
        <p class="textsm">You will only be able to view your camera using this application.</p>
        <UButton color="primary" variant="link" to="https://openterface.com" class="text-foreground underline">Please
          switch
          to a supported
          browser or use the
          Official Openterface Application.</UButton>
      </div>
      <template #footer>
        <UButton label="I Understand" color="rose" @click="modal.close()" class="ml-auto" />
      </template>
    </UCard>
  </UModal>
</template>
