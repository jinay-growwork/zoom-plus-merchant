import actions from './actions'

const initialState = {}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_FOODS_CATEGORIES:
            return {
                ...state,
                ...action.payload,
            }
        case actions.SET_MERCHANTS_LISTS:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
