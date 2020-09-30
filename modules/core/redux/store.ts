import { useMemo } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from './root-reducer';
import thunkMiddleware from 'redux-thunk'

const middlewares = [thunkMiddleware];

let store;

export const initializeStore = (preloadedState) => {
    let _store = store ?? createStore(
        rootReducer,
        preloadedState,
        composeWithDevTools(applyMiddleware(...middlewares))
    )

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = createStore(
            rootReducer,
            {
                ...store.getState(),
                ...preloadedState,
            },
            composeWithDevTools(applyMiddleware(...middlewares))
        )
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store

    return _store
}

export function useStore(initialState) {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    return store
}