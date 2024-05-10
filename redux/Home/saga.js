import { all, takeEvery, put } from 'redux-saga/effects'
// import axios from "axios"
import actions from './actions'

import { getFoodCategoriesAPI, getMerchantslistsAPI } from '../../api/Home'

export function* WATCH_GET_FOODS_CATEGORIES(action) {
    try {
        const resp = yield getFoodCategoriesAPI()
        console.info('----------------------------')
        console.info('resp =>', resp)
        console.info('----------------------------')
        yield put({
            type: actions.SET_FOODS_CATEGORIES,
            payload: resp?.data,
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_GET_MERCHANTS_LISTS(action) {
    try {
        const resp = yield getMerchantslistsAPI()
        console.info('----------------------------')
        console.info('resp =>', resp)
        console.info('----------------------------')
        yield put({
            type: actions.SET_MERCHANTS_LISTS,
            payload: resp?.data,
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.GET_FOODS_CATEGORIES, WATCH_GET_FOODS_CATEGORIES),
        takeEvery(actions.GET_MERCHANTS_LISTS, WATCH_GET_MERCHANTS_LISTS),
    ])
}
