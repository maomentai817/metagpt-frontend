import instance from '@/utils/instance'

// 获取 action 列表\
export const getActionList = () => instance.get('/action/list')

// 获取 action 详情
export const getActionInfo = (name, role = '', ACT = '') =>
  instance.post('/action/info', { name, role, ACT })

// 新建行为 - code
export const createActionCode = (data) =>
  instance.post('/action/code/create', data)
