<script setup>
const usbFilters = [{ vendorId: 0x1A86 }]

if (navigator.usb) {
  console.log(navigator.usb)
  const device = await navigator.usb.requestDevice(usbFilters)
  console.log(device)
  console.log(navigator.usb.getDevices())
} else {
  console.log('This browser does not support WebUSB API.')
}

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
