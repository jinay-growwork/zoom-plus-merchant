import actions from './actions'

const initialState = {}

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_ORDER:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
