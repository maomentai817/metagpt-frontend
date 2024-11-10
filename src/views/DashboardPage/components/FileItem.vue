<script setup>
import cssIcon from '@/assets/icon/css.svg'
import htmlIcon from '@/assets/icon/html.svg'
import jsIcon from '@/assets/icon/js.svg'
import jsonIcon from '@/assets/icon/json.svg'
import mdIcon from '@/assets/icon/md.svg'
import pyIcon from '@/assets/icon/py.svg'
import txtIcon from '@/assets/icon/txt.svg'
import { computed } from 'vue'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
const props = defineProps({
  file: {
    type: Object,
    default: () => ({})
  }
})

// 计算属性来根据 fileType 返回对应的图标
const fileIcon = computed(() => {
  const icons = {
    css: cssIcon,
    html: htmlIcon,
    js: jsIcon,
    json: jsonIcon,
    md: mdIcon,
    py: pyIcon,
    txt: txtIcon
  }

  return icons[props.file.fileType] || '' // 默认返回空字符串，如果找不到匹配的图标
})
</script>

<template>
  <div
    class="file-item-container f-b cp m-r-20 duration-500"
    :class="globalStore.isDark ? 'file-dark' : 'file-light'"
  >
    <div class="file-img wh-40 f-c rounded-4 flex-shrink-0">
      <img :src="fileIcon" alt="" class="wh-full p-4" />
    </div>
    <div class="file-name fs-14 m-l-8">{{ file.fileName }}</div>
  </div>
</template>

<style lang="scss" scoped>
.file-light {
  background-color: #f4f4f4;
}
.file-dark {
  background-color: #2b3440;
}
.file-img {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
