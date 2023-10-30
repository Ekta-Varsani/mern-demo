import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isShowLoading: false
}

const loaderSlice = createSlice({
    name: 'toast',
    initialState: initialState,
    reducers: {
        setLoader(state, action){
            return {
                isShowLoading: action.payload.isShowLoading
            }
        }
    }
})

export const loaderActions = loaderSlice.actions;

export default loaderSlice.reducer;