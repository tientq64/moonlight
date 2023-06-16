import { createSlice } from "@reduxjs/toolkit"

import { IUser } from "../../types"

interface IState {
   user: IUser | null
}

const userSlice = createSlice({
   name: "user",

   initialState: <IState>{
      user: null
   },

   reducers: {
      setUser(state, action) {
         state.user = action.payload
      }
   }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
