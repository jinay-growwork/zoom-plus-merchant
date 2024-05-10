import apiCall from '../axiosInterceptor'

export const loginAPI = async (payload) => {
    return await apiCall.post('user/auth/signInOtp', payload)
}

export const verifyOTPAPI = async (payload) => {
    return await apiCall.post('user/auth/verifyOtp', payload)
}

export const registerUserAPI = async (payload) => {
    return await apiCall.post('user/auth/registerUser', payload)
}

export const checkRegisterUserforGoogleAPI = async () => {
    return await apiCall.get('user/auth/checkIsRegisterGoogleUser')
}

export const registerUserforGoogleAPI = async (payload) => {
    return await apiCall.post('user/auth/registerUserGoogle', payload)
}
