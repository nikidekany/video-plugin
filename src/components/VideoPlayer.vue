<script setup lang="ts">
export interface Props {
  hls: string
  audio: string
}
defineProps<Props>()
</script>
<template>
  <video>
    <source
      :src="hls"
      type="application/x-mpegURL"
    />
    <source
      type="video/mp4"
      :src="audio"
    />
  </video>
</template>
