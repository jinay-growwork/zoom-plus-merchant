import apiCall from '../axiosInterceptor'

export const getOrderAPI = async (payload) => {
    return await apiCall.post('merchant/get/orderformerchant', payload)
}

export const updateOrderAPI = async (payload) => {
    return await apiCall.post(
        `merchant/updatestatus/order/${payload?.orderId}`,
        payload
    )
}

export const verifyOrderAPI = async (payload) => {
    console.log('---------------------');
    console.log('payload =>', payload);
    console.log('---------------------');
    return await apiCall.post('merchant/completeorder', payload)
}