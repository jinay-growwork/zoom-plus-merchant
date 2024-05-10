import apiCall from '../axiosInterceptor'

export const getFoodCategoriesAPI = async () => {
    return await apiCall.get('user/foods/categories')
}

export const getMerchantslistsAPI = async () => {
    return await apiCall.get('user/merchants')
}
