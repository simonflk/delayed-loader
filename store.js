import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import questions from './reducers/questions';

export const initStore = (initialState) => {
    return createStore(
        combineReducers({ questions }),
        initialState,
        applyMiddleware(thunkMiddleware)
    )
}
