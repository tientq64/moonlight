import { combineReducers, configureStore } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import {
   FLUSH,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
   REHYDRATE,
   persistReducer,
   persistStore
} from "redux-persist"

import userSlice from "./reducers/user"

export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

const persistConfig = {
   key: "root",
   storage,
   whitelist: ["user"]
}

const reducer = combineReducers({
   user: userSlice
})
const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
         }
      })
   }
})

export const persistor = persistStore(store)
