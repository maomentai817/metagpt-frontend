import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getConfig, updateConfig } from '@/api/config'

export const useConfigStore = defineStore('config', () => {
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
    config,
    getConfigStore,
    updateConfigStore
  }
})
