import ToastReducer from "./Reducers/ToastReducer"
import LoaderReducer from "./Reducers/Loader"
import { configureStore } from '@reduxjs/toolkit'

const store=configureStore({reducer: {
    ToastConfig: ToastReducer,
    LoaderConfig: LoaderReducer
}});

export default store;