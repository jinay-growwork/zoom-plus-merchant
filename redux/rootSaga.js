import { all } from 'redux-saga/effects'
import auth from './auth/saga'
import home from './Home/saga'

export default function* rootSaga() {
    yield all([auth(), home()])
}
