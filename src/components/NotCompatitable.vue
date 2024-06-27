<script lang="ts" setup>
const browser = useBrowserDetection()
</script>

<template>
  <div class="mx-auto flex h-full w-full flex-col items-center justify-center overflow-hidden">
    <div>
      <div>
        <div class="text-2xl">
          Hey<br>
          Welcome to Openviewer.
        </div>
        <div class="text-xl text-gray-300">
          <div class="my-3 flex item-center gap-3">
            <div>
              Unfortunately, your current {{ browser?.name }} {{ browser?.version ? `version ${browser.version}` : '' }} is not
              supported.
            </div>
          </div>
        </div>
        <div class="text-md text-gray-300">
          <p>Currently only Chrome and Microsoft Edge support the WebSerial API.</p>
          <p>We do not know when this feature will become available for your browser.</p>
        </div>
      </div>
      <div class="flex mt-14">

      </div>
    </div>
  </div>
</template>

<style></style>