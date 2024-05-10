import actions from './actions'

const initialState = {
    verifiedNumber: null,
    user: null,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.UPDATE:
            return {
                ...state,
                buttonClicked: true,
            }
        case actions.SET_AUTH_STATE:
            return {
                ...state,
                ...action.payload,
            }
        case actions.LOG_OUT:
            return initialState

        default:
            return state
    }
}
