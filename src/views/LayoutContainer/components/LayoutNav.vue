<script setup>
import { Fold, Expand, Platform, FullScreen } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
const router = useRouter()
const goHome = () => {
  router.push('/dashboard')
}
const toggleCollapse = () => {
  globalStore.setCollapse(!globalStore.isCollapse)
}

const isFullScreen = ref(false)
const toggleFullScreen = () => {
  const element = document.documentElement

  if (!isFullScreen.value) {
    // 进入全屏模式
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  } else {
    // 退出全屏模式
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
  isFullScreen.value = !isFullScreen.value
}
const darkBtn = ref(null)
</script>

<template>
  <div class="nav-container f-b h-full">
    <div class="left-content f-c h-full">
      <IconCube
        @click="toggleCollapse"
        :label="!globalStore.isCollapse ? '折叠菜单' : '展开菜单'"
        :isDark="globalStore.isDark"
      >
        <Fold v-if="!globalStore.isCollapse" />
        <Expand v-else />
      </IconCube>
      <div class="home ml-18 f-b cursor-pointer" @click="goHome">
        <div class="icon-box f-c">
          <el-icon size="20"><Platform /></el-icon>
        </div>
        <div class="text-box ml-5 mb-2">看板</div>
      </div>
    </div>
    <div class="right-content f-c mr-20">
      <div class="full-screen f-c" @click="toggleFullScreen">
        <IconCube
          :label="isFullScreen ? '退出全屏' : '全屏'"
          :isDark="globalStore.isDark"
        >
          <FullScreen />
        </IconCube>
      </div>
      <div class="locale"></div>
      <div class="dark-mode m-x-15 f-c">
        <SwitchButton ref="darkBtn" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dark {
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}
</style>
