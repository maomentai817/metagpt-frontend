<script setup>
defineProps({
  item: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="box w-9em h-9em relative cp durtion-300 bg-#27ba9b p-t-3em">
    <span class="">{{ item }}</span>
  </div>
</template>

<style lang="scss" scoped>
.box {
  white-space: normal;
  overflow-wrap: break-word;
  text-align: center;
}
</style>
