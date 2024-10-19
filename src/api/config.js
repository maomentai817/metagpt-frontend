import instance from '@/utils/instance'

// 连通测试
export const getConnection = (params) => instance.post('/connection', params)

// 配置修改
export const updateConfig = (params) => instance.post('/config', params)

// 获取配置信息
export const getConfig = () => instance.get('/config')
