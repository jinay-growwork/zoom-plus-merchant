import apiCall from '../axiosInterceptor'

export const setMenuCategoriesAPI = async (payload) => {
    return await apiCall.post('merchant/merchantcategory/create', payload)
}

export const getMenuCategoriesAPI = async () => {
    return await apiCall.get('merchant/merchantcategory/getbymerchantid')
}

export const setMenuSubCategoriesAPI = async (payload) => {
    return await apiCall.post('merchant/subcategory/create', payload)
}

export const getMenuSubCategoriesAPI = async () => {
    return await apiCall.get('merchant/subcategory/get')
}

export const getMenuSubCategoriesByIdAPI = async (payload) => {
    return await apiCall.get(
        `merchant/merchantcategory/getsubcategory/${payload}`
    )
}

export const setMenuItemAPI = async (payload) => {
    return await apiCall.post('merchant/merchantItem/create', payload)
}

export const getMenuItemAPI = async (payload) => {
    return await apiCall.get(`merchant/merchantItem/get/${payload}`)
}

export const verifyInStockAPI = async (payload) => {
    return await apiCall.post(
        `merchant/merchantItem/updateStock/${payload?.id}`,
        { inStock: payload?.inStock }
    )
}

export const updateMenuItemAPI = async (payload) => {
    console.info('----------------------------')
    console.info('payload =>', payload)
    console.info('----------------------------')
    return await apiCall.put(
        `merchant/merchantItem/update/${payload?.menuItemId}`,
        payload
    )
}
