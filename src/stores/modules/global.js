import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getConfig, updateConfig } from '@/api/config'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const isDark = ref(JSON.parse(localStorage.getItem('isDark')) || false)
    const setDark = (flag) => {
      isDark.value = flag
    }

    const isCollapse = ref(
      JSON.parse(localStorage.getItem('global'))?.isCollapse || false
    )
    const setCollapse = (flag) => {
      isCollapse.value = flag
    }

    const localStorageClear = () => {
      localStorage.setItem(
        'global',
        JSON.stringify({ isDark: false, isCollapse: false })
      )
      localStorage.setItem('isDark', false)
    }

    // tab-panels
    const tabPanels = ref(
      JSON.parse(localStorage.getItem('global'))?.tabPanels || []
    )
    const addPanels = (panel) => {
      const index = tabPanels.value.findIndex(
        (item) => item.path === panel.path
      )
      if (index === -1) {
        tabPanels.value.push(panel)
      }
    }
    const removePanels = (panel) => {
      const index = tabPanels.value.findIndex((item) => item.path === panel)
      if (index !== -1) {
        tabPanels.value.splice(index, 1)
      }
    }

    // metagpt-config
    const config = ref(null)
    const getConfigStore = async () => {
      const res = await getConfig()
      if (res.status === 200) config.value = res.data
      return res
    }
    const updateConfigStore = async (params) => {
      const res = await updateConfig(params)
      if (res.status === 200) config.value = res.data
      getConfigStore()
      return res
    }
    return {
      isDark,
      setDark,
      isCollapse,
      setCollapse,
      localStorageClear,
      tabPanels,
      addPanels,
      removePanels,
      config,
      getConfigStore,
      updateConfigStore
    }
  },
  { persist: true }
)
