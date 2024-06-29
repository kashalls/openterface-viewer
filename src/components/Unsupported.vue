<script lang="ts" setup>
const { supported } = useBrowserSupport()
</script>

<template>
  <AlertDialog :default-open="!supported">
    <AlertDialogTrigger as-child>
      <Button variant="destructive" class="animate-pulse" v-if="!supported">
        <span class="sr-only">Unsupported Browser</span>
        <Icon name="radix-icons:exclamation-triangle" class="h-4 w-4" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Unsupported Browser</AlertDialogTitle>
        <AlertDialogDescription>
          <NuxtLink to="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility" class="text-foreground underline">Only Chrome/Edge browsers fully support the WebSerial API.</NuxtLink><br><br> You will only be able to view your camera using this application. Please switch to a supported browser or use the <NuxtLink to="https://openterface.com" class="text-foreground underline">Official Openterface Application.</NuxtLink>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style></style>