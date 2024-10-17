import instance from '@/utils/instance'

export const getConnection = (params) => instance.post('/connection', params)
