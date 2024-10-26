import instance from '@/utils/instance'

// 获取项目日志信息
export const getProjectLog = () => instance.get('/project/logs')
