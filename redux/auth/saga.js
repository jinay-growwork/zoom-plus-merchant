import { all, takeEvery, put } from 'redux-saga/effects'
// import axios from "axios"
import actions from './actions'
import {
    checkRegisterUserforGoogleAPI,
    getRestaurantAPI,
    loginAPI,
    registerRestaurantAPI,
    registerUserAPI,
    registerUserforGoogleAPI,
    verifyOTPAPI,
} from '../../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storeData } from '../../helper'
import { store } from '../store'

export function* WATCH_SIGN_IN(action) {
    try {
        const resp = yield loginAPI(action.payload)
        console.info('----------------------------')
        console.info('WATCH_SIGN_IN=>', resp)
        console.info('----------------------------')
        console.info('----------------------------')
        console.info(' otp=>', resp?.data?.otp?.otp)
        console.info('----------------------------')
        if (resp?.data) {
            action.payload.navigation.navigate('OTPVerification')
        }
        yield put({
            type: actions.SET_AUTH_STATE,
            payload: { users: resp?.data?.otp },
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_VERIFY_OTP(action) {
    try {
        const resp = yield verifyOTPAPI(action.payload)
        console.info('----------------------------')
        console.info('WATCH_VERIFY_OTP =>', resp)
        console.info('----------------------------')
        if (resp?.data?.user?.id) {
            storeData('userid', resp?.data?.user?.id)
        }
        if (resp?.info?.isSuccess === true) {
            action.payload.navigation.navigate('RestaurantList')
        }
        console.info('----------------------------')
        console.info('resp?.data?.token =>', resp?.data?.token)
        console.info('----------------------------')
        if (resp?.data?.token) {
            console.info('----------------------------')
            console.info('resp?.data?.token =>', resp?.data?.token)
            console.info('----------------------------')
            storeData('verifyotptoken', resp?.data?.token)
        }

        yield put({
            type: actions.SET_AUTH_STATE,
            payload: { user: resp?.data?.user },
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_REGISTER_USER(action) {
    try {
        const resp = yield registerUserAPI(action.payload)
        console.info('----------------------------')
        console.info('WATCH_REGISTER_USER =>', resp)
        console.info('----------------------------')
        yield put({
            type: actions.SET_AUTH_STATE,
            payload: { user: resp?.data?.user },
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_CHEK_REGISTER_USER_FOR_GOOGLE(action) {
    try {
        const resp = yield checkRegisterUserforGoogleAPI()
        console.info('----------------------------')
        console.info('resp CHEK_REGISTER_USER_FOR_GOOGLE =>', resp)
        console.info('----------------------------')
        if (resp) {
            action.payload.setLoading(false)
        }
        if (resp?.data?.token) {
            storeData('token', resp?.data?.token)
        }
        yield put({
            type: actions.SET_AUTH_STATE,
            payload: {
                user: {
                    ...resp?.data?.user,
                    ...store.getState('auth')?.auth?.user,
                    isGoogleLogin: true,
                },
            },
        })

        if (resp?.data?.user?.isRegistered == false) {
            action.payload.navigation.navigate('FillYourProfile')
        }
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_REGISTER_USER_FOR_GOOGLE(action) {
    try {
        const resp = yield registerUserforGoogleAPI(action.payload)
        console.info('----------------------------')
        console.info('resp REGISTER_USER_FOR_GOOGLE =>', resp)
        console.info('----------------------------')

        storeData('token', resp?.data?.token)
        storeData('refresh_token', resp?.data?.refresh_token)
        yield put({
            type: actions.SET_AUTH_STATE,
            payload: {
                user: {
                    ...resp?.data?.user,
                    ...store.getState('auth')?.auth?.user,
                    isGoogleLogin: true,
                },
            },
        })
        if (resp) {
            action.payload.setLoading(false)
        }
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_GET_RESTAURANT(action) {
    try {
        const resp = yield getRestaurantAPI()
        console.info('----------------------------')
        console.info('respppppppp =>', resp)
        console.info('----------------------------')
        yield put({
            type: actions.SET_RESTAURANT,
            payload: { restaurant: resp?.data },
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_REGISTER_RESTAURANTT(action) {
    try {
        const resp = yield registerRestaurantAPI(action?.payload?.merchantid)
        console.info('----------------------------')
        console.info('registerRestaurant =>', resp)
        console.info('----------------------------')
        if (resp?.data?.token) {
            storeData('token', resp?.data?.token)
            action.payload.setLoading(false)
        }
        yield put({
            type: actions.SET_AUTH_STATE,
            payload: { user: resp?.data?.user, isRegisterRestaurant: true },
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(
            actions.CHEK_REGISTER_USER_FOR_GOOGLE,
            WATCH_CHEK_REGISTER_USER_FOR_GOOGLE
        ),
    ])
    yield all([
        takeEvery(
            actions.REGISTER_USER_FOR_GOOGLE,
            WATCH_REGISTER_USER_FOR_GOOGLE
        ),
    ])
    yield all([takeEvery(actions.SET_NUMBER, WATCH_SIGN_IN)])
    yield all([takeEvery(actions.VERIFY_OTP, WATCH_VERIFY_OTP)])
    yield all([takeEvery(actions.REGISTER_USER, WATCH_REGISTER_USER)])
    yield all([takeEvery(actions.GET_RESTAURANT, WATCH_GET_RESTAURANT)])
    yield all([
        takeEvery(actions.REGISTER_RESTAURANT, WATCH_REGISTER_RESTAURANTT),
    ])
}
