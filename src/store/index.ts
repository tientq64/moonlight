import { combineReducers, configureStore } from "@reduxjs/toolkit"

import userSlice from "./reducers/user"

export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

const reducer = combineReducers({
   user: userSlice
})

export const store = configureStore({
   reducer
})
