import { useCallback } from "react"

const useHttp = () => {

    const sendRequest = useCallback(async (requestConfig, applyData) => {
        try {
            console.log(requestConfig.url);
            const response = await fetch(requestConfig.url, {
                method: requestConfig.method ? requestConfig.method : 'GET',
                headers: !requestConfig.isFormData ? (requestConfig.headers ? requestConfig.headers : {
                    'Content-Type': 'application/json',
                }) : {},
                body: requestConfig.body ? (requestConfig.isFormData ? requestConfig.body : JSON.stringify(requestConfig.body)) : null
            });
            if (!response.ok) throw new Error('Request failed!');

            const data = await response.json();
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