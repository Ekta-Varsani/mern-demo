import { useCallback } from "react"
import { toastActions } from '../Redux/Reducers/ToastReducer'
import { loaderActions } from '../Redux/Reducers/Loader'
import { useDispatch } from 'react-redux'

const useHttp = () => {
    const dispatch = useDispatch()
    let timeout = null;

    const sendRequest = useCallback(async (requestConfig, applyData) => {
        if (requestConfig.isShowLoading) {
            dispatch(loaderActions.setLoader({
              isShowLoading: true
            }))
          }
          if (timeout) {
            clearTimeout(timeout)
            timeout = null;
          }
        try {
            const response = await fetch(requestConfig.url, {
                method: requestConfig.method ? requestConfig.method : 'GET',
                headers: !requestConfig.isFormData ? (requestConfig.headers ? requestConfig.headers : {
                    'Content-Type': 'application/json',
                }) : {},
                body: requestConfig.body ? (requestConfig.isFormData ? requestConfig.body : JSON.stringify(requestConfig.body)) : null
            });
            if (!response.ok) throw new Error('Request failed!');

            const data = await response.json();

            if (data.success && requestConfig.showSuccessToast) {

                dispatch(toastActions.showToast({
                  className: 'bg-success',
                  message: data.description
                }))
                timeout = setTimeout(() => {
                  dispatch(toastActions.hideToast())
                  timeout = null;
                }, 3000)
              } else if (!data.success && requestConfig.showErrorToast) {
                dispatch(toastActions.showToast({
                  className: 'bg-danger',
                  message: data.description
                }))
                timeout = setTimeout(() => {
                  dispatch(toastActions.hideToast())
                  timeout = null;
                }, 3000)
              }
            applyData(data);
        } catch (error) {
            applyData(error);
        }
    }, [])
    return {
        sendRequest: sendRequest,
    }
}

export default useHttp