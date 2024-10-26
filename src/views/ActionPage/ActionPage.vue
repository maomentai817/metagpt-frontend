<script setup>
import { getActionList, getActionInfo } from '@/api/action'
import { ref, onMounted } from 'vue'
import ActionItem from './components/ActionItem.vue'
import { useGlobalStore } from '@/stores'

const actionList = ref([])
onMounted(async () => {
  const res = await getActionList()
  actionList.value = res.data
})

const activeActionInfo = ref('')
const dialogVisible = ref(false)
const globalStore = useGlobalStore()
const showActionInfo = async (item) => {
  const res = await getActionInfo(item)
  activeActionInfo.value = res.data
  dialogVisible.value = true
}
</script>

<template>
  <div class="action-container h-full">
    <card-container>
      <div class="ac-canvas wh-full fd-col items-center p-t-30">
        <el-button class="add-action" type="primary" size="large"
          >自定义行为</el-button
        >
        <div class="shell m-t-80">
          <action-item
            v-for="(item, index) in actionList"
            :item="item"
            :key="index"
            @click="showActionInfo(item)"
          ></action-item>
        </div>
      </div>
      <el-dialog v-model="dialogVisible" :destroy-on-close="true">
        <VCodeBlock
          :browser-window="true"
          :code="activeActionInfo"
          highlightjs
          lang="python"
          :theme="globalStore.isDark ? 'github-dark' : 'github'"
        />
      </el-dialog>
    </card-container>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card__body) {
  .content {
    scrollbar-width: thin;
    background-size: 20px 20px;
    background-position: left 0px top -40px;
    background-image: radial-gradient(
      circle at 10px 10px,
      #d9dee8 1px,
      transparent 0
    );
  }
}
:deep(.el-overlay-dialog) {
  scrollbar-width: none;
}
:deep(.el-dialog) {
  padding: 0 !important;
  background-color: transparent !important;
}
:deep(.el-dialog__header) {
  padding: 0 !important;
}
:deep(code) {
  scrollbar-width: thin;
}
.action-container {
  .ac-canvas {
    .shell {
      --size: 100px;
      display: grid;
      grid-template-columns: repeat(10, var(--size));
      grid-auto-rows: var(--size);
      place-items: start center;
      gap: 1.5em;
      margin-bottom: 50px;
    }
    .box {
      transform: rotate(45deg);
      /* 网格跨2列 */
      grid-column: auto / span 2;
      border-radius: 10px;
      box-shadow: 5px 0 5px #00000027;
      border: 5px solid #efefef;
      transition: 0.3s;
    }
    .box:nth-child(9n-3) {
      grid-column: 2 / span 2;
    }
    .shell:hover .box:not(:hover) {
      filter: brightness(0.5) contrast(0.8);
    }
    .box:hover {
      transform: rotate(0) scale(1.6);
      z-index: 1;
    }
  }
}
</style>
