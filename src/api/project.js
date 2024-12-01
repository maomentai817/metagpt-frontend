import instance from '@/utils/instance'

// 获取项目日志信息
export const getProjectLog = () => instance.get('/project/logs')

// 获取项目列表
export const getProjectList = () => instance.get('/project/list')

// 获取项目信息
export const getProjectFile = (name) => instance.post('/project/file', { name })

// 获取场景名列表
export const getEnvs = () => instance.get('/env')
