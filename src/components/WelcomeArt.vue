<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
    <div class="m-16">
        <img v-if="colorMode.value === 'light'" src="@/assets/artwork/welcome-light.svg" alt="Openterface Welcome Page" />
        <img v-else src="@/assets/artwork/welcome-dark.svg" alt="Openterface Welcome Page (Dark)" />
    </div>
</template>