import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isShowToast: false,
    className: '',
    message: ''
}

const toastSlice = createSlice({
    name: 'toast',
    initialState: initialState,
    reducers: {
        showToast(state, action){
            if(action.payload.message){
                return {
                    isShowToast: true,
                    className: action.payload.className,
                    message: action.payload.message
                }
            } else {
                return state
            }
        },
        hideToast(state, action){
            return {
                isShowToast: false,
                className: '',
                message: ''
            }
        }
    }
})

export const toastActions = toastSlice.actions;

export default toastSlice.reducer;