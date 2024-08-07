import { all, takeEvery, put } from 'redux-saga/effects'
// import axios from "axios"
import actions from './actions'
import { getOrderAPI, updateOrderAPI } from '../../api/Order'

export function* WATCH_GET_ORDER(action) {
    try {
        const resp = yield getOrderAPI(action.payload)
        console.info('----------------------------')
        console.info('getOrderAPI =>', resp)
        console.info('----------------------------')
        yield put({
            type: actions.SET_ORDER,
            payload: resp?.data,
        })
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export function* WATCH_UPADTE_ORDER(action) {
    try {
        const resp = yield updateOrderAPI(action.payload)
        console.info('----------------------------')
        console.info('updateOrderAPI =>', resp)
        console.info('----------------------------')
    } catch (err) {
        console.info('--------------------')
        console.info('err => ', err)
        console.info('--------------------')
    }
}

export default function* rootSaga() {
    yield all([takeEvery(actions.GET_ORDERS, WATCH_GET_ORDER)])
    yield all([takeEvery(actions.UPDATE_ORDER, WATCH_UPADTE_ORDER)])
}
