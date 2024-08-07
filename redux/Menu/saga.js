import { all, takeEvery, put } from 'redux-saga/effects'
// import axios from "axios"
import actions from './actions'

import {
    getMenuCategoriesAPI,
    getMenuSubCategoriesAPI,
    getMenuSubCategoriesByIdAPI,
    setMenuCategoriesAPI,
    setMenuItemAPI,
    setMenuSubCategoriesAPI,
    updateMenuItemAPI,
} from '../../api/Menu'

export function* WATCH_ADD_CATEGORY(action) {
    try {
        const resp = yield setMenuCategoriesAPI(action.payload)
        if (resp?.info?.isSuccess === true) {
            action.payload.navigation.navigate('Menu')
            const resp = yield getMenuCategoriesAPI()
        }
        console.info('----------------------------')
        console.info('resp =>', resp)
        console.info('----------------------------')
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}
export function* WATCH_GET_CATEGORY(action) {
    try {
        const resp = yield getMenuCategoriesAPI()
        console.info('----------------------------')
        console.info('getMenuCategoriesAPI =>', resp)
        console.info('----------------------------')
        yield put({
            type: actions.SET_CATEGORY,
            payload: resp?.data,
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_GET_SUB_CATEGORY(action) {
    try {
        const resp = yield getMenuSubCategoriesAPI()
        console.info('----------------------------')
        console.info('getMenuSubCategoriesAPI =>', resp)
        console.info('----------------------------')
        yield put({
            type: actions.SET_SUB_CATEGORY,
            payload: resp?.data,
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_ADD_SUB_CATEGORY(action) {
    try {
        const resp = yield setMenuSubCategoriesAPI(action.payload)
        if (resp?.info?.isSuccess === true) {
            action.payload.navigation.navigate('Menu')
            const resp = yield getMenuCategoriesAPI()
        }
        console.info('----------------------------')
        console.info('resp =>', resp)
        console.info('----------------------------')
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_GET_SUB_CATEGORY_BY_ID(action) {
    try {
        const resp = yield getMenuSubCategoriesByIdAPI(
            action.payload?.categoryId
        )
        console.info('----------------------------')
        console.info('getMenuSubCategoriesByIdAPI =>', resp)
        console.info('----------------------------')
        yield put({
            type: actions.SET_SUB_CATEGORY_BY_ID,
            payload: resp?.data,
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_ADD_MENU_ITEM(action) {
    try {
        const resp = yield setMenuItemAPI(action.payload)
        console.info('----------------------------')
        console.info('setMenuItemAPI =>', resp)
        console.info('----------------------------')

        if (resp?.info?.isSuccess === true) {
            action.navigation.navigate('Menu')
            const resp = yield getMenuCategoriesAPI()
        }
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_UPDATE_MENU_ITEM(action) {
    try {
        const resp = yield updateMenuItemAPI(action.payload)
        console.info('----------------------------')
        console.info('updateMenuItemAPI =>', resp)
        console.info('----------------------------')

        if (resp?.info?.isSuccess === true) {
            action.navigation.navigate('Menu')
            const resp = yield getMenuCategoriesAPI()
        }
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actions.ADD_CATEGORY, WATCH_ADD_CATEGORY)])
    yield all([takeEvery(actions.GET_CATEGORY, WATCH_GET_CATEGORY)])
    yield all([takeEvery(actions.ADD_SUB_CATEGORY, WATCH_ADD_SUB_CATEGORY)])
    yield all([takeEvery(actions.GET_SUB_CATEGORY, WATCH_GET_SUB_CATEGORY)])
    yield all([
        takeEvery(actions.GET_SUB_CATEGORY_BY_ID, WATCH_GET_SUB_CATEGORY_BY_ID),
    ])
    yield all([takeEvery(actions.SET_MENU_ITEM, WATCH_ADD_MENU_ITEM)])
    yield all([takeEvery(actions.UPDATE_MENU_ITEM, WATCH_UPDATE_MENU_ITEM)])
}
