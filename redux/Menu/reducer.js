import actions from './actions'

const initialState = {}

export const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_CATEGORY:
            return {
                ...state,
                ...action.payload,
            }
        case actions.SET_SUB_CATEGORY:
            return {
                ...state,
                ...action.payload,
            }
        case actions.SET_SUB_CATEGORY_BY_ID:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
