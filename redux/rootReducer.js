// ** Reducers Imports

import { homeReducer } from './Home/reducer'
import { menuReducer } from './Menu/reducer'
import { orderReducer } from './Order/reducer'
import { authReducer } from './auth/reducer'

import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    home: homeReducer,
    menu: menuReducer,
    order: orderReducer,
})

export default rootReducer
