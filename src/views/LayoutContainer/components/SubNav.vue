<script setup>
import { useGlobalStore } from '@/stores'
import { ref, watch } from 'vue'
import { FullScreen } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const globalStore = useGlobalStore()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['toggleFullScreen'])
const isFullScreen = ref(false)
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  emit('toggleFullScreen', isFullScreen.value)
}

const tabs = ref(route.path)
const tabClickHandle = () => {
  router.push(tabs.value)
}
const tabRemoveHandle = (tab) => {
  globalStore.removePanels(tab)
}
const tabChangeHandle = () => {
  router.push(tabs.value)
}
watch(route, () => {
  tabs.value = route.path
})
</script>

<template>
  <div class="sub-nav f-b p-x-20">
    <div class="left-content f-c">
      <el-tabs
        v-model="tabs"
        type="card"
        closable
        class="demo-tabs"
        @tab-click="tabClickHandle"
        @tab-remove="tabRemoveHandle"
        @tab-change="tabChangeHandle"
      >
        <el-tab-pane
          v-for="item in globalStore.tabPanels"
          :key="item.path"
          :label="item.title"
          :name="item.path"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-content mb-5">
      <div class="full-screen" @click="toggleFullScreen">
        <IconCube
          :label="isFullScreen ? '退出全屏' : '全屏'"
          :isDark="globalStore.isDark"
        >
          <FullScreen />
        </IconCube>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__header) {
  margin-bottom: 0 !important;
  border-bottom: none;
}
</style>
