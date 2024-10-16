<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores'

const isDark = ref(JSON.parse(localStorage.getItem('isDark')) || false)
const globalStore = useGlobalStore()
const modelToggle = (e) => {
  localStorage.setItem('isDark', JSON.stringify(isDark.value))
  // 获取 transition API 实例
  const transition = document.startViewTransition(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
  })
  // 在transition.ready 的 Promise 完成后, 执行自定义动画
  transition.ready.then(() => {
    const { clientX, clientY } = e
    // 计算半径, 以点击位置为中心, 到四角顶点最大距离为半径
    const radius = Math.hypot(
      Math.max(clientX, innerWidth - clientX),
      Math.max(clientY, innerHeight - clientY)
    )
    const clipPath = [
      `circle(0% at ${clientX}px ${clientY}px)`,
      `circle(${radius}px at ${clientX}px ${clientY}px)`
    ]
    const isDarkCurrent = document.documentElement.classList.contains('dark')
    document.documentElement.animate(
      {
        // 如果要切换到暗色主题，在过渡的时候从半径 100% 的圆开始，到 0% 的圆结束
        clipPath: isDarkCurrent ? clipPath.reverse() : clipPath
      },
      {
        duration: 500,
        // 如果要切换到暗色主题，应该裁剪 view-transition-old(root) 的内容
        pseudoElement: isDarkCurrent
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)'
      }
    )
  })
}

// 监听 isDark 变化并更新 localStorage
watch(isDark, (newValue) => {
  localStorage.setItem('isDark', JSON.stringify(newValue))
  globalStore.setDark(newValue)
})
onMounted(() => {
  // 初始化时, 获取 localStorage 中的 isDark 值
  isDark.value = JSON.parse(localStorage.getItem('isDark')) || false
  document.documentElement.classList.toggle('dark', isDark.value)
})

// 暴露函数
const darkBtn = ref(null)
defineExpose({
  modelToggle,
  triggerClick: () => {
    nextTick(() => {
      darkBtn.value.$el.click() // 手动触发点击事件
    })
  }
})
</script>

<template>
  <el-switch
    v-model="isDark"
    :active-action-icon="Moon"
    :inactive-action-icon="Sunny"
    @click="modelToggle"
    ref="darkBtn"
  />
</template>

<style lang="scss">
.dark::view-transition-old(root) {
  z-index: 100;
}
::view-transition-new(root),
::view-transition-old(root) {
  animation: none;
}
.el-switch.is-checked .el-switch__core {
  --el-switch-on-color: #4c4d4f;
  --el-switch-border-color: #4c4d4f;
}
</style>
