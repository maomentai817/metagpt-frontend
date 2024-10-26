<script setup></script>

<template>
  <div class="model-container h-full">
    <card-container>
      <div class="mc-canvas wh-full"></div>
    </card-container>
  </div>
</template>

<style lang="scss" scoped>
.model-container {
  .mc-canvas {
    background-size: 20px 20px;
    background-position: left 0px top -40px;
    background-image: radial-gradient(
      circle at 10px 10px,
      #d9dee8 1px,
      transparent 0
    );
  }
}
</style>
