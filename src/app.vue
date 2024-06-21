<script setup>

if (navigator.usb) {
  console.log(navigator.usb)
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
