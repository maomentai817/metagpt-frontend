<script setup>
import LayoutAside from './components/LayoutAside.vue'
import LayoutNav from './components/LayoutNav.vue'
import SubNav from './components/SubNav.vue'
import { ref } from 'vue'
import { useGlobalStore } from '@/stores'

const flag = ref(false)
const globalStore = useGlobalStore()
const toggleFullScreen = (isFullScreen) => {
  flag.value = isFullScreen
}
</script>

<template>
  <div class="common-layout m-0 wh-full duration-300">
    <el-container class="wh-full">
      <el-aside
        :width="flag ? '0px' : '200px'"
        :class="globalStore.isCollapse ? 'collapse' : ''"
      >
        <layout-aside></layout-aside>
      </el-aside>
      <el-container>
        <el-header
          class="pr-0! overflow-hidden duration-300"
          :height="flag ? '0px' : '60px'"
        >
          <LayoutNav></LayoutNav>
        </el-header>
        <div class="subnav-container mb-10 h-40">
          <SubNav @toggle-full-screen="toggleFullScreen" />
        </div>
        <el-main class="pt-0!">
          <!-- 二级路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-aside) {
  transition: 0.3s;
  &::-webkit-scrollbar {
    display: none;
  }
}
:deep(.el-main) {
  scrollbar-width: thin;
  --un-scrollbar-width: 6px;
  --un-scrollbar-height: 6px;
}
.collapse {
  width: calc(
    var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2
  );
}
.subnav-container {
  border-bottom: 1px solid
    v-bind(
      "globalStore.isDark ? ' rgba(255, 255, 255, 0.1) ' : ' rgba(0, 0, 0, 0.1)'"
    );
}
</style>
