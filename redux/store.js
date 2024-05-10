import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import rootSaga from './rootSaga'
import rootReducer from './rootReducer'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]

export const store = createStore(rootReducer, applyMiddleware(...middlewares))

sagaMiddleware.run(rootSaga)

