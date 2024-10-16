<script setup>
import { ElTooltip } from 'element-plus'

defineProps({
  size: {
    type: Number,
    default: 40
  },
  iconSize: {
    type: Number,
    default: 20
  },
  label: {
    type: String,
    default: '' // 提示文本
  },
  showAfter: {
    type: Number,
    default: 200 // 延迟显示时间（毫秒）
  },
  isDark: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="icon-cube f-c cursor-pointer wh-40" :class="isDark ? 'dark' : ''">
    <el-tooltip
      :content="label"
      :show-after="showAfter"
      effect="dark"
      placement="top"
    >
      <el-icon :size="iconSize">
        <slot></slot>
      </el-icon>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.icon-cube {
  &:hover {
    background-color: #2e333817;
    transition-duration: 500ms;
    border-radius: 8px;
  }
}
.dark {
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}
</style>
