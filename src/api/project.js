import instance from '@/utils/instance'

// 获取项目日志信息
export const getProjectLog = () => instance.get('/project/logs')

// 获取项目列表
export const getProjectList = () => instance.get('/project/list')

// 获取项目信息
export const getProjectFile = (name) => instance.post('/project/file', { name })

// 获取场景名列表
export const getEnvs = () => instance.get('/env')

// 创建场景
export const createEnv = (data) => instance.post('/env/new', data)

// 获取场景角色
export const getEnvRole = (name) => instance.get(`/env/role?envName=${name}`)
