import instance from '@/utils/instance'

// 获取角色列表
export const getRoleList = () => instance.get('/role/list')

// 获取角色行为列表
export const getRoleActionList = (name) =>
  instance.post('/role/actions', { name })

// 获取角色信息代码
export const getRoleCode = (name) => instance.post('/role/code', { name })