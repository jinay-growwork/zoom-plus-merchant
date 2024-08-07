import { all } from 'redux-saga/effects'
import auth from './auth/saga'
import home from './Home/saga'
import menu from './Menu/saga'
import order from './Order/saga'

export default function* rootSaga() {
    yield all([auth(), home(), menu(), order()])
}
