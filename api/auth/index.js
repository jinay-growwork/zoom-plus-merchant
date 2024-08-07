import apiCall from '../axiosInterceptor'

export const loginAPI = async (payload) => {
    return await apiCall.post('merchant/auth/signInOtp', payload)
}

export const verifyOTPAPI = async (payload) => {
    console.info('----------------------------')
    console.info('payload =>', payload)
    console.info('----------------------------')
    return await apiCall.post('merchant/auth/verifyOtp', payload)
}

export const registerUserAPI = async (payload) => {
    return await apiCall.post('merchant/auth/registerUser', payload)
}

export const checkRegisterUserforGoogleAPI = async () => {
    return await apiCall.get('merchant/auth/checkIsRegisterGoogleUser')
}

export const registerUserforGoogleAPI = async (payload) => {
    return await apiCall.post('merchant/auth/registerUserGoogle', payload)
}

export const getRestaurantAPI = async () => {
    return await apiCall.get('merchant/allmerchantItem/get')
}

export const registerRestaurantAPI = async (payload) => {
    return await apiCall.post('merchant/auth/selectedMerchant', {
        merchantid: payload,
    })
}
