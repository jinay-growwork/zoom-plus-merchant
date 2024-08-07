import apiCall from '../axiosInterceptor'

export const getFoodCategoriesAPI = async () => {
    return await apiCall.get('user/foods/categories')
}

export const getMerchantslistsAPI = async () => {
    return await apiCall.get('user/merchants')
}

export const uploadToS3 = async (payload) => {
    console.info('----------------------------')
    console.info('payload =>', payload)
    console.info('----------------------------')
    return await apiCall.post('merchant/upload', payload)
}
