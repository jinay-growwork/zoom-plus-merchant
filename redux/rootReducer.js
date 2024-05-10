// ** Reducers Imports

import { homeReducer } from './Home/reducer'
import { authReducer } from './auth/reducer'

import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    home: homeReducer,
})

export default rootReducer
